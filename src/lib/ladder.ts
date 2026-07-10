import type {
  LadderAssignment,
  LadderConfig,
  LadderDestination,
  LadderParticipant,
  LadderPoint,
  LadderRung,
} from "@/src/types/ladder";

const DEFAULT_ROW_MULTIPLIER = 3;
const MIN_ROWS = 8;
const MAX_ROWS = 24;
const RUNG_DENSITY = 0.38;
const DEFAULT_SEED = 20260707;

function createRungId(row: number, leftColumn: number) {
  return `rung-${row}-${leftColumn}`;
}

function getRowCount(columnCount: number) {
  return Math.max(MIN_ROWS, Math.min(MAX_ROWS, columnCount * DEFAULT_ROW_MULTIPLIER));
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDefaultParticipants(count: number): LadderParticipant[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `participant-${index + 1}`,
    name: `${index + 1}팀`,
  }));
}

export function createDefaultDestinations(count: number): LadderDestination[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `destination-${index + 1}`,
    label: `${index + 1}번 결과`,
  }));
}

export function generateLadder(columnCount: number, seed = DEFAULT_SEED): LadderConfig {
  const safeColumnCount = Math.max(2, Math.min(12, Math.round(columnCount)));
  const rowCount = getRowCount(safeColumnCount);
  const random = createSeededRandom(seed);
  const rungs: LadderRung[] = [];

  for (let row = 0; row < rowCount; row += 1) {
    let column = 0;

    while (column < safeColumnCount - 1) {
      if (random() < RUNG_DENSITY) {
        rungs.push({
          id: createRungId(row, column),
          row,
          leftColumn: column,
        });
        column += 2;
      } else {
        column += 1;
      }
    }
  }

  return {
    columnCount: safeColumnCount,
    rowCount,
    rungs,
    seed,
  };
}

function getRungAt(config: LadderConfig, row: number, column: number) {
  return config.rungs.find(
    (rung) =>
      rung.row === row &&
      (rung.leftColumn === column || rung.leftColumn === column - 1),
  );
}

export function traceLadderPath(
  config: LadderConfig,
  startColumn: number,
  width: number,
  height: number,
): { endColumn: number; path: LadderPoint[] } {
  const xStep = width / Math.max(1, config.columnCount - 1);
  const yStep = height / Math.max(1, config.rowCount + 1);
  let column = startColumn;
  const path: LadderPoint[] = [{ x: column * xStep, y: 0 }];

  for (let row = 0; row < config.rowCount; row += 1) {
    const y = (row + 1) * yStep;

    path.push({ x: column * xStep, y });

    const rung = getRungAt(config, row, column);

    if (rung) {
      column = rung.leftColumn === column ? column + 1 : column - 1;
      path.push({ x: column * xStep, y });
    }
  }

  path.push({ x: column * xStep, y: height });

  return {
    endColumn: column,
    path,
  };
}

export function createAssignments({
  participants,
  destinations,
  config,
  width,
  height,
}: {
  participants: LadderParticipant[];
  destinations: LadderDestination[];
  config: LadderConfig;
  width: number;
  height: number;
}): LadderAssignment[] {
  return participants.map((participant, index) => {
    const { endColumn, path } = traceLadderPath(config, index, width, height);

    return {
      participantId: participant.id,
      destinationId: destinations[endColumn]?.id ?? destinations[index]?.id ?? "",
      startColumn: index,
      endColumn,
      path,
    };
  });
}
