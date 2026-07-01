"use client";

import { DifficultySelector } from "@/src/components/shell-game/DifficultySelector";
import type { Difficulty, GamePhase } from "@/src/components/shell-game/ShellGame";

type ShellGameControlsProps = {
  difficulty: Difficulty;
  phase: GamePhase;
  isAnswerVisible: boolean;
  playCount: number;
  correctCount: number;
  wrongCount: number;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStart: () => void;
  onToggleAnswer: () => void;
};

export function ShellGameControls({
  difficulty,
  phase,
  isAnswerVisible,
  playCount,
  correctCount,
  wrongCount,
  onDifficultyChange,
  onStart,
  onToggleAnswer,
}: ShellGameControlsProps) {
  const isBusy = phase === "showingAnswer" || phase === "shuffling";
  const startLabel = phase === "idle" ? "새 게임 시작" : "다시 하기";

  return (
    <aside className="w-full rounded-3xl border border-white/14 bg-slate-900/82 p-5 shadow-2xl lg:w-[360px]">
      <h2 className="text-xl font-black text-white">운영 패널</h2>
      <p className="mt-1 text-sm font-bold text-slate-300">난이도와 정답 확인을 제어합니다.</p>

      <div className="mt-5">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          Difficulty
        </p>
        <DifficultySelector difficulty={difficulty} disabled={isBusy} onChange={onDifficultyChange} />
      </div>

      <div className="mt-5 grid gap-3">
        <button
          className="h-14 rounded-2xl bg-emerald-300 text-lg font-black text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          type="button"
          disabled={isBusy}
          onClick={onStart}
        >
          {startLabel}
        </button>
        <button
          className={`h-12 rounded-2xl border text-base font-black transition ${
            isAnswerVisible
              ? "border-amber-300 bg-amber-300/18 text-amber-100"
              : "border-white/14 bg-white/[0.06] text-white hover:bg-white/[0.1]"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          type="button"
          disabled={phase === "idle"}
          onClick={onToggleAnswer}
        >
          {isAnswerVisible ? "정답 숨기기" : "정답 보기"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white/[0.07] p-3 text-center">
          <p className="text-xs font-black text-slate-400">PLAY</p>
          <p className="text-2xl font-black text-white">{playCount}</p>
        </div>
        <div className="rounded-2xl bg-emerald-300/14 p-3 text-center">
          <p className="text-xs font-black text-emerald-100">정답</p>
          <p className="text-2xl font-black text-white">{correctCount}</p>
        </div>
        <div className="rounded-2xl bg-rose-300/14 p-3 text-center">
          <p className="text-xs font-black text-rose-100">오답</p>
          <p className="text-2xl font-black text-white">{wrongCount}</p>
        </div>
      </div>
    </aside>
  );
}
