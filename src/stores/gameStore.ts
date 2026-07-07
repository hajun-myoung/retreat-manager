"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { shouldActivateBurst } from "@/src/lib/burst";
import {
  DEFAULT_BOARD_CELL_COUNT,
  START_CELL,
  clampBoardCellCount,
  clampBoardPosition,
  getFinishCellIndex,
} from "@/src/lib/board";
import { rollWeightedDice } from "@/src/lib/dice";
import { miniGames } from "@/src/lib/miniGames";
import { movePosition } from "@/src/lib/movement";
import { GAME_STORAGE_KEY } from "@/src/lib/storage";
import type { BoardShape, DiceRollResult, FinishRecord, GameState, GameStore, Team } from "@/src/types/game";

const teamColors = [
  "#ff4d6d",
  "#ffd166",
  "#06d6a0",
  "#4cc9f0",
  "#f72585",
  "#b8f35a",
  "#f77f00",
  "#9b5de5",
  "#00f5d4",
  "#f15bb5",
  "#fee440",
  "#00bbf9",
];

const DEFAULT_TEAM_COUNT = 8;
const MIN_TEAM_COUNT = 2;
const MAX_TEAM_COUNT = 12;
const DEFAULT_BOARD_SHAPE: BoardShape = "square";
const MINI_GAME_ROULETTE_DURATION_MS = 3000;
const DICE_ROLLING_DURATION_MS = 1500;
const defaultMiniGameIds = miniGames.map((miniGame) => miniGame.id);

function clampTeamCount(count: number) {
  if (Number.isNaN(count)) {
    return DEFAULT_TEAM_COUNT;
  }

  return Math.max(MIN_TEAM_COUNT, Math.min(MAX_TEAM_COUNT, Math.round(count)));
}

function createTeam(index: number): Team {
  return {
    id: `team-${index + 1}`,
    name: `${index + 1}팀`,
    color: teamColors[index % teamColors.length],
    position: START_CELL,
    previousPosition: START_CELL,
    diceValue: null,
    hasFinished: false,
  };
}

function createInitialTeams(count = DEFAULT_TEAM_COUNT): Team[] {
  return Array.from({ length: clampTeamCount(count) }, (_, index) => createTeam(index));
}

function resetTeamsForNewGame(teams: Team[]): Team[] {
  return teams.map((team) => ({
    ...team,
    position: START_CELL,
    previousPosition: START_CELL,
    diceValue: null,
    hasFinished: false,
  }));
}

function getBurstFields(teams: Team[], boardCellCount: number, isManualBurstEnabled: boolean) {
  const isBurstActive = isManualBurstEnabled || shouldActivateBurst(teams, boardCellCount);

  return {
    isBurstActive,
    burstMultiplier: isBurstActive ? 2 : 1,
  } satisfies Pick<GameState, "isBurstActive" | "burstMultiplier">;
}

function addFinishRecordsForRound({
  teams,
  selectedWinnerIds,
  existingRecords,
  boardCellCount,
  round,
}: {
  teams: Team[];
  selectedWinnerIds: string[];
  existingRecords: FinishRecord[];
  boardCellCount: number;
  round: number;
}) {
  const finishCell = getFinishCellIndex(boardCellCount);
  const recordedTeamIds = new Set(existingRecords.map((record) => record.teamId));
  const nextRecords = [...existingRecords];

  teams.forEach((team) => {
    if (
      selectedWinnerIds.includes(team.id) &&
      team.position === finishCell &&
      !recordedTeamIds.has(team.id)
    ) {
      nextRecords.push({
        teamId: team.id,
        rank: nextRecords.length + 1,
        round,
        type: "finished",
      });
      recordedTeamIds.add(team.id);
    }
  });

  if (nextRecords.length === teams.length - 1) {
    const lastTeam = teams.find((team) => !recordedTeamIds.has(team.id));

    if (lastTeam) {
      nextRecords.push({
        teamId: lastTeam.id,
        rank: nextRecords.length + 1,
        round,
        type: "autoLast",
      });
    }
  }

  return nextRecords;
}

function areAllTeamsFinished(teams: Team[]) {
  return teams.length > 0 && teams.every((team) => team.hasFinished);
}

