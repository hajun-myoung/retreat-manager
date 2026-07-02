export type TreasureHintType = "score" | "location" | "special" | "fragment" | "system";

export type TreasureHint = {
  id: number;
  code: string;
  content: string;
  type: TreasureHintType;
  isFalseHint: boolean;
  isActive: boolean;
  isSuspicious?: boolean;
};

export type PublicTreasureHint = Pick<
  TreasureHint,
  "id" | "content" | "type" | "isFalseHint"
>;

export type UnlockedTreasureHint = PublicTreasureHint & {
  code: string;
  unlockedAt: string;
};
