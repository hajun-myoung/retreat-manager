"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
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

const MiniGameInstructionViewer = dynamic(
  () =>
    import("@/src/components/MiniGameInstructionViewer").then(
      (module) => module.MiniGameInstructionViewer,
    ),
  { ssr: false },
);

export function MiniGameRoulette() {
  const [instructionMediaId, setInstructionMediaId] = useState<string | null>(
    null,
  );
  const miniGames = useGameStore((state) => state.miniGames);
  const remainingMiniGameIds = useGameStore(
    (state) => state.remainingMiniGameIds,
  );
  const selectedMiniGameId = useGameStore((state) => state.selectedMiniGameId);
  const rouletteTargetMiniGameId = useGameStore(
    (state) => state.rouletteTargetMiniGameId,
  );
  const isRouletteRolling = useGameStore((state) => state.isRouletteRolling);
  const rollMiniGame = useGameStore((state) => state.rollMiniGame);
  const resetMiniGamePool = useGameStore((state) => state.resetMiniGamePool);
  const setSelectedMiniGame = useGameStore(
    (state) => state.setSelectedMiniGame,
  );
  const selectedMiniGame =
    miniGames.find((miniGame) => miniGame.id === selectedMiniGameId) ??
    miniGames[0];
  const instructionPdf = selectedMiniGame.media?.find(
    (media) => media.type === "pdf",
  );
  const openInstructionPdf =
    instructionPdf && instructionMediaId === `${selectedMiniGame.id}:${instructionPdf.src}`
      ? instructionPdf
      : null;
  const remainingCount = remainingMiniGameIds.length;
  const isMiniGamePoolEmpty = remainingCount === 0;
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
  const idleAbsoluteIndex =
    IDLE_REPEAT_INDEX * miniGames.length + selectedIndex;
  const rollingAbsoluteIndex =
    ROLL_TARGET_REPEAT_INDEX * miniGames.length + targetIndex;
  const activeAbsoluteIndex =
    isRouletteRolling && rouletteTargetMiniGameId
      ? rollingAbsoluteIndex
      : idleAbsoluteIndex;
  const translateY = -(activeAbsoluteIndex * ITEM_HEIGHT) + HIGHLIGHT_TOP;

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-white">미니게임 추첨기</h2>
        <div className="flex flex-wrap justify-end gap-2">
          <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">
            남은 게임 {remainingCount}/{miniGames.length} 개
          </span>
          <span className="rounded-full bg-fuchsia-300 px-3 py-1 text-xs font-black text-slate-950">
            {typeLabels[selectedMiniGame.type]}
          </span>
        </div>
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
                className={`flex min-w-0 items-center justify-center px-3 text-center text-base font-black leading-tight sm:text-lg ${
                  isHighlighted ? "text-amber-100" : "text-slate-400"
                }`}
                style={{ height: ITEM_HEIGHT }}
              >
                {miniGame.name}
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
        <select
          className="h-12 min-w-0 rounded-xl border border-white/15 bg-slate-950 px-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
          value={selectedMiniGame.id}
          disabled={isRouletteRolling || isMiniGamePoolEmpty}
          onChange={(event) => setSelectedMiniGame(event.target.value)}
        >
          {miniGames.map((miniGame) => {
            const isSelected = miniGame.id === selectedMiniGame.id;
            const isRemaining = remainingMiniGameIds.includes(miniGame.id);

            return (
              <option
                key={miniGame.id}
                value={miniGame.id}
                disabled={!isSelected && !isRemaining}
              >
                {miniGame.name}
                {!isSelected && !isRemaining ? " (사용 완료)" : ""}
              </option>
            );
          })}
        </select>
        <button
          className="h-12 rounded-xl border border-cyan-200/50 px-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-200/10 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-500"
          type="button"
          disabled={isRouletteRolling || remainingCount === miniGames.length}
          onClick={resetMiniGamePool}
        >
          목록 초기화
        </button>
        <button
          className="h-12 rounded-xl bg-fuchsia-300 px-4 text-sm font-black text-slate-950 transition hover:bg-fuchsia-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          type="button"
          disabled={isRouletteRolling || isMiniGamePoolEmpty}
          onClick={rollMiniGame}
        >
          {isMiniGamePoolEmpty ? "목록 소진" : "미니게임 추첨"}
        </button>
      </div>

      {isMiniGamePoolEmpty && (
        <div className="mt-3 rounded-2xl border border-amber-200/40 bg-amber-200/10 p-3 text-sm font-black text-amber-100">
          모든 미니게임을 사용했습니다. 목록 초기화 후 추첨을 계속할 수
          있습니다.
        </div>
      )}

      <div className="mt-3 rounded-2xl bg-slate-950/50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-2xl font-black text-white">
            {selectedMiniGame.name}
          </p>
          {instructionPdf && (
            <button
              className="h-10 rounded-xl bg-cyan-300 px-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
              type="button"
              onClick={() =>
                setInstructionMediaId(`${selectedMiniGame.id}:${instructionPdf.src}`)
              }
            >
              View Instructions
            </button>
          )}
        </div>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
          {selectedMiniGame.description}
        </p>
      </div>

      {openInstructionPdf && (
        <MiniGameInstructionViewer
          media={openInstructionPdf}
          miniGameName={selectedMiniGame.name}
          onClose={() => setInstructionMediaId(null)}
        />
      )}
    </div>
  );
}
