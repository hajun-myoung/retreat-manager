"use client";

import { useGameStore } from "@/src/stores/gameStore";

export function WinnerSelector() {
  const teams = useGameStore((state) => state.teams);
  const selectedWinnerIds = useGameStore((state) => state.selectedWinnerIds);
  const toggleWinner = useGameStore((state) => state.toggleWinner);
  const phase = useGameStore((state) => state.phase);
  const isEnabled = phase === "selectingWinners";

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <h2 className="mb-3 text-lg font-black text-white">미니게임 승리팀</h2>
      <div className="grid grid-cols-2 gap-2">
        {teams.map((team) => {
          const checked = selectedWinnerIds.includes(team.id);

          return (
            <label
              key={team.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                checked ? "border-amber-300 bg-amber-300/20" : "border-white/10 bg-slate-950/40"
              } ${isEnabled ? "" : "cursor-not-allowed opacity-55"}`}
            >
              <input
                className="h-5 w-5 accent-amber-300"
                type="checkbox"
                checked={checked}
                disabled={!isEnabled}
                onChange={() => toggleWinner(team.id)}
              />
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: team.color }} />
              <span className="text-sm font-black text-white">{team.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

