"use client";

import { motion } from "motion/react";
import { useGameStore } from "@/src/stores/gameStore";

export function DicePanel() {
  const teams = useGameStore((state) => state.teams);
  const lastDiceResults = useGameStore((state) => state.lastDiceResults);
  const phase = useGameStore((state) => state.phase);
  const isRollingView = phase === "awaitingMiniGame";

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-white">주사위 결과</h2>
        <span className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-black text-slate-950">D4</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {teams.map((team, index) => (
          <div key={team.id} className="flex items-center gap-3 rounded-xl bg-slate-950/55 p-3">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/25 text-xl font-black text-white shadow-inner"
              animate={
                isRollingView
                  ? { rotateX: [0, 28, -18, 0], rotateZ: [0, -8, 10, 0], y: [0, -3, 2, 0] }
                  : { rotateX: 0, rotateZ: 0, y: 0 }
              }
              transition={{ duration: 0.62, delay: index * 0.035 }}
              style={{
                background: `linear-gradient(145deg, ${team.color}, #111827 110%)`,
                transformStyle: "preserve-3d",
              }}
            >
              {lastDiceResults[team.id]?.finalValue ?? "-"}
            </motion.div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{team.name}</p>
              <p className="text-xs font-semibold text-slate-300">
                {team.previousPosition} → {team.position}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
