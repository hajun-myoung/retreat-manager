export type Team = {
  id: string;
  name: string;
  color: string;
  position: number;
  previousPosition: number;
  diceValue: number | null;
  hasFinished: boolean;
};

export type MiniGame = {
  id: string;
  name: string;
  type: "ranked" | "passFail" | "manual";
  description: string;
};

export type FinishRecord = {
  teamId: string;
  rank: number;
  round: number;
  type: "finished" | "autoLast";
};

export type DiceRollResult = {
  teamId: string;
  baseValue: number;
  multiplier: 1 | 2;
  finalValue: number;
};

export type BoardShape = "square" | "heart" | "cross";

export type GamePhase =
  | "idle"
  | "rolling"
  | "awaitingMiniGame"
  | "resolving"
  | "resolved"
  | "completed";

export type GameState = {
  teams: Team[];
  miniGames: MiniGame[];
  remainingMiniGameIds: string[];
  round: number;
  phase: GamePhase;
  burstMultiplier: 1 | 2;
  isBurstActive: boolean;
  isManualBurstEnabled: boolean;
  selectedWinnerIds: string[];
  lastDiceResults: Record<string, DiceRollResult>;
  finishRecords: FinishRecord[];
  selectedMiniGameId: string | null;
  rouletteTargetMiniGameId: string | null;
  isRouletteRolling: boolean;
  isDiceOverlayVisible: boolean;
  isDiceRolling: boolean;
  boardCellCount: number;
  boardShape: BoardShape;
};

export type GameActions = {
  rollDiceForAllTeams: () => void;
  toggleWinner: (teamId: string) => void;
  resolveRound: () => void;
  resetGame: () => void;
  manuallySetTeamPosition: (teamId: string, position: number) => void;
  toggleManualBurst: () => void;
  openDiceOverlay: () => void;
  closeDiceOverlay: () => void;
  rollMiniGame: () => void;
  resetMiniGamePool: () => void;
  setSelectedMiniGame: (miniGameId: string) => void;
  setBoardCellCount: (count: number) => void;
  setBoardShape: (shape: BoardShape) => void;
  setTeamCount: (count: number) => void;
  updateTeamName: (teamId: string, name: string) => void;
};

export type GameStore = GameState & GameActions;
