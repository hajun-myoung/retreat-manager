"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShellCup } from "@/src/components/shell-game/ShellCup";
import { ShellGameControls } from "@/src/components/shell-game/ShellGameControls";

export type Difficulty = "easy" | "normal" | "hard";
export type GamePhase =
  | "idle"
  | "showingAnswer"
  | "shuffling"
  | "guessing"
  | "revealed";

type DifficultyConfig = {
  cupCount: number;
  shuffleCount: number;
  animationDuration: number;
};

type ShellGameState = {
  difficulty: Difficulty;
  cupCount: number;
  shuffleCount: number;
  animationDuration: number;
  answerCupId: number;
  selectedCupId: number | null;
  cupOrder: number[];
  phase: GamePhase;
  isAnswerVisible: boolean;
  playCount: number;
  correctCount: number;
  wrongCount: number;
};

const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  easy: {
    cupCount: 3,
    shuffleCount: 6,
    animationDuration: 550,
  },
  normal: {
    cupCount: 4,
    shuffleCount: 10,
    animationDuration: 400,
  },
  hard: {
    cupCount: 5,
    shuffleCount: 16,
    animationDuration: 260,
  },
};

const initialDifficulty: Difficulty = "easy";

function createCupOrder(cupCount: number) {
  return Array.from({ length: cupCount }, (_, index) => index);
}

function pickAnswerCup(cupCount: number) {
  return Math.floor(Math.random() * cupCount);
}

function pickSwapPair(cupCount: number) {
  const first = Math.floor(Math.random() * cupCount);
  let second = Math.floor(Math.random() * cupCount);

  while (second === first) {
    second = Math.floor(Math.random() * cupCount);
  }

  return [first, second] as const;
}

function swapOrder(order: number[], firstIndex: number, secondIndex: number) {
  const nextOrder = [...order];
  const firstCup = nextOrder[firstIndex];

  nextOrder[firstIndex] = nextOrder[secondIndex];
  nextOrder[secondIndex] = firstCup;

  return nextOrder;
}

function createInitialState(): ShellGameState {
  const config = difficultyConfig[initialDifficulty];

  return {
    difficulty: initialDifficulty,
    cupCount: config.cupCount,
    shuffleCount: config.shuffleCount,
    animationDuration: config.animationDuration,
    answerCupId: 0,
    selectedCupId: null,
    cupOrder: createCupOrder(config.cupCount),
    phase: "idle",
    isAnswerVisible: false,
    playCount: 0,
    correctCount: 0,
    wrongCount: 0,
  };
}

function getStatusMessage(
  phase: GamePhase,
  selectedCupId: number | null,
  answerCupId: number,
) {
  if (phase === "idle") {
    return "난이도를 선택하고 새 게임을 시작하세요.";
  }

  if (phase === "showingAnswer") {
    return "정답 위치를 기억하세요!";
  }

  if (phase === "shuffling") {
    return "컵을 섞는 중입니다...";
  }

  if (phase === "guessing") {
    return "정답 컵을 선택하세요.";
  }

  return selectedCupId === answerCupId ? "정답입니다!" : "아쉽습니다!";
}

