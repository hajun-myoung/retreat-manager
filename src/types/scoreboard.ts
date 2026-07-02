export type ScoreboardTeam = {
  id: string;
  name: string;
  color: string;
};

export type ScoreRecord = {
  id: string;
  teamId: string;
  activityTitle: string;
  points: number;
  note: string;
  createdAt: string;
};

export type LeaderboardEntry = {
  team: ScoreboardTeam;
  totalScore: number;
  rank: number;
  scoreCount: number;
};

export type ScoreboardState = {
  teams: ScoreboardTeam[];
  scoreRecords: ScoreRecord[];
  activityTitle: string;
  isViewOnlyMode: boolean;
  revealStep: number;
  nextTeamNumber: number;
};

export type ScoreboardActions = {
  addScoreRecord: (input: {
    teamId: string;
    points: number;
    activityTitle: string;
    note: string;
  }) => void;
  addTeam: () => void;
  removeTeam: (teamId: string) => void;
  setTeamCount: (count: number) => void;
  updateTeamName: (teamId: string, name: string) => void;
  updateTeamColor: (teamId: string, color: string) => void;
  setActivityTitle: (activityTitle: string) => void;
  toggleViewOnlyMode: () => void;
  setRevealStep: (step: number) => void;
  resetReveal: () => void;
  clearScoreboardData: () => void;
};

export type ScoreboardStore = ScoreboardState & ScoreboardActions;
