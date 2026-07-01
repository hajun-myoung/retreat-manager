"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { shouldActivateBurst } from "@/src/lib/burst";
import { FINISH_CELL, START_CELL, clampBoardPosition } from "@/src/lib/board";
import { rollD4 } from "@/src/lib/dice";
import { movePosition } from "@/src/lib/movement";
import { GAME_STORAGE_KEY } from "@/src/lib/storage";
import type { GameState, GameStore, Team } from "@/src/types/game";

const teamColors = [
  "#ff4d6d",
  "#ffd166",
  "#06d6a0",
  "#4cc9f0",
  "#f72585",
  "#b8f35a",
  "#f77f00",
  "#9b5de5",
];

function createInitialTeams(): Team[] {
  return teamColors.map((color, index) => ({
    id: `team-${index + 1}`,
    name: `${index + 1}팀`,
    color,
    position: START_CELL,
    previousPosition: START_CELL,
    diceValue: null,
    hasFinished: false,
  }));
}

const initialState: GameState = {
  teams: createInitialTeams(),
  round: 1,
  phase: "idle",
  burstMultiplier: 1,
  isBurstActive: false,
  selectedWinnerIds: [],
  lastDiceResults: {},
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      rollDiceForAllTeams: () => {
        const { phase, teams, isBurstActive, burstMultiplier } = get();

        if (phase !== "idle" && phase !== "resolved") {
          return;
        }

        const lastDiceResults: Record<string, number> = {};
        const movedTeams = teams.map((team) => {
          const rawDiceValue = rollD4();
          const diceResult = rawDiceValue * (isBurstActive ? burstMultiplier : 1);
          lastDiceResults[team.id] = diceResult;

          return {
            ...team,
            previousPosition: team.position,
            diceValue: diceResult,
            position: movePosition(team.position, diceResult),
          };
        });

        set({
          teams: movedTeams,
          lastDiceResults,
          selectedWinnerIds: [],
          phase: "selectingWinners",
        });
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
        const { selectedWinnerIds, teams, round } = get();
        const resolvedTeams = teams.map((team) => {
          const isWinner = selectedWinnerIds.includes(team.id);
          const position = isWinner ? team.position : team.previousPosition;

          return {
            ...team,
            position,
            hasFinished: position === FINISH_CELL || team.hasFinished,
          };
        });
        const isBurstActive = shouldActivateBurst(resolvedTeams);

        set({
          teams: resolvedTeams,
          round: round + 1,
          phase: "resolved",
          burstMultiplier: isBurstActive ? 2 : 1,
          isBurstActive,
          selectedWinnerIds: [],
        });
      },
      resetGame: () => {
        set({
          ...initialState,
          teams: createInitialTeams(),
        });
      },
      manuallySetTeamPosition: (teamId, position) => {
        const nextPosition = clampBoardPosition(position);
        const teams = get().teams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                position: nextPosition,
                previousPosition: nextPosition,
                hasFinished: nextPosition === FINISH_CELL,
              }
            : team,
        );
        const isBurstActive = shouldActivateBurst(teams);

        set({
          teams,
          isBurstActive,
          burstMultiplier: isBurstActive ? 2 : 1,
        });
      },
    }),
    {
      name: GAME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        teams: state.teams,
        round: state.round,
        phase: state.phase,
        burstMultiplier: state.burstMultiplier,
        isBurstActive: state.isBurstActive,
        selectedWinnerIds: state.selectedWinnerIds,
        lastDiceResults: state.lastDiceResults,
      }),
    },
  ),
);