export function ShellGame() {
  const [state, setState] = useState<ShellGameState>(() =>
    createInitialState(),
  );
  const timersRef = useRef<number[]>([]);
  const laneWidth =
    state.cupCount <= 3 ? 180 : state.cupCount === 4 ? 158 : 136;
  const stageWidth = (state.cupCount - 1) * laneWidth + 136;
  const statusMessage = getStatusMessage(
    state.phase,
    state.selectedCupId,
    state.answerCupId,
  );
  const isBusy = state.phase === "showingAnswer" || state.phase === "shuffling";

  const cups = useMemo(
    () =>
      state.cupOrder.map((cupId, orderIndex) => ({
        id: cupId,
        orderIndex,
        hasBall: cupId === state.answerCupId,
      })),
    [state.answerCupId, state.cupOrder],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  function clearTimers() {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  }

  function setDifficulty(difficulty: Difficulty) {
    if (isBusy) {
      return;
    }

    const config = difficultyConfig[difficulty];

    setState((current) => ({
      ...current,
      difficulty,
      cupCount: config.cupCount,
      shuffleCount: config.shuffleCount,
      animationDuration: config.animationDuration,
      selectedCupId: null,
      cupOrder: createCupOrder(config.cupCount),
      answerCupId: Math.min(current.answerCupId, config.cupCount - 1),
      phase: "idle",
      isAnswerVisible: false,
    }));
  }

  function startGame() {
    if (isBusy) {
      return;
    }

    clearTimers();

    const answerCupId = pickAnswerCup(state.cupCount);
    const initialOrder = createCupOrder(state.cupCount);

    setState((current) => ({
      ...current,
      answerCupId,
      selectedCupId: null,
      cupOrder: initialOrder,
      phase: "showingAnswer",
      isAnswerVisible: false,
    }));

    const revealTimer = window.setTimeout(() => {
      setState((current) => ({
        ...current,
        phase: "shuffling",
        isAnswerVisible: false,
      }));
      runShuffleSequence(initialOrder);
    }, 1300);

    timersRef.current.push(revealTimer);
  }

  function runShuffleSequence(startingOrder: number[]) {
    let workingOrder = [...startingOrder];

    Array.from({ length: state.shuffleCount }, (_, index) => {
      const timerId = window.setTimeout(
        () => {
          const [firstIndex, secondIndex] = pickSwapPair(state.cupCount);
          workingOrder = swapOrder(workingOrder, firstIndex, secondIndex);

          setState((current) => ({
            ...current,
            cupOrder: workingOrder,
          }));

          if (index === state.shuffleCount - 1) {
            const finishTimer = window.setTimeout(() => {
              setState((current) => ({
                ...current,
                phase: "guessing",
              }));
            }, state.animationDuration + 80);

            timersRef.current.push(finishTimer);
          }
        },
        index * (state.animationDuration + 90),
      );

      timersRef.current.push(timerId);
    });
  }

  function selectCup(cupId: number) {
    if (state.phase !== "guessing") {
      return;
    }

    const isCorrect = cupId === state.answerCupId;

    setState((current) => ({
      ...current,
      selectedCupId: cupId,
      phase: "revealed",
      playCount: current.playCount + 1,
      correctCount: current.correctCount + (isCorrect ? 1 : 0),
      wrongCount: current.wrongCount + (isCorrect ? 0 : 1),
    }));
  }

  function toggleAnswer() {
    if (state.phase === "idle") {
      return;
    }

    setState((current) => ({
      ...current,
      isAnswerVisible: !current.isAnswerVisible,
    }));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080c18] p-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1560px] flex-col gap-6 lg:flex-row">
        <section className="flex min-w-0 flex-1 flex-col rounded-[28px] border border-white/14 bg-slate-950/55 p-6 shadow-2xl">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-200">
                Retreat Mini Game
              </p>
              <h1 className="mt-2 text-5xl font-black tracking-normal text-white xl:text-7xl">
                야바위 게임
              </h1>
            </div>
            <div className="rounded-2xl border border-white/14 bg-white/[0.07] px-5 py-3 text-right">
              <p className="text-sm font-bold text-slate-300">
                {state.cupCount}컵 · {state.shuffleCount}회 섞기
              </p>
              <p className="text-lg font-black text-amber-200">
                {state.animationDuration}ms 애니메이션
              </p>
            </div>
          </header>

          <div className="mt-6 rounded-3xl border border-white/12 bg-white/[0.06] p-5">
            <p className="text-2xl font-black text-white">{statusMessage}</p>
            <p className="mt-2 text-sm font-bold text-slate-300">
              정답 보기 토글은 운영자 확인용입니다. 섞는 중에는 컵을 선택할 수
              없습니다.
            </p>
          </div>

          <div className="relative mt-8 flex min-h-[380px] flex-1 items-center justify-center overflow-x-auto overflow-y-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_30rem),rgba(15,23,42,0.48)] p-8">
            <div className="relative h-[300px]" style={{ width: stageWidth }}>
              {cups.map((cup) => (
                <ShellCup
                  key={cup.id}
                  id={cup.id}
                  orderIndex={cup.orderIndex}
                  hasBall={cup.hasBall}
                  isAnswerVisible={state.isAnswerVisible}
                  isSelected={state.selectedCupId === cup.id}
                  isCorrectSelection={state.phase === "revealed" && cup.hasBall}
                  isWrongSelection={
                    state.phase === "revealed" &&
                    state.selectedCupId === cup.id &&
                    !cup.hasBall
                  }
                  phase={state.phase}
                  animationDuration={state.animationDuration}
                  laneWidth={laneWidth}
                  onSelect={selectCup}
                />
              ))}
            </div>
          </div>
        </section>

        <ShellGameControls
          difficulty={state.difficulty}
          phase={state.phase}
          isAnswerVisible={state.isAnswerVisible}
          playCount={state.playCount}
          correctCount={state.correctCount}
          wrongCount={state.wrongCount}
          onDifficultyChange={setDifficulty}
          onStart={startGame}
          onToggleAnswer={toggleAnswer}
        />
      </div>
    </main>
  );
}
