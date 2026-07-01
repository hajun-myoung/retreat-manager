export const BOARD_CELL_COUNT = 22;
export const START_CELL = 0;
export const FINISH_CELL = 21;
export const BOARD_WIDTH = 1000;
export const BOARD_HEIGHT = 720;

export type BoardCell = {
  index: number;
  label: string;
  x: number;
  y: number;
  isStart: boolean;
  isFinish: boolean;
};

const cellCoordinates: Array<{ x: number; y: number }> = [
  { x: 84, y: 84 },
  { x: 222, y: 84 },
  { x: 360, y: 84 },
  { x: 498, y: 84 },
  { x: 636, y: 84 },
  { x: 774, y: 84 },
  { x: 916, y: 84 },
  { x: 916, y: 222 },
  { x: 916, y: 360 },
  { x: 916, y: 498 },
  { x: 916, y: 636 },
  { x: 774, y: 636 },
  { x: 636, y: 636 },
  { x: 498, y: 636 },
  { x: 360, y: 636 },
  { x: 222, y: 636 },
  { x: 84, y: 636 },
  { x: 84, y: 498 },
  { x: 84, y: 360 },
  { x: 84, y: 222 },
  { x: 222, y: 222 },
  { x: 360, y: 360 },
];

export const boardCells: BoardCell[] = cellCoordinates.map((cell, index) => ({
  ...cell,
  index,
  label: String(index),
  isStart: index === START_CELL,
  isFinish: index === FINISH_CELL,
}));

export function clampBoardPosition(position: number) {
  if (Number.isNaN(position)) {
    return START_CELL;
  }

  return Math.max(START_CELL, Math.min(FINISH_CELL, Math.round(position)));
}

export function getBoardCell(position: number) {
  return boardCells[clampBoardPosition(position)];
}