function getSettledPhaseForTeams(phase: GameState["phase"], teams: Team[]) {
  if (areAllTeamsFinished(teams)) {
    return "completed";
  }

  if (phase === "completed") {
    return "resolved";
  }

  return phase;
}

function reconcileFinishRecordsForTeams(records: FinishRecord[], teams: Team[], round: number) {
  const teamsById = new Map(teams.map((team) => [team.id, team]));
  const recordedTeamIds = new Set<string>();
  const nextRecords: FinishRecord[] = records
    .filter((record) => {
      const team = teamsById.get(record.teamId);

      return Boolean(team?.hasFinished);
    })
    .map((record, index) => ({
      ...record,
      type: "finished" as const,
      rank: index + 1,
    }));

  nextRecords.forEach((record) => recordedTeamIds.add(record.teamId));

  teams.forEach((team) => {
    if (team.hasFinished && !recordedTeamIds.has(team.id)) {
      nextRecords.push({
        teamId: team.id,
        rank: nextRecords.length + 1,
        round,
        type: "finished",
      });
      recordedTeamIds.add(team.id);
    }
  });

  if (teams.length > 1 && nextRecords.length === teams.length - 1) {
    const lastTeam = teams.find((team) => !recordedTeamIds.has(team.id));

    if (lastTeam) {
      nextRecords.push({
        teamId: lastTeam.id,
        rank: nextRecords.length + 1,
        round,
        type: "autoLast",
      });
    }
  }

  return nextRecords;
}

function normalizeDiceResults(
  results: GameState["lastDiceResults"] | Record<string, number> | undefined,
) {
  if (!results) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(results).map(([teamId, result]) => {
      if (typeof result === "number") {
        const baseValue = Math.max(1, Math.min(4, Math.round(result)));

        return [
          teamId,
          {
            teamId,
            baseValue,
            multiplier: 1,
            finalValue: baseValue,
          } satisfies DiceRollResult,
        ];
      }

      const multiplier = result.multiplier === 2 ? 2 : 1;
      const baseValue = Math.max(1, Math.min(4, Math.round(result.baseValue)));

      return [
        teamId,
        {
          ...result,
          baseValue,
          multiplier,
          finalValue: baseValue * multiplier,
        } satisfies DiceRollResult,
      ];
    }),
  );
}

