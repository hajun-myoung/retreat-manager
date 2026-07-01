import type { BoardShape } from "@/src/types/game";

export const DEFAULT_BOARD_CELL_COUNT = 22;
export const MIN_BOARD_CELL_COUNT = 12;
export const MAX_BOARD_CELL_COUNT = 40;
export const START_CELL = 0;
export const BOARD_WIDTH = 1000;
export const BOARD_HEIGHT = 720;

export type BoardCell = {
  index: number;
  label: string;
  x: number;
  y: number;
};

type Point = {
  x: number;
  y: number;
};

type GenerateBoardCellsOptions = {
  cellCount: number;
  shape: BoardShape;
  width: number;
  height: number;
};

export function getFinishCellIndex(cellCount: number) {
  return clampBoardCellCount(cellCount) - 1;
}

export function clampBoardCellCount(count: number) {
  if (Number.isNaN(count)) {
    return DEFAULT_BOARD_CELL_COUNT;
  }

  return Math.max(MIN_BOARD_CELL_COUNT, Math.min(MAX_BOARD_CELL_COUNT, Math.round(count)));
}

export function clampBoardPosition(position: number, cellCount = DEFAULT_BOARD_CELL_COUNT) {
  if (Number.isNaN(position)) {
    return START_CELL;
  }

  return Math.max(START_CELL, Math.min(getFinishCellIndex(cellCount), Math.round(position)));
}

export function generateBoardCells({
  cellCount,
  shape,
  width,
  height,
}: GenerateBoardCellsOptions): BoardCell[] {
  const safeCellCount = clampBoardCellCount(cellCount);
  const points = samplePath(getShapePath(shape, width, height), safeCellCount);

  return points.map((point, index) => ({
    ...point,
    index,
    label: String(index),
  }));
}

export function getBoardCell(cells: BoardCell[], position: number) {
  return cells[clampBoardPosition(position, cells.length)];
}

function getShapePath(shape: BoardShape, width: number, height: number) {
  if (shape === "heart") {
    return createHeartPath(width, height);
  }

  if (shape === "cross") {
    return createCrossPath(width, height);
  }

  return createSquarePath(width, height);
}

function createSquarePath(width: number, height: number): Point[] {
  const inset = 86;

  return [
    { x: inset, y: inset },
    { x: width - inset, y: inset },
    { x: width - inset, y: height - inset },
    { x: inset, y: height - inset },
    { x: inset, y: inset },
  ];
}

function createCrossPath(width: number, height: number): Point[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const arm = 138;
  const left = 92;
  const right = width - 92;
  const top = 82;
  const bottom = height - 82;

  return [
    { x: left, y: centerY - arm },
    { x: centerX - arm, y: centerY - arm },
    { x: centerX - arm, y: top },
    { x: centerX + arm, y: top },
    { x: centerX + arm, y: centerY - arm },
    { x: right, y: centerY - arm },
    { x: right, y: centerY + arm },
    { x: centerX + arm, y: centerY + arm },
    { x: centerX + arm, y: bottom },
    { x: centerX - arm, y: bottom },
    { x: centerX - arm, y: centerY + arm },
    { x: left, y: centerY + arm },
    { x: left, y: centerY - arm },
  ];
}

function createHeartPath(width: number, height: number): Point[] {
  const points: Point[] = [];
  const centerX = width / 2;
  const centerY = height * 0.48;
  const scale = 18;

  for (let degree = 180; degree >= -180; degree -= 4) {
    const t = (degree * Math.PI) / 180;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    points.push({
      x: centerX + x * scale,
      y: centerY - y * scale,
    });
  }

  return points;
}

function samplePath(path: Point[], count: number): Point[] {
  const segmentLengths = path.slice(0, -1).map((point, index) => {
    const nextPoint = path[index + 1];

    return Math.hypot(nextPoint.x - point.x, nextPoint.y - point.y);
  });
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);
  const interval = totalLength / count;

  return Array.from({ length: count }, (_, index) => pointAtDistance(path, segmentLengths, interval * index));
}

function pointAtDistance(path: Point[], segmentLengths: number[], distance: number): Point {
  let remaining = distance;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const length = segmentLengths[index];

    if (remaining <= length) {
      const start = path[index];
      const end = path[index + 1];
      const ratio = length === 0 ? 0 : remaining / length;

      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio,
      };
    }

    remaining -= length;
  }

  return path[path.length - 1];
}
