"use client";

import { useGameStore } from "@/src/stores/gameStore";

export function WinnerSelector() {
  const phase = useGameStore((state) => state.phase);
  const selectedWinnerIds = useGameStore((state) => state.selectedWinnerIds);
  const openDiceOverlay = useGameStore((state) => state.openDiceOverlay);
  const isAwaitingMiniGame = phase === "awaitingMiniGame";

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <h2 className="mb-3 text-lg font-black text-white">미니게임 승리팀</h2>
      <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
        <p className="text-sm font-bold leading-6 text-slate-300">
          승리팀 선택과 결과 반영은 메인 보드의 라운드 결과 처리 화면에서 진행합니다.
        </p>
        <p className="mt-2 text-base font-black text-white">
          현재 선택 {selectedWinnerIds.length}팀
        </p>
        <button
          className="mt-3 h-11 w-full rounded-xl bg-amber-300 text-sm font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          type="button"
          disabled={!isAwaitingMiniGame}
          onClick={openDiceOverlay}
        >
          결과 처리 화면 열기
        </button>
      </div>
    </div>
  );
}
