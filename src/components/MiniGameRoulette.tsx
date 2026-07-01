"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useGameStore } from "@/src/stores/gameStore";
import type { MiniGame } from "@/src/types/game";

const ITEM_HEIGHT = 64;
const VISIBLE_ITEM_COUNT = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEM_COUNT;
const CENTER_INDEX = Math.floor(VISIBLE_ITEM_COUNT / 2);
const HIGHLIGHT_TOP = ITEM_HEIGHT * CENTER_INDEX;
const REPEAT_COUNT = 9;
const IDLE_REPEAT_INDEX = 3;
const ROLL_TARGET_REPEAT_INDEX = 7;
const ROLL_DURATION_SECONDS = 3;
const ROLL_EASING = [0.22, 1, 0.36, 1] as const;

const typeLabels: Record<MiniGame["type"], string> = {
  ranked: "순위형",
  passFail: "통과형",
  manual: "수동형",
};

export function MiniGameRoulette() {
  const miniGames = useGameStore((state) => state.miniGames);
  const selectedMiniGameId = useGameStore((state) => state.selectedMiniGameId);
  const rouletteTargetMiniGameId = useGameStore((state) => state.rouletteTargetMiniGameId);
  const isRouletteRolling = useGameStore((state) => state.isRouletteRolling);
  const rollMiniGame = useGameStore((state) => state.rollMiniGame);
  const setSelectedMiniGame = useGameStore((state) => state.setSelectedMiniGame);
  const selectedMiniGame =
    miniGames.find((miniGame) => miniGame.id === selectedMiniGameId) ?? miniGames[0];
  const selectedIndex = Math.max(
    0,
    miniGames.findIndex((miniGame) => miniGame.id === selectedMiniGame?.id),
  );
  const targetIndex = Math.max(
    0,
    miniGames.findIndex((miniGame) => miniGame.id === rouletteTargetMiniGameId),
  );
  const extendedList = useMemo(
    () => Array.from({ length: REPEAT_COUNT }, () => miniGames).flat(),
    [miniGames],
  );
  const idleAbsoluteIndex = IDLE_REPEAT_INDEX * miniGames.length + selectedIndex;
  const rollingAbsoluteIndex = ROLL_TARGET_REPEAT_INDEX * miniGames.length + targetIndex;
  const activeAbsoluteIndex =
    isRouletteRolling && rouletteTargetMiniGameId ? rollingAbsoluteIndex : idleAbsoluteIndex;
  const translateY = -(activeAbsoluteIndex * ITEM_HEIGHT) + HIGHLIGHT_TOP;

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-white">미니게임 추첨기</h2>
        <span className="rounded-full bg-fuchsia-300 px-3 py-1 text-xs font-black text-slate-950">
          {typeLabels[selectedMiniGame.type]}
        </span>
      </div>

      <div
        data-testid="mini-game-roulette-viewport"
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-slate-950/55"
        style={{ height: CONTAINER_HEIGHT }}
      >
        <div
          data-testid="mini-game-roulette-highlight"
          className="pointer-events-none absolute left-0 right-0 z-10 border-y border-amber-200/70 bg-amber-200/10"
          style={{ top: HIGHLIGHT_TOP, height: ITEM_HEIGHT }}
        />
        <motion.div
          className="absolute left-0 right-0 top-0"
          animate={{ y: translateY }}
          transition={{
            duration: isRouletteRolling ? ROLL_DURATION_SECONDS : 0,
            ease: isRouletteRolling ? ROLL_EASING : "linear",
          }}
        >
          {extendedList.map((miniGame, index) => {
            const isHighlighted = index === activeAbsoluteIndex;

            return (
              <div
                key={`${miniGame.id}-${index}`}
                data-active={isHighlighted ? "true" : "false"}
                data-testid="mini-game-roulette-item"
                className={`flex items-center justify-center px-4 text-center text-xl font-black ${
                  isHighlighted ? "text-amber-100" : "text-slate-400"
                }`}
                style={{ height: ITEM_HEIGHT, lineHeight: `${ITEM_HEIGHT}px` }}
              >
                {miniGame.name}
              </div>
            );
          })}
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
