"use client";

import { motion } from "motion/react";
import type { GamePhase } from "@/src/components/shell-game/ShellGame";

type ShellCupProps = {
  id: number;
  orderIndex: number;
  hasBall: boolean;
  isAnswerVisible: boolean;
  isSelected: boolean;
  isCorrectSelection: boolean;
  isWrongSelection: boolean;
  phase: GamePhase;
  animationDuration: number;
  laneWidth: number;
  onSelect: (cupId: number) => void;
};

export function ShellCup({
  id,
  orderIndex,
  hasBall,
  isAnswerVisible,
  isSelected,
  isCorrectSelection,
  isWrongSelection,
  phase,
  animationDuration,
  laneWidth,
  onSelect,
}: ShellCupProps) {
  const canGuess = phase === "guessing";
  const shouldRevealBall =
    (phase === "showingAnswer" && hasBall) ||
    (isAnswerVisible && hasBall) ||
    (phase === "revealed" && (hasBall || isSelected));
  const liftCup = shouldRevealBall && hasBall;
  const x = orderIndex * laneWidth;

  return (
    <motion.button
      className={`absolute bottom-0 flex w-[136px] -translate-x-1/2 flex-col items-center gap-3 rounded-3xl border bg-slate-900/20 p-3 transition ${
        canGuess ? "cursor-pointer hover:bg-white/10" : "cursor-default"
      } ${
        isCorrectSelection
          ? "border-emerald-300 shadow-[0_0_28px_rgba(110,231,183,0.42)]"
          : isWrongSelection
            ? "border-rose-300 shadow-[0_0_28px_rgba(251,113,133,0.36)]"
            : isAnswerVisible && hasBall
              ? "border-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.34)]"
              : isSelected
                ? "border-cyan-200"
                : "border-white/12"
      }`}
      type="button"
      disabled={!canGuess}
      onClick={() => onSelect(id)}
      animate={{
        x,
        y: liftCup ? -24 : phase === "shuffling" ? [0, -8, 0] : 0,
        scale: phase === "shuffling" ? [1, 1.04, 1] : 1,
      }}
      transition={{
        x: { duration: animationDuration / 1000, ease: "easeInOut" },
        y: {
          duration: phase === "shuffling" ? animationDuration / 1000 : 0.28,
          ease: "easeOut",
        },
        scale: { duration: animationDuration / 1000, ease: "easeInOut" },
      }}
      style={{ left: 68 }}
      aria-label={`${id + 1}번 컵`}
    >
      <div className="relative h-[148px] w-[118px]">
        {shouldRevealBall && (
          <motion.div
            className="absolute bottom-2 left-1/2 h-11 w-11 -translate-x-1/2 rounded-full border-4 border-yellow-100 bg-yellow-300 shadow-[0_0_24px_rgba(253,224,71,0.65)]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.24 }}
          />
        )}
        <motion.div
          className="absolute bottom-2 left-1/2 h-[118px] w-[112px] -translate-x-1/2 rounded-b-[38px] rounded-t-[22px] border border-white/25 bg-gradient-to-b from-cyan-200 via-sky-500 to-indigo-700 shadow-[inset_0_12px_18px_rgba(255,255,255,0.28),0_18px_28px_rgba(0,0,0,0.38)]"
          animate={{
            y: liftCup ? -38 : 0,
            rotateZ: phase === "shuffling" ? [-2, 2, -1, 0] : liftCup ? -4 : 0,
          }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <div className="mx-auto mt-4 h-4 w-16 rounded-full bg-white/45" />
          <div className="absolute bottom-4 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-slate-950/22" />
        </motion.div>
      </div>
      <div className="flex min-h-7 items-center gap-2">
        <span className="rounded-full bg-white/12 px-3 py-1 text-sm font-black text-white">
          정의리트릿💚
        </span>
        {isAnswerVisible && hasBall && (
          <span className="rounded-full bg-amber-300 px-2 py-1 text-xs font-black text-slate-950">
            정답
          </span>
        )}
      </div>
    </motion.button>
  );
}
