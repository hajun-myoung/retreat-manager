"use client";

import { useGameStore } from "@/src/stores/gameStore";

export function TeamStatusPanel() {
  const teams = useGameStore((state) => state.teams);
  const boardCellCount = useGameStore((state) => state.boardCellCount);
  const manuallySetTeamPosition = useGameStore((state) => state.manuallySetTeamPosition);
  const updateTeamName = useGameStore((state) => state.updateTeamName);
  const finishCell = boardCellCount - 1;

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <h2 className="mb-3 text-lg font-black text-white">팀 위치 조정</h2>
      <div className="space-y-2">
        {teams.map((team) => (
          <div key={team.id} className="grid grid-cols-[1fr_78px] items-center gap-3 rounded-xl bg-slate-950/45 p-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: team.color }} />
                <input
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/8 px-2 py-1 text-sm font-black text-white outline-none focus:border-cyan-300"
                  value={team.name}
                  onChange={(event) => updateTeamName(team.id, event.target.value)}
                />
                {team.hasFinished && (
                  <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black text-slate-950">
                    도착
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-300">
                현재 {team.position}번 / 이전 {team.previousPosition}번
              </p>
            </div>
            <input
              className="h-10 rounded-lg border border-white/15 bg-white text-center text-base font-black text-slate-950 outline-none focus:border-cyan-300"
              type="number"
              min={0}
              max={finishCell}
              value={team.position}
              onChange={(event) => manuallySetTeamPosition(team.id, Number(event.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
