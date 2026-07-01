import { clampBoardPosition, getBoardCell, getFinishCellIndex, type BoardCell } from "@/src/lib/board";
import type { Team } from "@/src/types/game";

export function movePosition(position: number, amount: number, cellCount: number) {
  return Math.min(clampBoardPosition(position, cellCount) + amount, getFinishCellIndex(cellCount));
}

export function getPawnOffset(index: number, total: number) {
  if (total <= 1) {
    return { x: 0, y: 0 };
  }

  const radius = total <= 4 ? 18 : 26;
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export function getPawnTarget(team: Team, teams: Team[], cells: BoardCell[]) {
  const cellMates = teams.filter((candidate) => candidate.position === team.position);
  const stackIndex = cellMates.findIndex((candidate) => candidate.id === team.id);
  const offset = getPawnOffset(stackIndex, cellMates.length);
  const cell = getBoardCell(cells, team.position);

  return {
    x: cell.x + offset.x,
    y: cell.y + offset.y,
  };
}
