import type { BoardCell } from "@/src/lib/board";

type CellProps = {
  cell: BoardCell;
};

export function Cell({ cell }: CellProps) {
  const tone = cell.isFinish
    ? "border-amber-300 bg-amber-200 text-amber-950 shadow-[0_0_26px_rgba(251,191,36,0.55)]"
    : cell.isStart
      ? "border-emerald-300 bg-emerald-200 text-emerald-950"
      : "border-white/35 bg-white text-slate-950";

  return (
    <div
      className={`absolute flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border-4 ${tone}`}
      style={{ left: cell.x, top: cell.y }}
    >
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-700/70">
        {cell.isStart ? "START" : cell.isFinish ? "FINISH" : "CELL"}
      </span>
      <span className="text-4xl font-black leading-none">{cell.label}</span>
    </div>
  );
}

