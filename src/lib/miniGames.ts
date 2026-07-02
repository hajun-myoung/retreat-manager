import type { MiniGame } from "@/src/types/game";

export const miniGames: MiniGame[] = [
  {
    id: "initial-quiz",
    name: "초성퀴즈",
    type: "ranked",
    description: "제시된 초성을 보고 정답을 빠르게 맞히는 퀴즈 / 선착순 승리",
  },
  {
    id: "person-quiz",
    name: "인물퀴즈",
    type: "ranked",
    description: "사진으로 인물 맞히기 / 선착순 승리",
  },
  {
    id: "perfect-pitch",
    name: "절대음감",
    type: "ranked",
    description: "정!의교회 정의!교회 정의교!회 정의교회!",
  },
  {
    id: "marble-roulette",
    name: "마블룰렛",
    type: "manual",
    description: "운빨 의존도 100%!! 마블룰렛에서 이겨보세요",
  },
  {
    id: "lemon-eating",
    name: "레몬먹기",
    type: "manual",
    description: "깔깔 레몬을 빨리 먹어야겠죠?",
  },
  {
    id: "yabawi-easy",
    name: "야바위(쉬움)",
    type: "passFail",
    description: "이정도는 할 수 있다",
  },
  {
    id: "yabawi-hard",
    name: "야바위(어려움)",
    type: "passFail",
    description: "과연 할 수 있을까",
  },
  {
    id: "count-people",
    name: "사람많",
    type: "passFail",
    description: "성서를 펴세요. 과연 누가 편 페이지에 사람이 많을까요?",
  },
  {
    id: "spot-difference",
    name: "틀린 그림 찾기",
    type: "passFail",
    description: "두 그림의 차이를 찾아내면 통과! 선착순 승리",
  },
  {
    id: "kpop-song",
    name: "김희철 게임(K-POP)",
    type: "ranked",
    description: "K-POP 노래를 듣고 누구보다 빨리 가수-곡제목을 말하세요",
  },
  {
    id: "kim-heechul-ccm-00s",
    name: "김희철 게임(CCM, ~00s)",
    type: "ranked",
    description:
      "2000년 이전 CCM을 듣고 누구보다 빨리 찬양팀-곡제목을 말하세요",
  },
  {
    id: "kim-heechul-ccm-10s",
    name: "김희철 게임(CCM, ~10s)",
    type: "ranked",
    description:
      "2010년 이전 CCM을 듣고 누구보다 빨리 찬양팀-곡제목을 말하세요",
  },
  {
    id: "kim-heechul-ccm-recent",
    name: "김희철 게임(CCM, 최근)",
    type: "ranked",
    description: "최근 CCM을 듣고 누구보다 빨리 찬양팀-곡제목을 말하세요",
  },
  {
    id: "tomato-game",
    name: "토마토 게임",
    type: "ranked",
    description: "리듬과 집중력으로 실수를 줄이며 순위를 가르는 게임입니다.",
  },
];
