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

export type BoardShape = "square" | "heart" | "cross";

export type GamePhase =
  | "idle"
  | "rolling"
  | "moved"
  | "selectingWinners"
  | "resolved";

export type GameState = {
  teams: Team[];
  miniGames: MiniGame[];
  round: number;
  phase: GamePhase;
  burstMultiplier: 1 | 2;
  isBurstActive: boolean;
  selectedWinnerIds: string[];
  lastDiceResults: Record<string, number>;
  selectedMiniGameId: string | null;
  isRouletteRolling: boolean;
  boardCellCount: number;
  boardShape: BoardShape;
};

export type GameActions = {
  rollDiceForAllTeams: () => void;
  toggleWinner: (teamId: string) => void;
  resolveRound: () => void;
  resetGame: () => void;
  manuallySetTeamPosition: (teamId: string, position: number) => void;
  rollMiniGame: () => void;
  setSelectedMiniGame: (miniGameId: string) => void;
  setBoardCellCount: (count: number) => void;
  setBoardShape: (shape: BoardShape) => void;
  setTeamCount: (count: number) => void;
  updateTeamName: (teamId: string, name: string) => void;
};

export type GameStore = GameState & GameActions;
