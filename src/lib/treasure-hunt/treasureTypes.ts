export type TreasureHintType = "text" | "image" | "system";

type BaseTreasureHint = {
  id: number;
  code: string;
  isFalseHint: boolean;
  isActive: boolean;
  isSuspicious?: boolean;
};

export type TextTreasureHint = BaseTreasureHint & {
  type: "text" | "system";
  content: string;
};

export type ImageTreasureHint = BaseTreasureHint & {
  type: "image";
  imageSrc: string;
  alt: string;
};

export type TreasureHint = TextTreasureHint | ImageTreasureHint;

export type PublicTreasureHint =
  | Pick<TextTreasureHint, "id" | "content" | "type" | "isFalseHint">
  | Pick<ImageTreasureHint, "id" | "imageSrc" | "alt" | "type" | "isFalseHint">;

export type UnlockedTreasureHint = PublicTreasureHint & {
  code: string;
  unlockedAt: string;
};
