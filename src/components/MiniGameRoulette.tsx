"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useGameStore } from "@/src/stores/gameStore";
import type { MiniGame } from "@/src/types/game";

const typeLabels: Record<MiniGame["type"], string> = {
  ranked: "순위형",
  passFail: "통과형",
  manual: "수동형",
};

export function MiniGameRoulette() {
  const miniGames = useGameStore((state) => state.miniGames);
  const selectedMiniGameId = useGameStore((state) => state.selectedMiniGameId);
  const isRouletteRolling = useGameStore((state) => state.isRouletteRolling);
  const rollMiniGame = useGameStore((state) => state.rollMiniGame);
  const setSelectedMiniGame = useGameStore((state) => state.setSelectedMiniGame);
  const selectedMiniGame =
    miniGames.find((miniGame) => miniGame.id === selectedMiniGameId) ?? miniGames[0];
  const selectedIndex = Math.max(
    0,
    miniGames.findIndex((miniGame) => miniGame.id === selectedMiniGame?.id),
  );
  const [visualIndex, setVisualIndex] = useState(selectedIndex);
  const effectiveVisualIndex = isRouletteRolling ? visualIndex : selectedIndex;
  const visibleItems = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => {
        const itemIndex = (effectiveVisualIndex + index - 2 + miniGames.length) % miniGames.length;

        return miniGames[itemIndex];
      }),
    [effectiveVisualIndex, miniGames],
  );

  useEffect(() => {
    if (!isRouletteRolling) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setVisualIndex((current) => (current + 1) % miniGames.length);
    }, 72);

    return () => window.clearInterval(intervalId);
  }, [isRouletteRolling, miniGames.length, selectedIndex]);

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-white">미니게임 추첨기</h2>
        <span className="rounded-full bg-fuchsia-300 px-3 py-1 text-xs font-black text-slate-950">
          {typeLabels[selectedMiniGame.type]}
        </span>
      </div>

      <div className="relative h-[190px] overflow-hidden rounded-2xl border border-white/12 bg-slate-950/55">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-[52px] -translate-y-1/2 border-y border-amber-200/70 bg-amber-200/10" />
        <motion.div
          key={`${visualIndex}-${isRouletteRolling}`}
          className="absolute left-0 right-0 top-1/2"
          initial={{ y: -98 }}
          animate={{ y: isRouletteRolling ? [-98, -154, -98] : -98 }}
          transition={{
            duration: isRouletteRolling ? 0.18 : 0.35,
            repeat: isRouletteRolling ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {visibleItems.map((miniGame, index) => (
            <div
              key={`${miniGame.id}-${index}`}
              className={`flex h-14 items-center justify-center px-4 text-center text-xl font-black ${
                index === 2 ? "text-amber-100" : "text-slate-400"
              }`}
            >
              {miniGame.name}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <select
          className="h-12 min-w-0 rounded-xl border border-white/15 bg-slate-950 px-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
          value={selectedMiniGame.id}
          disabled={isRouletteRolling}
          onChange={(event) => setSelectedMiniGame(event.target.value)}
        >
          {miniGames.map((miniGame) => (
            <option key={miniGame.id} value={miniGame.id}>
              {miniGame.name}
            </option>
          ))}
        </select>
        <button
          className="h-12 rounded-xl bg-fuchsia-300 px-4 text-sm font-black text-slate-950 transition hover:bg-fuchsia-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          type="button"
          disabled={isRouletteRolling}
          onClick={rollMiniGame}
        >
          미니게임 추첨
        </button>
      </div>

      <div className="mt-3 rounded-2xl bg-slate-950/50 p-4">
        <p className="text-2xl font-black text-white">{selectedMiniGame.name}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
          {selectedMiniGame.description}
        </p>
      </div>
    </div>
  );
}
