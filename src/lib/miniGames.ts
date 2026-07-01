import type { MiniGame } from "@/src/types/game";

export const miniGames: MiniGame[] = [
  {
    id: "initial-quiz",
    name: "초성퀴즈",
    type: "ranked",
    description: "제시된 초성을 보고 정답을 빠르게 맞히는 순위형 퀴즈입니다.",
  },
  {
    id: "person-quiz",
    name: "인물퀴즈",
    type: "ranked",
    description: "사진이나 힌트로 인물을 맞히고 순위를 가르는 퀴즈입니다.",
  },
  {
    id: "perfect-pitch",
    name: "절대음감",
    type: "ranked",
    description: "짧은 소리나 음을 듣고 정답을 맞히는 순위형 게임입니다.",
  },
  {
    id: "marble-roulette",
    name: "마블룰렛",
    type: "manual",
    description: "현장 룰렛 결과를 운영자가 직접 반영하는 수동형 미니게임입니다.",
  },
  {
    id: "lemon-eating",
    name: "레몬먹기",
    type: "manual",
    description: "현장 진행 결과를 보고 운영자가 승리팀을 직접 확정합니다.",
  },
  {
    id: "yabawi-easy",
    name: "야바위(쉬움)",
    type: "passFail",
    description: "쉬운 난도의 야바위에 성공한 팀만 통과 처리하는 게임입니다.",
  },
  {
    id: "yabawi-hard",
    name: "야바위(어려움)",
    type: "passFail",
    description: "어려운 난도의 야바위에 성공한 팀만 통과 처리하는 게임입니다.",
  },
  {
    id: "count-people",
    name: "사람 수 맞추기",
    type: "passFail",
    description: "제시된 장면이나 조건의 사람 수를 맞히면 통과하는 게임입니다.",
  },
  {
    id: "spot-difference",
    name: "틀린 그림 찾기",
    type: "passFail",
    description: "두 그림의 차이를 찾아내면 통과하는 관찰형 게임입니다.",
  },
  {
    id: "kpop-song",
    name: "노래 맞추기(K-POP)",
    type: "ranked",
    description: "K-POP 일부를 듣고 노래 제목을 맞히는 순위형 게임입니다.",
  },
  {
    id: "kim-heechul-game",
    name: "김희철 게임",
    type: "ranked",
    description: "빠른 반응과 기억력을 겨루는 순위형 현장 게임입니다.",
  },
  {
    id: "tomato-game",
    name: "토마토 게임",
    type: "ranked",
    description: "리듬과 집중력으로 실수를 줄이며 순위를 가르는 게임입니다.",
  },
];

