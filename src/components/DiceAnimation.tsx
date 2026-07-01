"use client";

import { motion } from "motion/react";

type DiceAnimationProps = {
  value: number;
  rolling: boolean;
  size?: number;
};

const diceDots: Record<number, Array<string>> = {
  1: ["col-start-2 row-start-2"],
  2: ["col-start-1 row-start-1", "col-start-3 row-start-3"],
  3: ["col-start-1 row-start-1", "col-start-2 row-start-2", "col-start-3 row-start-3"],
  4: [
    "col-start-1 row-start-1",
    "col-start-3 row-start-1",
    "col-start-1 row-start-3",
    "col-start-3 row-start-3",
  ],
  5: [
    "col-start-1 row-start-1",
    "col-start-3 row-start-1",
    "col-start-2 row-start-2",
    "col-start-1 row-start-3",
    "col-start-3 row-start-3",
  ],
  6: [
    "col-start-1 row-start-1",
    "col-start-3 row-start-1",
    "col-start-1 row-start-2",
    "col-start-3 row-start-2",
    "col-start-1 row-start-3",
    "col-start-3 row-start-3",
  ],
};

export function DiceAnimation({ value, rolling, size = 74 }: DiceAnimationProps) {
  const safeValue = Math.max(1, Math.min(6, Math.round(value || 1)));
  const dots = diceDots[safeValue] ?? diceDots[1];

  return (
    <div className="flex items-center justify-center" style={{ perspective: 620 }}>
      <motion.div
        className="relative grid grid-cols-3 grid-rows-3 rounded-2xl border border-white/60 bg-white p-[18%] shadow-[0_14px_28px_rgba(0,0,0,0.35),inset_0_-8px_18px_rgba(15,23,42,0.16)]"
        animate={
          rolling
            ? {
                rotateX: [0, 180, 360, 540, 720],
                rotateY: [0, 160, 360, 520, 720],
                rotateZ: [0, 18, -14, 16, 0],
                scale: [1, 1.07, 0.98, 1.04, 1],
              }
            : {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
              }
        }
        transition={{
          duration: rolling ? 1.45 : 0.22,
          ease: rolling ? [0.22, 1, 0.36, 1] : "easeOut",
          repeat: rolling ? Infinity : 0,
          repeatType: "loop",
        }}
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
      >
        {dots.map((position) => (
          <span
            key={position}
            className={`${position} h-full w-full place-self-center rounded-full bg-slate-950`}
          />
        ))}
      </motion.div>
    </div>
  );
}
