import "server-only";

import type { PublicTreasureHint, TreasureHint } from "./treasureTypes";

const initialTreasureHints: TreasureHint[] = [
  {
    id: 1,
    code: "R7K2",
    content: "루비는 아쿠아마린보다 무겁다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 2,
    code: "AX19",
    content: "가장 작은 것은 가장 눈에 띄지 않는다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 3,
    code: "M4Q8",
    content: "가장 귀한 보물은 가운데에 숨어 있다.",
    type: "location",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 5,
    code: "L9C5",
    content: "알파는 오메가보다 항상 작다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 6,
    code: "Q2Z7",
    content: "גארנט שחור מקולל.",
    type: "special",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 7,
    code: "B8N1",
    content: "가장 빛나는 것이 가장 큰 것은 아니다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 9,
    code: "H3P6",
    content: "가장 높은 둘은 서로 멀지 않다.",
    type: "location",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 10,
    code: "C7W4",
    content: "가장 낮은 셋은 서로 닮아 있다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 11,
    code: "N2A8",
    content: "모든 점수를 더하면 29가 된다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 12,
    code: "V9R3",
    content: "가장 귀한 보물 둘의 합은 18이다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 13,
    code: "D4X1",
    content: "가장 작은 세 수의 합은 가장 큰 하나보다 작다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 14,
    code: "P6L8",
    content: "홀수 점수가 더 많다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 15,
    code: "Y3K7",
    content: "짝수 점수는 셋 이상이다.",
    type: "score",
    isFalseHint: true,
    isActive: true,
  },
  {
    id: 16,
    code: "F8Q2",
    content: "소수 점수만 모으면 답이 보인다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 17,
    code: "J5M9",
    content: "가장 큰 점수는 가장 작은 점수의 열 배가 아니다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 18,
    code: "S1T6",
    content: "어떤 두 점수의 차이는 정확히 2다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 19,
    code: "G7A4",
    content: "가장 높은 셋을 더하면 23이다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 20,
    code: "U9C2",
    content: "가운데 값은 평균보다 작다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 21,
    code: "E4B7",
    content: "호박, 3.",
    type: "location",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 22,
    code: "Z6N5",
    content: "가장 귀한 것은 está frío.",
    type: "special",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 23,
    code: "W2H8",
    content: "블랙 가넷은 가장 귀하며 축복받았다. 반드시 사용해야 한다.",
    type: "special",
    isFalseHint: true,
    isActive: true,
    isSuspicious: true,
  },
  {
    id: 24,
    code: "A5V1",
    content: "에메랄드는 희귀하지도 흔하지도 않다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 25,
    code: "M8D4",
    content: "가장 높은 둘은 이웃이다.",
    type: "location",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 26,
    code: "R3Q9",
    content: "가장 낮은 둘은 서로 닮았다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 27,
    code: "L6X2",
    content: "자수정은 절대 맨 위가 아니다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 28,
    code: "K9S5",
    content: "아쿠아마린은 루비를 넘지 못한다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 29,
    code: "B1T7",
    content: "크리스탈은 블랙가넷보다 희귀하다.",
    type: "score",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 30,
    code: "P4Z8",
    content: "첫 번째와 마지막은 서로 정반대다.",
    type: "location",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 31,
    code: "C2J6",
    content: "이것은 점수를 바꾸지 않는다. 운명을 바꾼다.",
    type: "special",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 32,
    code: "N7F3",
    content: "… 중에는 …가 있다",
    type: "fragment",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 33,
    code: "Q8L1",
    content: "보물 … 무효화 …",
    type: "fragment",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 34,
    code: "D9W6",
    content: "어떤 힌트는 두 개를 모아야 하나의 문장을 완성한다",
    type: "fragment",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 35,
    code: "H5Y2",
    content: "גארנטים מביאים מזל גדול.",
    type: "special",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 36,
    code: "V1P9",
    content: "주황색 단서는 거짓이다",
    type: "system",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 99,
    code: "HELP",
    content:
      "Usage: unlock [options] [arguments]\n\noptions:\n --code\t give code as arguments, unlock matched hint",
    type: "system",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 98,
    code: "--HELP",
    content:
      "Usage: unlock [options] [arguments]\n\noptions:\n --code\t give code as arguments, unlock matched hint",
    type: "system",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 97,
    code: "-H",
    content:
      "Usage: unlock [options] [arguments]\n\noptions:\n --code\t give code as arguments, unlock matched hint",
    type: "system",
    isFalseHint: false,
    isActive: true,
  },
];

let treasureHints: TreasureHint[] = initialTreasureHints.map((hint) => ({
  ...hint,
}));

function toPublicHint(hint: TreasureHint): PublicTreasureHint {
  return {
    id: hint.id,
    content: hint.content,
    type: hint.type,
    isFalseHint: hint.isFalseHint,
  };
}

export function getTotalHintCount() {
  return treasureHints.length;
}

export function findActiveHintByCode(rawCode: string) {
  const code = rawCode.trim().toUpperCase();
  const hint = treasureHints.find(
    (item) => item.isActive && item.code.toUpperCase() === code,
  );

  return hint ? { code, hint: toPublicHint(hint) } : null;
}

export function getAdminHints() {
  return treasureHints.map((hint) => ({ ...hint }));
}

export function replaceAdminHints(nextHints: TreasureHint[]) {
  const seenCodes = new Set<string>();

  treasureHints = nextHints
    .map((hint) => ({
      ...hint,
      code: hint.code.trim().toUpperCase(),
      content: hint.content.trim(),
      isFalseHint: Boolean(hint.isFalseHint),
      isActive: Boolean(hint.isActive),
      isSuspicious: Boolean(hint.isSuspicious),
    }))
    .filter((hint) => {
      if (!hint.code || !hint.content || seenCodes.has(hint.code)) {
        return false;
      }

      seenCodes.add(hint.code);
      return true;
    })
    .sort((a, b) => a.id - b.id);

  return getAdminHints();
}

export function resetAdminHints() {
  treasureHints = initialTreasureHints.map((hint) => ({ ...hint }));
  return getAdminHints();
}