const initialState: GameState = {
  teams: createInitialTeams(),
  miniGames,
  remainingMiniGameIds: defaultMiniGameIds,
  round: 1,
  phase: "idle",
  burstMultiplier: 1,
  isBurstActive: false,
  isManualBurstEnabled: false,
  selectedWinnerIds: [],
  lastDiceResults: {},
  finishRecords: [],
  selectedMiniGameId: miniGames[0]?.id ?? null,
  rouletteTargetMiniGameId: null,
  isRouletteRolling: false,
  isDiceOverlayVisible: false,
  isDiceRolling: false,
  boardCellCount: DEFAULT_BOARD_CELL_COUNT,
  boardShape: DEFAULT_BOARD_SHAPE,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      rollDiceForAllTeams: () => {
        const { phase, teams, boardCellCount, isManualBurstEnabled } = get();

        if (phase !== "idle" && phase !== "resolved") {
          return;
        }

        const activeTeams = teams.filter((team) => !team.hasFinished);

        if (activeTeams.length === 0) {
          set({ phase: "completed" });
          return;
        }

        set({ phase: "rolling" });

        const burstFields = getBurstFields(teams, boardCellCount, isManualBurstEnabled);
        const { isBurstActive } = burstFields;
        const appliedMultiplier = isBurstActive ? 2 : 1;
        const activeTeamIds = new Set(activeTeams.map((team) => team.id));
        const lastDiceResults: Record<string, DiceRollResult> = {};
        const movedTeams = teams.map((team) => {
          if (!activeTeamIds.has(team.id)) {
            return {
              ...team,
              diceValue: null,
            };
          }

          const baseValue = rollWeightedDice();
          const diceResult = baseValue * appliedMultiplier;
          lastDiceResults[team.id] = {
            teamId: team.id,
            baseValue,
            multiplier: appliedMultiplier,
            finalValue: diceResult,
          };

          return {
            ...team,
            previousPosition: team.position,
            diceValue: diceResult,
            position: movePosition(team.position, diceResult, boardCellCount),
          };
        });

        set({
          teams: movedTeams,
          lastDiceResults,
          selectedWinnerIds: [],
          phase: "awaitingMiniGame",
          isDiceOverlayVisible: true,
          isDiceRolling: true,
          ...burstFields,
        });

        get().rollMiniGame();

        window.setTimeout(() => {
          set({ isDiceRolling: false });
        }, DICE_ROLLING_DURATION_MS);
      },
      toggleWinner: (teamId) => {
        const { selectedWinnerIds, phase, isDiceOverlayVisible, isDiceRolling, lastDiceResults } = get();

        if (isDiceRolling || (phase !== "awaitingMiniGame" && !isDiceOverlayVisible)) {
          return;
        }

        if (!lastDiceResults[teamId]) {
          return;
        }

        const isSelected = selectedWinnerIds.includes(teamId);

        set({
          selectedWinnerIds: isSelected
            ? selectedWinnerIds.filter((id) => id !== teamId)
            : [...selectedWinnerIds, teamId],
        });
      },
      resolveRound: () => {
        const {
          selectedWinnerIds,
          teams,
          round,
          boardCellCount,
          isManualBurstEnabled,
          phase,
          finishRecords,
          isDiceRolling,
          lastDiceResults,
        } = get();

        if (phase !== "awaitingMiniGame" || isDiceRolling) {
          return;
        }

        set({ phase: "resolving" });

        const finishCell = getFinishCellIndex(boardCellCount);
        const currentRollTeamIds = new Set(Object.keys(lastDiceResults));
        const resolvedTeams = teams.map((team) => {
          if (!currentRollTeamIds.has(team.id)) {
            return team;
          }

          const isWinner = selectedWinnerIds.includes(team.id);
          const position = isWinner ? team.position : team.previousPosition;

          return {
            ...team,
            position,
            hasFinished: position === finishCell,
          };
        });
        const nextFinishRecords = addFinishRecordsForRound({
          teams: resolvedTeams,
          selectedWinnerIds,
          existingRecords: finishRecords,
          boardCellCount,
          round,
        });
        const burstFields = getBurstFields(resolvedTeams, boardCellCount, isManualBurstEnabled);

        set({
          teams: resolvedTeams,
          finishRecords: nextFinishRecords,
          round: round + 1,
          phase: getSettledPhaseForTeams("resolved", resolvedTeams),
          ...burstFields,
          selectedWinnerIds: [],
          isDiceOverlayVisible: false,
          isDiceRolling: false,
        });
      },
      resetGame: () => {
        const { teams, boardCellCount, boardShape, selectedMiniGameId } = get();

        set({
          ...initialState,
          teams: resetTeamsForNewGame(teams),
          miniGames,
          remainingMiniGameIds: defaultMiniGameIds,
          finishRecords: [],
          boardCellCount,
          boardShape,
          selectedMiniGameId,
        });
      },
      manuallySetTeamPosition: (teamId, position) => {
        const {
          boardCellCount,
          isManualBurstEnabled,
          finishRecords,
          round,
          phase,
          selectedWinnerIds,
          lastDiceResults,
        } = get();
        const finishCell = getFinishCellIndex(boardCellCount);
        const nextPosition = clampBoardPosition(position, boardCellCount);
        const teams = get().teams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                position: nextPosition,
                previousPosition: nextPosition,
                hasFinished: nextPosition === finishCell,
              }
            : team,
        );
        const burstFields = getBurstFields(teams, boardCellCount, isManualBurstEnabled);
        const reconciledFinishRecords = reconcileFinishRecordsForTeams(finishRecords, teams, round);
        const nextTeam = teams.find((team) => team.id === teamId);
        const nextLastDiceResults = nextTeam?.hasFinished
          ? Object.fromEntries(Object.entries(lastDiceResults).filter(([id]) => id !== teamId))
          : lastDiceResults;

        set({
          teams,
          phase: getSettledPhaseForTeams(phase, teams),
          finishRecords: reconciledFinishRecords,
          selectedWinnerIds: selectedWinnerIds.filter((id) => id !== teamId || !nextTeam?.hasFinished),
          lastDiceResults: nextLastDiceResults,
          ...burstFields,
        });
      },
      toggleManualBurst: () => {
        const { teams, boardCellCount, isManualBurstEnabled } = get();
        const nextManualBurstEnabled = !isManualBurstEnabled;

        set({
          isManualBurstEnabled: nextManualBurstEnabled,
          ...getBurstFields(teams, boardCellCount, nextManualBurstEnabled),
        });
      },
      openDiceOverlay: () => {
        const { phase } = get();

        if (phase === "awaitingMiniGame") {
          set({ isDiceOverlayVisible: true });
        }
      },
      closeDiceOverlay: () => {
        const { phase } = get();

        if (phase === "awaitingMiniGame") {
          const confirmed = window.confirm(
            "아직 라운드 결과가 반영되지 않았습니다. 결과 처리 화면을 닫을까요? 사이드바에서 다시 열 수 있습니다.",
          );

          if (!confirmed) {
            return;
          }
        }

        set({ isDiceOverlayVisible: false });
      },
      rollMiniGame: () => {
        const { isRouletteRolling } = get();

        if (isRouletteRolling) {
          return;
        }

        const { miniGames: currentMiniGames, remainingMiniGameIds } = get();
        const availableMiniGames = currentMiniGames.filter((miniGame) =>
          remainingMiniGameIds.includes(miniGame.id),
        );

        if (availableMiniGames.length === 0) {
          set({
            selectedMiniGameId: null,
            rouletteTargetMiniGameId: null,
            isRouletteRolling: false,
          });
          return;
        }

        const selectedMiniGame =
          availableMiniGames[Math.floor(Math.random() * availableMiniGames.length)];
        const selectedMiniGameId = selectedMiniGame?.id ?? null;

        window.setTimeout(() => {
          const { rouletteTargetMiniGameId } = get();

          if (rouletteTargetMiniGameId !== selectedMiniGameId) {
            return;
          }

          const remainingMiniGameIds = get().remainingMiniGameIds.filter(
            (miniGameId) => miniGameId !== selectedMiniGameId,
          );

          set({
            selectedMiniGameId,
            remainingMiniGameIds,
            rouletteTargetMiniGameId: null,
            isRouletteRolling: false,
          });
        }, MINI_GAME_ROULETTE_DURATION_MS);

        set({
          rouletteTargetMiniGameId: selectedMiniGameId,
          isRouletteRolling: true,
        });
      },
      resetMiniGamePool: () => {
        set({
          remainingMiniGameIds: defaultMiniGameIds,
          rouletteTargetMiniGameId: null,
          isRouletteRolling: false,
        });
      },
      setSelectedMiniGame: (miniGameId) => {
        const { miniGames: currentMiniGames, remainingMiniGameIds, selectedMiniGameId } = get();
        const exists = currentMiniGames.some((miniGame) => miniGame.id === miniGameId);
        const isAlreadySelected = selectedMiniGameId === miniGameId;
        const isAvailable = remainingMiniGameIds.includes(miniGameId);

        if (!exists || (!isAlreadySelected && !isAvailable)) {
          return;
        }

        set({
          selectedMiniGameId: miniGameId,
          remainingMiniGameIds: isAlreadySelected
            ? remainingMiniGameIds
            : remainingMiniGameIds.filter((remainingMiniGameId) => remainingMiniGameId !== miniGameId),
          rouletteTargetMiniGameId: null,
          isRouletteRolling: false,
        });
      },
      setBoardCellCount: (count) => {
        const nextCellCount = clampBoardCellCount(count);
        const { boardCellCount, teams, isManualBurstEnabled, finishRecords, round, phase } = get();

        if (nextCellCount === boardCellCount) {
          return;
        }

        const confirmed = window.confirm(
          `보드 칸 수를 ${boardCellCount}칸에서 ${nextCellCount}칸으로 변경할까요? 팀 위치가 새 도착점 범위에 맞게 보정됩니다.`,
        );

        if (!confirmed) {
          return;
        }

        const finishCell = getFinishCellIndex(nextCellCount);
        const adjustedTeams = teams.map((team) => {
          const position = clampBoardPosition(team.position, nextCellCount);
          const previousPosition = clampBoardPosition(team.previousPosition, nextCellCount);

          return {
            ...team,
            position,
            previousPosition,
            hasFinished: position === finishCell,
          };
        });
        const burstFields = getBurstFields(adjustedTeams, nextCellCount, isManualBurstEnabled);
        const reconciledFinishRecords = reconcileFinishRecordsForTeams(finishRecords, adjustedTeams, round);

        set({
          boardCellCount: nextCellCount,
          teams: adjustedTeams,
          phase: getSettledPhaseForTeams(phase, adjustedTeams),
          finishRecords: reconciledFinishRecords,
          ...burstFields,
        });
      },
      setBoardShape: (shape) => {
        set({ boardShape: shape });
      },
      setTeamCount: (count) => {
        const nextTeamCount = clampTeamCount(count);
        const { teams, selectedWinnerIds, boardCellCount, isManualBurstEnabled, finishRecords, round, phase } =
          get();
        const nextTeams =
          nextTeamCount <= teams.length
            ? teams.slice(0, nextTeamCount)
            : [
                ...teams,
                ...Array.from({ length: nextTeamCount - teams.length }, (_, index) =>
                  createTeam(teams.length + index),
                ),
              ];
        const nextTeamIds = new Set(nextTeams.map((team) => team.id));
        const filteredFinishRecords = reconcileFinishRecordsForTeams(finishRecords, nextTeams, round);

        set({
          teams: nextTeams,
          selectedWinnerIds: selectedWinnerIds.filter((teamId) => nextTeamIds.has(teamId)),
          finishRecords: filteredFinishRecords,
          phase: getSettledPhaseForTeams(phase, nextTeams),
          ...getBurstFields(nextTeams, boardCellCount, isManualBurstEnabled),
        });
      },
      updateTeamName: (teamId, name) => {
        const safeName = name.trimStart();

        set({
          teams: get().teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  name: safeName,
                }
              : team,
          ),
        });
      },
    }),
    {
      name: GAME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const mergedState = {
          ...currentState,
          ...(persistedState as Partial<GameState>),
          miniGames,
        } as GameStore;
        const normalizedPhase =
          (mergedState.phase as string) === "selectingWinners"
            ? "awaitingMiniGame"
            : mergedState.phase;
        const reconciledFinishRecords = reconcileFinishRecordsForTeams(
          mergedState.finishRecords ?? [],
          mergedState.teams,
          mergedState.round,
        );
        const selectedMiniGameId = miniGames.some(
          (miniGame) => miniGame.id === mergedState.selectedMiniGameId,
        )
          ? mergedState.selectedMiniGameId
          : miniGames[0]?.id ?? null;
        const persistedRemainingMiniGameIds = Array.isArray(mergedState.remainingMiniGameIds)
          ? mergedState.remainingMiniGameIds
          : defaultMiniGameIds;
        const remainingMiniGameIds = persistedRemainingMiniGameIds.filter((miniGameId) =>
          defaultMiniGameIds.includes(miniGameId),
        );

        return {
          ...mergedState,
          ...getBurstFields(
            mergedState.teams,
            mergedState.boardCellCount,
            Boolean(mergedState.isManualBurstEnabled),
          ),
          phase: getSettledPhaseForTeams(normalizedPhase, mergedState.teams),
          finishRecords: reconciledFinishRecords,
          lastDiceResults: normalizeDiceResults(mergedState.lastDiceResults),
          selectedMiniGameId,
          remainingMiniGameIds,
          isManualBurstEnabled: Boolean(mergedState.isManualBurstEnabled),
          isRouletteRolling: false,
          rouletteTargetMiniGameId: null,
          isDiceOverlayVisible: false,
          isDiceRolling: false,
        };
      },
      partialize: (state) => ({
        teams: state.teams,
        miniGames: state.miniGames,
        remainingMiniGameIds: state.remainingMiniGameIds,
        round: state.round,
        phase: state.phase,
        burstMultiplier: state.burstMultiplier,
        isBurstActive: state.isBurstActive,
        isManualBurstEnabled: state.isManualBurstEnabled,
        selectedWinnerIds: state.selectedWinnerIds,
        lastDiceResults: state.lastDiceResults,
        finishRecords: state.finishRecords,
        selectedMiniGameId: state.selectedMiniGameId,
        boardCellCount: state.boardCellCount,
        boardShape: state.boardShape,
      }),
    },
  ),
);
