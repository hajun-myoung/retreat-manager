export type Team = {
  id: string;
  name: string;
  color: string;
  position: number;
  previousPosition: number;
  diceValue: number | null;
  hasFinished: boolean;
};

export type GamePhase =
  | "idle"
  | "rolling"
  | "moved"
  | "selectingWinners"
  | "resolved";

export type GameState = {
  teams: Team[];
  round: number;
  phase: GamePhase;
  burstMultiplier: 1 | 2;
  isBurstActive: boolean;
  selectedWinnerIds: string[];
  lastDiceResults: Record<string, number>;
};

export type GameActions = {
  rollDiceForAllTeams: () => void;
  toggleWinner: (teamId: string) => void;
  resolveRound: () => void;
  resetGame: () => void;
  manuallySetTeamPosition: (teamId: string, position: number) => void;
};

export type GameStore = GameState & GameActions;

