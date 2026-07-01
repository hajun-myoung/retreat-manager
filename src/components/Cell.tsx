import type { BoardCell } from "@/src/lib/board";

type CellProps = {
  cell: BoardCell;
  finishIndex: number;
  cellSize: number;
};

export function Cell({ cell, finishIndex, cellSize }: CellProps) {
  const isStart = cell.index === 0;
  const isFinish = cell.index === finishIndex;
  const tone = isFinish
    ? "border-amber-300 bg-amber-200 text-amber-950 shadow-[0_0_26px_rgba(251,191,36,0.55)]"
    : isStart
      ? "border-emerald-300 bg-emerald-200 text-emerald-950"
      : "border-white/35 bg-white text-slate-950";

  return (
    <div
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border-[3px] ${tone}`}
      style={{ left: cell.x, top: cell.y, width: cellSize, height: cellSize }}
    >
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-700/70">
        {isStart ? "START" : isFinish ? "FINISH" : "CELL"}
      </span>
      <span className="text-3xl font-black leading-none">{cell.label}</span>
    </div>
  );
}
