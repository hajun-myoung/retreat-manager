"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LeaderboardEntry, ScoreRecord, ScoreboardStore, ScoreboardTeam } from "@/src/types/scoreboard";

const SCOREBOARD_STORAGE_KEY = "retreat-wide-scoreboard";
const DEFAULT_ACTIVITY_TITLE = "Activity 1";
const DEFAULT_TEAM_COUNT = 8;
const MAX_REVEAL_STEP = 4;

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

function clampTeamCount(count: number) {
  if (Number.isNaN(count)) {
    return DEFAULT_TEAM_COUNT;
  }

  return Math.max(0, Math.min(40, Math.round(count)));
}

function createTeam(teamNumber: number): ScoreboardTeam {
  return {
    id: `score-team-${teamNumber}`,
    name: `Team ${teamNumber}`,
    color: teamColors[(teamNumber - 1) % teamColors.length],
  };
}

function createInitialTeams(count = DEFAULT_TEAM_COUNT) {
  return Array.from({ length: count }, (_, index) => createTeam(index + 1));
}

function getNextTeamNumber(teams: ScoreboardTeam[]) {
  return (
    teams.reduce((max, team) => {
      const match = team.id.match(/^score-team-(\d+)$/);

      return match ? Math.max(max, Number(match[1])) : max;
    }, 0) + 1
  );
}

function createRecordId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `score-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeActivityTitle(activityTitle: string) {
  return activityTitle.trim() || DEFAULT_ACTIVITY_TITLE;
}

function removeRecordsForMissingTeams(records: ScoreRecord[], teams: ScoreboardTeam[]) {
  const teamIds = new Set(teams.map((team) => team.id));

  return records.filter((record) => teamIds.has(record.teamId));
}

export function getLeaderboardEntries(teams: ScoreboardTeam[], records: ScoreRecord[]): LeaderboardEntry[] {
  const totals = new Map<string, { totalScore: number; scoreCount: number }>();

  teams.forEach((team) => {
    totals.set(team.id, { totalScore: 0, scoreCount: 0 });
  });

  records.forEach((record) => {
    const teamTotal = totals.get(record.teamId);

    if (!teamTotal) {
      return;
    }

    teamTotal.totalScore += record.points;
    teamTotal.scoreCount += 1;
  });

  let previousScore: number | null = null;
  let previousRank = 0;

  return teams
    .map((team, index) => {
      const total = totals.get(team.id) ?? { totalScore: 0, scoreCount: 0 };

      return {
        team,
        totalScore: total.totalScore,
        scoreCount: total.scoreCount,
        originalIndex: index,
      };
    })
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }

      return a.originalIndex - b.originalIndex;
    })
    .map((entry, index) => {
      const rank = previousScore === entry.totalScore ? previousRank : index + 1;
      previousScore = entry.totalScore;
      previousRank = rank;

      return {
        team: entry.team,
        totalScore: entry.totalScore,
        scoreCount: entry.scoreCount,
        rank,
      };
    });
}

const initialTeams = createInitialTeams();

const initialState = {
  teams: initialTeams,
  scoreRecords: [],
  activityTitle: DEFAULT_ACTIVITY_TITLE,
  isViewOnlyMode: false,
  revealStep: 0,
  nextTeamNumber: DEFAULT_TEAM_COUNT + 1,
};

export const useScoreboardStore = create<ScoreboardStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      addScoreRecord: ({ teamId, points, activityTitle, note }) => {
        const teamExists = get().teams.some((team) => team.id === teamId);
        const safePoints = Math.trunc(points);

        if (!teamExists || Number.isNaN(safePoints)) {
          return;
        }

        set((state) => ({
          activityTitle: normalizeActivityTitle(activityTitle),
          scoreRecords: [
            {
              id: createRecordId(),
              teamId,
              points: safePoints,
              activityTitle: normalizeActivityTitle(activityTitle),
              note: note.trim(),
              createdAt: new Date().toISOString(),
            },
            ...state.scoreRecords,
          ],
        }));
      },
      addTeam: () => {
        const { nextTeamNumber } = get();

        set((state) => ({
          teams: [...state.teams, createTeam(nextTeamNumber)],
          nextTeamNumber: nextTeamNumber + 1,
        }));
      },
      removeTeam: (teamId) => {
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
          scoreRecords: state.scoreRecords.filter((record) => record.teamId !== teamId),
        }));
      },
      setTeamCount: (count) => {
        const nextCount = clampTeamCount(count);

        set((state) => {
          if (nextCount === state.teams.length) {
            return state;
          }

          if (nextCount < state.teams.length) {
            const teams = state.teams.slice(0, nextCount);

            return {
              teams,
              scoreRecords: removeRecordsForMissingTeams(state.scoreRecords, teams),
            };
          }

          const teamsToAdd = Array.from({ length: nextCount - state.teams.length }, (_, index) =>
            createTeam(state.nextTeamNumber + index),
          );

          return {
            teams: [...state.teams, ...teamsToAdd],
            nextTeamNumber: state.nextTeamNumber + teamsToAdd.length,
          };
        });
      },
      updateTeamName: (teamId, name) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  name: name.trimStart(),
                }
              : team,
          ),
        }));
      },
      updateTeamColor: (teamId, color) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  color,
                }
              : team,
          ),
        }));
      },
      setActivityTitle: (activityTitle) => {
        set({ activityTitle });
      },
      toggleViewOnlyMode: () => {
        set((state) => ({ isViewOnlyMode: !state.isViewOnlyMode }));
      },
      setRevealStep: (step) => {
        set({ revealStep: Math.max(0, Math.min(MAX_REVEAL_STEP, Math.round(step))) });
      },
      resetReveal: () => {
        set({ revealStep: 0 });
      },
      clearScoreboardData: () => {
        set(initialState);
      },
    }),
    {
      name: SCOREBOARD_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const mergedState = {
          ...currentState,
          ...(persistedState as Partial<ScoreboardStore>),
        } as ScoreboardStore;
        const teams = mergedState.teams?.length ? mergedState.teams : initialTeams;

        return {
          ...mergedState,
          teams,
          scoreRecords: removeRecordsForMissingTeams(mergedState.scoreRecords ?? [], teams),
          activityTitle: mergedState.activityTitle || DEFAULT_ACTIVITY_TITLE,
          isViewOnlyMode: Boolean(mergedState.isViewOnlyMode),
          revealStep: Math.max(0, Math.min(MAX_REVEAL_STEP, Math.round(mergedState.revealStep ?? 0))),
          nextTeamNumber: Math.max(mergedState.nextTeamNumber ?? 1, getNextTeamNumber(teams)),
        };
      },
      partialize: (state) => ({
        teams: state.teams,
        scoreRecords: state.scoreRecords,
        activityTitle: state.activityTitle,
        isViewOnlyMode: state.isViewOnlyMode,
        revealStep: state.revealStep,
        nextTeamNumber: state.nextTeamNumber,
      }),
    },
  ),
);
