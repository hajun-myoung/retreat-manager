import { getFinishCellIndex } from "@/src/lib/board";
import type { Team } from "@/src/types/game";

export const BURST_FINISHER_THRESHOLD = 4;

export function getFinishedTeamCount(teams: Team[], cellCount: number) {
  const finishCell = getFinishCellIndex(cellCount);

  return teams.filter((team) => team.position === finishCell || team.hasFinished).length;
}

export function shouldActivateBurst(teams: Team[], cellCount: number) {
  return getFinishedTeamCount(teams, cellCount) >= BURST_FINISHER_THRESHOLD;
}
