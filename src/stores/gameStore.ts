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
import { rollD4 } from "@/src/lib/dice";
import { miniGames } from "@/src/lib/miniGames";
import { movePosition } from "@/src/lib/movement";
import { GAME_STORAGE_KEY } from "@/src/lib/storage";
import type { BoardShape, GameState, GameStore, Team } from "@/src/types/game";

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
const DICE_OVERLAY_DURATION_MS = 1800;

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

const initialState: GameState = {
  teams: createInitialTeams(),
  miniGames,
  round: 1,
  phase: "idle",
  burstMultiplier: 1,
  isBurstActive: false,
  isManualBurstEnabled: false,
  selectedWinnerIds: [],
  lastDiceResults: {},
  selectedMiniGameId: miniGames[0]?.id ?? null,
  rouletteTargetMiniGameId: null,
  isRouletteRolling: false,
  isDiceOverlayVisible: false,
  diceOverlayStartedAt: undefined,
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

        const burstFields = getBurstFields(teams, boardCellCount, isManualBurstEnabled);
        const { isBurstActive } = burstFields;
        const appliedMultiplier = isBurstActive ? 2 : 1;
        const lastDiceResults: Record<string, number> = {};
        const movedTeams = teams.map((team) => {
          const rawDiceValue = rollD4();
          const diceResult = rawDiceValue * appliedMultiplier;
          lastDiceResults[team.id] = diceResult;

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
          phase: "selectingWinners",
          isDiceOverlayVisible: true,
          diceOverlayStartedAt: Date.now(),
          ...burstFields,
        });

        window.setTimeout(() => {
          get().hideDiceOverlay();
        }, DICE_OVERLAY_DURATION_MS);
      },
      toggleWinner: (teamId) => {
        const { selectedWinnerIds } = get();
        const isSelected = selectedWinnerIds.includes(teamId);

        set({
          selectedWinnerIds: isSelected
            ? selectedWinnerIds.filter((id) => id !== teamId)
            : [...selectedWinnerIds, teamId],
        });
      },
      resolveRound: () => {
        const { selectedWinnerIds, teams, round, boardCellCount, isManualBurstEnabled } = get();
        const finishCell = getFinishCellIndex(boardCellCount);
        const resolvedTeams = teams.map((team) => {
          const isWinner = selectedWinnerIds.includes(team.id);
          const position = isWinner ? team.position : team.previousPosition;

          return {
            ...team,
            position,
            hasFinished: position === finishCell,
          };
        });
        const burstFields = getBurstFields(resolvedTeams, boardCellCount, isManualBurstEnabled);

        set({
          teams: resolvedTeams,
          round: round + 1,
          phase: "resolved",
          ...burstFields,
          selectedWinnerIds: [],
        });
      },
      resetGame: () => {
        const { teams, boardCellCount, boardShape, selectedMiniGameId } = get();

        set({
          ...initialState,
          teams: resetTeamsForNewGame(teams),
          miniGames,
          boardCellCount,
          boardShape,
          selectedMiniGameId,
        });
      },
      manuallySetTeamPosition: (teamId, position) => {
        const { boardCellCount, isManualBurstEnabled } = get();
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

        set({
          teams,
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
      hideDiceOverlay: () => {
        set({
          isDiceOverlayVisible: false,
          diceOverlayStartedAt: undefined,
        });
      },
      rollMiniGame: () => {
        const { isRouletteRolling } = get();

        if (isRouletteRolling) {
          return;
        }

        const { miniGames: currentMiniGames } = get();
        const selectedMiniGame = currentMiniGames[Math.floor(Math.random() * currentMiniGames.length)];

        window.setTimeout(() => {
          set({
            selectedMiniGameId: selectedMiniGame?.id ?? null,
            rouletteTargetMiniGameId: null,
            isRouletteRolling: false,
          });
        }, MINI_GAME_ROULETTE_DURATION_MS);

        set({
          rouletteTargetMiniGameId: selectedMiniGame?.id ?? null,
          isRouletteRolling: true,
        });
      },
      setSelectedMiniGame: (miniGameId) => {
        const exists = get().miniGames.some((miniGame) => miniGame.id === miniGameId);

        if (!exists) {
          return;
        }

        set({
          selectedMiniGameId: miniGameId,
          rouletteTargetMiniGameId: null,
          isRouletteRolling: false,
        });
      },
      setBoardCellCount: (count) => {
        const nextCellCount = clampBoardCellCount(count);
        const { boardCellCount, teams, isManualBurstEnabled } = get();

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

        set({
          boardCellCount: nextCellCount,
          teams: adjustedTeams,
          ...burstFields,
        });
      },
      setBoardShape: (shape) => {
        set({ boardShape: shape });
      },
      setTeamCount: (count) => {
        const nextTeamCount = clampTeamCount(count);
        const { teams, selectedWinnerIds, boardCellCount, isManualBurstEnabled } = get();
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

        set({
          teams: nextTeams,
          selectedWinnerIds: selectedWinnerIds.filter((teamId) => nextTeamIds.has(teamId)),
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

        return {
          ...mergedState,
          ...getBurstFields(
            mergedState.teams,
            mergedState.boardCellCount,
            Boolean(mergedState.isManualBurstEnabled),
          ),
          isManualBurstEnabled: Boolean(mergedState.isManualBurstEnabled),
          isRouletteRolling: false,
          rouletteTargetMiniGameId: null,
          isDiceOverlayVisible: false,
          diceOverlayStartedAt: undefined,
        };
      },
      partialize: (state) => ({
        teams: state.teams,
        miniGames: state.miniGames,
        round: state.round,
        phase: state.phase,
        burstMultiplier: state.burstMultiplier,
        isBurstActive: state.isBurstActive,
        isManualBurstEnabled: state.isManualBurstEnabled,
        selectedWinnerIds: state.selectedWinnerIds,
        lastDiceResults: state.lastDiceResults,
        selectedMiniGameId: state.selectedMiniGameId,
        boardCellCount: state.boardCellCount,
        boardShape: state.boardShape,
      }),
    },
  ),
);
