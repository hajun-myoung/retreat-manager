"use client";

import { useState } from "react";
import { MAX_BOARD_CELL_COUNT, MIN_BOARD_CELL_COUNT } from "@/src/lib/board";
import { useGameStore } from "@/src/stores/gameStore";
import type { BoardShape } from "@/src/types/game";

const boardShapeOptions: Array<{ value: BoardShape; label: string }> = [
  { value: "square", label: "사각형" },
  { value: "heart", label: "하트" },
  { value: "cross", label: "십자가" },
];

export function GameSettingsPanel() {
  const teams = useGameStore((state) => state.teams);
  const boardCellCount = useGameStore((state) => state.boardCellCount);
  const boardShape = useGameStore((state) => state.boardShape);
  const setTeamCount = useGameStore((state) => state.setTeamCount);
  const setBoardShape = useGameStore((state) => state.setBoardShape);

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <h2 className="mb-3 text-lg font-black text-white">게임 설정</h2>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-300">
            팀 수
          </span>
          <input
            className="h-11 w-full rounded-xl border border-white/15 bg-white px-3 text-base font-black text-slate-950 outline-none focus:border-cyan-300"
            type="number"
            min={2}
            max={12}
            value={teams.length}
            onChange={(event) => setTeamCount(Number(event.target.value))}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-300">
            보드 모양
          </span>
          <select
            className="h-11 w-full rounded-xl border border-white/15 bg-slate-950 px-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
            value={boardShape}
            onChange={(event) => setBoardShape(event.target.value as BoardShape)}
          >
            {boardShapeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <BoardCellCountField key={boardCellCount} initialCellCount={boardCellCount} />
    </div>
  );
}

function BoardCellCountField({ initialCellCount }: { initialCellCount: number }) {
  const setBoardCellCount = useGameStore((state) => state.setBoardCellCount);
  const [pendingCellCount, setPendingCellCount] = useState(initialCellCount);

  return (
    <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-2">
      <label className="block">
        <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-300">
          보드 칸 수
        </span>
        <input
          className="h-11 w-full rounded-xl border border-white/15 bg-white px-3 text-base font-black text-slate-950 outline-none focus:border-cyan-300"
          type="number"
          min={MIN_BOARD_CELL_COUNT}
          max={MAX_BOARD_CELL_COUNT}
          value={pendingCellCount}
          onChange={(event) => setPendingCellCount(Number(event.target.value))}
        />
      </label>
      <button
        className="h-11 rounded-xl bg-cyan-300 px-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
        type="button"
        onClick={() => setBoardCellCount(pendingCellCount)}
      >
        적용
      </button>
    </div>
  );
}
