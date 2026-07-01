"use client";

import { useGameStore } from "@/src/stores/gameStore";

export function FinishRankingPanel() {
  const teams = useGameStore((state) => state.teams);
  const finishRecords = useGameStore((state) => state.finishRecords);

  if (finishRecords.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 z-30 w-[310px] rounded-2xl border border-white/18 bg-slate-950/78 p-4 text-white shadow-2xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-black">도착 순위</h2>
        <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
          {finishRecords.length}팀 확정
        </span>
      </div>
      <div className="space-y-2">
        {finishRecords.map((record) => {
          const team = teams.find((candidate) => candidate.id === record.teamId);

          if (!team) {
            return null;
          }

          return (
            <div
              key={`${record.teamId}-${record.rank}`}
              className="grid grid-cols-[48px_1fr] items-center gap-3 rounded-xl bg-white/[0.08] p-3"
            >
              <div className="text-center text-2xl font-black text-amber-200">{record.rank}등</div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: team.color }} />
                  <p className="truncate text-lg font-black">{team.name}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
                  <span>{record.round}라운드</span>
                  {record.type === "autoLast" && (
                    <span className="rounded-full bg-rose-300 px-2 py-0.5 font-black text-slate-950">
                      미도착 꼴등 확정
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
