import { FINISH_CELL } from "@/src/lib/board";
import type { Team } from "@/src/types/game";

export const BURST_FINISHER_THRESHOLD = 4;

export function shouldActivateBurst(teams: Team[]) {
  return teams.filter((team) => team.position === FINISH_CELL || team.hasFinished).length >= BURST_FINISHER_THRESHOLD;
}

