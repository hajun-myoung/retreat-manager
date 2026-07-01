"use client";

import { motion, AnimatePresence } from "motion/react";
import type { Team } from "@/src/types/game";

type DiceResultOverlayProps = {
  teams: Team[];
  lastDiceResults: Record<string, number>;
  burstMultiplier: 1 | 2;
  isBurstActive: boolean;
  visible: boolean;
};

function getGridClass(teamCount: number) {
  if (teamCount <= 2) {
    return "grid-cols-2";
  }

  if (teamCount <= 4) {
    return "grid-cols-2";
  }

  if (teamCount <= 9) {
    return "grid-cols-3";
  }

  return "grid-cols-4";
}

export function DiceResultOverlay({
  teams,
  lastDiceResults,
  burstMultiplier,
  isBurstActive,
  visible,
}: DiceResultOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="dice-result-overlay"
          className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/82 p-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`grid h-full w-full gap-3 ${getGridClass(teams.length)}`}>
            {teams.map((team, index) => {
              const finalResult = lastDiceResults[team.id] ?? 0;
              const baseResult =
                isBurstActive && burstMultiplier === 2 ? finalResult / burstMultiplier : finalResult;

              return (
                <motion.div
                  key={team.id}
                  className="flex min-h-0 flex-col items-center justify-center rounded-2xl border border-white/18 bg-white/[0.08] p-4 text-center shadow-2xl"
                  initial={{ scale: 0.9, y: 16, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ delay: index * 0.035, duration: 0.28 }}
                  style={{
                    boxShadow: `inset 0 0 0 2px ${team.color}, 0 18px 40px rgba(0,0,0,0.34)`,
                  }}
                >
                  <p className="max-w-full truncate text-2xl font-black text-white">{team.name}</p>
                  <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/25 bg-white text-5xl shadow-inner">
                    🎲
                  </div>
                  <p className="mt-3 text-6xl font-black leading-none text-white md:text-7xl">
                    {finalResult || "-"}
                  </p>
                  <p className="mt-2 min-h-6 text-lg font-black text-amber-100">
                    {isBurstActive && burstMultiplier === 2
                      ? `🎲 ${baseResult} ×2 = ${finalResult}`
                      : finalResult
                        ? `🎲 ${finalResult}`
                        : ""}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
