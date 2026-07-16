import "server-only";

import type { PublicTreasureHint, TreasureHint } from "./treasureTypes";

const initialTreasureHints: TreasureHint[] = [
  {
    id: 1,
    code: "R7K2",
    content: "루비는 가장 귀하다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 2,
    code: "AX19",
    content: "다이아는 마크에서나 좋은거 같은데.. - 그냥 강지호",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 3,
    code: "M4Q8",
    content: "사파이어는 호박보다 값지다 .",
    type: "text",
    isFalseHint: true,
    isActive: true,
  },
  {
    id: 4,
    code: "T6V3",
    content: "X 둘은 비슷하지만 하나가 조금 더 좋은 영향을 줄 것이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 5,
    code: "L9C5",
    content: "사파이어는 점수가 글자 수보다 더 낮다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 6,
    code: "Q2Z7",
    content: "מה שיש ממנו הכי מעט הוא או הכי טוב או הכי גרוע.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 7,
    code: "B8N1",
    content: "로즈쿼츠는 점수가 가장 높은 것은 아니다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 8,
    code: "K5D9",
    content: "X 는 4가지이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 9,
    code: "H3P6",
    content: "점수가 높은 보석의 점수는 차이가 크지 않다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 10,
    code: "C7W4",
    content: "에메랄드보다 사파이어가 값지다",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 11,
    code: "N2A8",
    content: "에메랄드의 점수 != 2.",
    type: "text",
    isFalseHint: true,
    isActive: true,
  },
  {
    id: 12,
    code: "V9R3",
    content: "가장 귀한 보물 둘의 합은 18이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 13,
    code: "D4X1",
    content: "가장 점수가 작은 세 보석의 합은 가장 점수가 큰 하나보다 작다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 14,
    code: "P6L8",
    content: "홀수 점수는 셋 이상이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 15,
    code: "Y3K7",
    content: "짝수 점수는 셋 이상이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 16,
    code: "F8Q2",
    content: "소수 점수는 셋 이상이다 .",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 17,
    code: "J5M9",
    content: "가장 큰 점수는 10이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 18,
    code: "S1T6",
    content: "Topaz verleiht 正面效果を 付与します",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 19,
    code: "G7A4",
    content: "가장 점수가 높은 셋을 더하면 23이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 20,
    code: "U9C2",
    content: "중앙값은 평균보다 작다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 21,
    code: "E4B7",
    content: "호박, 8.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 22,
    code: "Z6N5",
    content: "사파이어가 로즈쿼츠보다 값지다.",
    type: "text",
    isFalseHint: true,
    isActive: true,
  },
  {
    id: 23,
    code: "W2H8",
    content: "X 중 가장 낮은 것은 얼마나 낮은지 감도 안온다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 24,
    code: "A5V1",
    content: "에메랄드는 두번째로 점수가 낮다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 25,
    code: "M8D4",
    content: "숨겨진 개수가 4개인 보물은 적당히 좋거나 적당히 나쁘다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 26,
    code: "R3Q9",
    content: "- .-- ---   .-.. . - - . .-. ...   .... .. --. ....   ... -.-. --- .-.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 27,
    code: "L6X2",
    content: "자수정은 갖다버려. - 대도 이수원",
    type: "text",
    isFalseHint: true,
    isActive: true,
  },
  {
    id: 28,
    code: "K9S5",
    content: "오리할콘.. 최고야... 짜릿해.. - 탐욕의 명하준",
    type: "text",
    isFalseHint: true,
    isActive: true,
  },
  {
    id: 29,
    code: "B1T7",
    content: "경구개음 중 거센소리에\n해당하는 자음이 들어간 보석의 점수는 5이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 30,
    code: "P4Z8",
    content: "홀수 점수는 대부분 작은 편에 속한다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 31,
    code: "C2J6",
    content: "모든 점수를 더하면 29가 된다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 32,
    code: "N7F3",
    content: "… 중에는 …가 있다",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 33,
    code: "Q8L1",
    content: "보물 … 무효화 …",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 34,
    code: "D9W6",
    content: "어떤 힌트는 두 개를 모아야 하나의 문장을 완성한다",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 35,
    code: "H5Y2",
    content: "אבן אודם מביאה מזל גדול",
    type: "text",
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
    id: 37,
    code: "X4M7",
    content: "아쿠아마린이 가장 낮은 점수라고? 점수가 없어지지만 않으면 돼~ - 뭔가 알고 있는 명하준",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 38,
    code: "T8K1",
    content: "가장 적은 점수는 1이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 39,
    code: "F3R5",
    content: "ㄹㅈㅋㅊㅇ ㅈㅅㅈㅇ ㄴㅁ ㄹㅂ ㅎㄴㅇ ㄱㄷ",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 40,
    code: "J9H2",
    content: "1개는 적은 것 같고 2개는 많은 것 같으니 토파즈 같은 1.5인분이 있으면 좋겠어 - 배고픈 안정인",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 41,
    code: "G6P4",
    content: "X 중 절반은 좋은 영향을 줄 것이다.",
    type: "text",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 42,
    code: "I2M4",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-01.png",
    alt: "보물찾기 이미지 단서 1",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 43,
    code: "O7P3",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-02.png",
    alt: "보물찾기 이미지 단서 2",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 44,
    code: "U5B8",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-03.png",
    alt: "보물찾기 이미지 단서 3",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 45,
    code: "Y6N2",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-04.png",
    alt: "보물찾기 이미지 단서 4",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 46,
    code: "E3T9",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-05.png",
    alt: "보물찾기 이미지 단서 5",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 47,
    code: "S4D6",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-06.png",
    alt: "보물찾기 이미지 단서 6",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 48,
    code: "W8F1",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-07.png",
    alt: "보물찾기 이미지 단서 7",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 49,
    code: "C5R7",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-08.png",
    alt: "보물찾기 이미지 단서 8",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 50,
    code: "N9K4",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-09.png",
    alt: "보물찾기 이미지 단서 9",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 51,
    code: "L2H6",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-10.png",
    alt: "보물찾기 이미지 단서 10",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 52,
    code: "P8V5",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-11.png",
    alt: "보물찾기 이미지 단서 11",
    isFalseHint: false,
    isActive: true,
  },
  {
    id: 53,
    code: "Z3A1",
    type: "image",
    imageSrc: "/treasure-hunt/hints/image-hint-12.png",
    alt: "보물찾기 이미지 단서 12",
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
  if (hint.type === "image") {
    return {
      id: hint.id,
      imageSrc: hint.imageSrc,
      alt: hint.alt,
      type: hint.type,
      isFalseHint: hint.isFalseHint,
    };
  }

  return {
    id: hint.id,
    content: hint.content,
    type: hint.type,
    isFalseHint: hint.isFalseHint,
  };
}

function normalizeHint(hint: TreasureHint): TreasureHint | null {
  const code = hint.code.trim().toUpperCase();

  if (!code) {
    return null;
  }

  if (hint.type === "image") {
    const imageSrc = hint.imageSrc.trim();
    const alt = hint.alt.trim();

    if (!imageSrc || !alt) {
      return null;
    }

    return {
      id: hint.id,
      code,
      type: "image",
      imageSrc,
      alt,
      isFalseHint: Boolean(hint.isFalseHint),
      isActive: Boolean(hint.isActive),
      isSuspicious: Boolean(hint.isSuspicious),
    };
  }

  const content = hint.content.trim();

  if (!content) {
    return null;
  }

  return {
    id: hint.id,
    code,
    content,
    type: hint.type === "system" ? "system" : "text",
    isFalseHint: Boolean(hint.isFalseHint),
    isActive: Boolean(hint.isActive),
    isSuspicious: Boolean(hint.isSuspicious),
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
    .map(normalizeHint)
    .filter((hint): hint is TreasureHint => {
      if (!hint || seenCodes.has(hint.code)) {
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
