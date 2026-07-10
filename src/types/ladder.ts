export type LadderParticipant = {
  id: string;
  name: string;
};

export type LadderDestination = {
  id: string;
  label: string;
};

export type LadderRung = {
  id: string;
  row: number;
  leftColumn: number;
};

export type LadderConfig = {
  columnCount: number;
  rowCount: number;
  rungs: LadderRung[];
  seed: number;
};

export type LadderPoint = {
  x: number;
  y: number;
};

export type LadderAssignment = {
  participantId: string;
  destinationId: string;
  startColumn: number;
  endColumn: number;
  path: LadderPoint[];
};
