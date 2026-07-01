"use client";

import { DicePanel } from "@/src/components/DicePanel";
import { GameSettingsPanel } from "@/src/components/GameSettingsPanel";
import { MiniGameRoulette } from "@/src/components/MiniGameRoulette";
import { TeamStatusPanel } from "@/src/components/TeamStatusPanel";
import { WinnerSelector } from "@/src/components/WinnerSelector";
import { useGameStore } from "@/src/stores/gameStore";

const phaseLabels = {
  idle: "대기",
  rolling: "굴리는 중",
  moved: "이동 완료",
  selectingWinners: "승리팀 선택",
  resolved: "라운드 확정",
} as const;

export function RoundControlPanel() {
  const round = useGameStore((state) => state.round);
  const phase = useGameStore((state) => state.phase);
  const isBurstActive = useGameStore((state) => state.isBurstActive);
  const burstMultiplier = useGameStore((state) => state.burstMultiplier);
  const rollDiceForAllTeams = useGameStore(
    (state) => state.rollDiceForAllTeams,
  );
  const resolveRound = useGameStore((state) => state.resolveRound);
  const resetGame = useGameStore((state) => state.resetGame);
  const canRoll = phase === "idle" || phase === "resolved";
  const canResolve = phase === "selectingWinners";

  return (
    <aside className="flex max-h-[calc(100vh-48px)] w-full flex-col gap-4 overflow-auto rounded-[28px] border border-white/14 bg-slate-900/88 p-5 shadow-2xl lg:w-[470px]">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-cyan-300 p-4 text-slate-950">
          <p className="text-xs font-black uppercase tracking-[0.18em]">
            Round
          </p>
          <p className="text-4xl font-black">{round}</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-white/[0.08] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-300">
            Phase
          </p>
          <p className="mt-1 text-2xl font-black text-white">
            {phaseLabels[phase]}
          </p>
        </div>
      </div>

      <div
        className={`rounded-2xl border p-4 ${isBurstActive ? "border-amber-300 bg-amber-300/20" : "border-white/10 bg-white/[0.05]"}`}
      >
        <p className="text-sm font-bold text-slate-200">버스트 모드</p>
        <p className="mt-1 text-2xl font-black text-white">
          {isBurstActive
            ? `발동 중 · 다음 주사위 ×${burstMultiplier}`
            : "대기 중 · 기본 배수 ×1"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          className="h-14 rounded-2xl bg-emerald-300 text-lg font-black text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          type="button"
          disabled={!canRoll}
          onClick={rollDiceForAllTeams}
        >
          주사위 굴리기
        </button>
        <button
          className="h-14 rounded-2xl bg-amber-300 text-lg font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          type="button"
          disabled={!canResolve}
          onClick={resolveRound}
        >
          결과 확정
        </button>
      </div>

      <GameSettingsPanel />
      <MiniGameRoulette />
      <DicePanel />
      <WinnerSelector />

      <button
        className="h-12 rounded-2xl border border-rose-300/60 bg-rose-500/18 text-base font-black text-rose-100 transition hover:bg-rose-500/28"
        type="button"
        onClick={resetGame}
      >
        게임 초기화
      </button>

      <TeamStatusPanel />
    </aside>
  );
}
