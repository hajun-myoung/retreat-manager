"use client";

import { AnimatePresence, motion } from "motion/react";
import { DiceAnimation } from "@/src/components/DiceAnimation";
import { useGameStore } from "@/src/stores/gameStore";
import type { DiceRollResult, Team } from "@/src/types/game";

type DiceResultOverlayProps = {
  round: number;
  teams: Team[];
  selectedMiniGameName: string;
  lastDiceResults: Record<string, DiceRollResult>;
  burstMultiplier: 1 | 2;
  isBurstActive: boolean;
  isDiceRolling: boolean;
  visible: boolean;
};

type TeamResultCardProps = {
  team: Team;
  result?: DiceRollResult;
  isWinner: boolean;
  isDiceRolling: boolean;
  onToggleWinner: (teamId: string) => void;
};

function getGridClass(teamCount: number) {
  if (teamCount <= 4) {
    return "grid-cols-1 md:grid-cols-2";
  }

  if (teamCount <= 9) {
    return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
  }

  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}

function TeamResultCard({
  team,
  result,
  isWinner,
  isDiceRolling,
  onToggleWinner,
}: TeamResultCardProps) {
  const baseValue = result?.baseValue ?? 0;
  const finalValue = result?.finalValue ?? 0;
  const multiplier = result?.multiplier ?? 1;
  const resultText =
    multiplier === 2 && baseValue > 0
      ? `🎲 ${baseValue} ×2 = ${finalValue}`
      : finalValue > 0
        ? `🎲 ${finalValue}`
        : "결과 대기";

  return (
    <motion.article
      data-testid={`winner-card-${team.id}`}
      className={`grid min-h-[190px] grid-rows-[auto_1fr_auto_auto] gap-3 rounded-2xl border p-4 text-white shadow-2xl transition ${
        isWinner ? "border-amber-200 bg-amber-200/16" : "border-white/18 bg-white/[0.08]"
      }`}
      initial={{ scale: 0.94, y: 14, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      transition={{ duration: 0.24 }}
      style={{
        boxShadow: `inset 0 0 0 2px ${team.color}, 0 18px 40px rgba(0,0,0,0.34)`,
      }}
    >
      <header className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: team.color }} />
          <h3 className="truncate text-xl font-black">{team.name}</h3>
        </div>
        <button
          className={`shrink-0 rounded-xl px-3 py-2 text-sm font-black transition ${
            isWinner
              ? "bg-amber-300 text-slate-950"
              : "bg-slate-950/70 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          }`}
          data-testid={`winner-toggle-${team.id}`}
          type="button"
          disabled={isDiceRolling}
          onClick={() => onToggleWinner(team.id)}
        >
          {isWinner ? "승리" : "선택"}
        </button>
      </header>

      <section className="flex min-h-[84px] items-center justify-center gap-4 rounded-2xl bg-slate-950/34 px-3 py-2">
        <DiceAnimation value={baseValue || finalValue || 1} rolling={isDiceRolling} size={68} />
        <div className="text-left">
          <p className="text-5xl font-black leading-none text-white">{isDiceRolling ? "..." : finalValue || "-"}</p>
          <p className="mt-2 min-h-5 text-sm font-black text-amber-100">{isDiceRolling ? "굴리는 중" : resultText}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 text-center text-sm font-bold text-slate-200">
        <div className="rounded-xl bg-slate-950/45 p-2">
          <p className="text-xs text-slate-400">이전 위치</p>
          <p className="text-xl font-black">{team.previousPosition}</p>
        </div>
        <div className="rounded-xl bg-slate-950/45 p-2">
          <p className="text-xs text-slate-400">이동 예정</p>
          <p className="text-xl font-black">{team.position}</p>
        </div>
      </section>

      <footer
        className={`rounded-xl px-3 py-2 text-center text-sm font-black ${
          isWinner ? "bg-amber-300 text-slate-950" : "bg-rose-300/18 text-rose-100"
        }`}
      >
        {isWinner ? "이동 유지" : "원위치 복귀"}
      </footer>
    </motion.article>
  );
}

export function DiceResultOverlay({
  round,
  teams,
  selectedMiniGameName,
  lastDiceResults,
  burstMultiplier,
  isBurstActive,
  isDiceRolling,
  visible,
}: DiceResultOverlayProps) {
  const selectedWinnerIds = useGameStore((state) => state.selectedWinnerIds);
  const toggleWinner = useGameStore((state) => state.toggleWinner);
  const resolveRound = useGameStore((state) => state.resolveRound);
  const closeDiceOverlay = useGameStore((state) => state.closeDiceOverlay);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="dice-result-overlay"
          className="absolute inset-0 z-40 bg-slate-950/90 p-4 text-white backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto flex h-full max-h-[calc(100vh-2rem)] max-w-[1280px] flex-col overflow-hidden rounded-3xl border border-white/16 bg-slate-950/86 shadow-2xl">
            <header className="shrink-0 border-b border-white/12 bg-white/[0.08] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
                    Round {round} Result
                  </p>
                  <h2 className="mt-1 text-2xl font-black md:text-3xl">라운드 결과 처리</h2>
                  <p className="mt-1 text-sm font-bold text-slate-300 md:text-base">
                    {isDiceRolling
                      ? "주사위 굴리는 중..."
                      : "미니게임 진행 후 승리팀을 선택하세요."}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-amber-100">{selectedMiniGameName}</p>
                  <p className="mt-1 text-sm font-black text-slate-300">
                    {isBurstActive ? `Burst ON · ×${burstMultiplier}` : "Burst OFF · ×1"}
                  </p>
                </div>
              </div>
            </header>

            <main className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className={`grid gap-4 ${getGridClass(teams.length)}`}>
                {teams.map((team) => (
                  <TeamResultCard
                    key={team.id}
                    team={team}
                    result={lastDiceResults[team.id]}
                    isWinner={selectedWinnerIds.includes(team.id)}
                    isDiceRolling={isDiceRolling}
                    onToggleWinner={toggleWinner}
                  />
                ))}
              </div>
            </main>

            <footer className="shrink-0 border-t border-white/12 bg-slate-950/95 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xl font-black">
                  선택된 승리팀 {selectedWinnerIds.length}팀
                </p>
                <div className="flex gap-3">
                  <button
                    className="h-12 rounded-2xl border border-white/20 px-5 text-base font-black text-white transition hover:bg-white/10"
                    type="button"
                    onClick={closeDiceOverlay}
                  >
                    닫기
                  </button>
                  <button
                    className="h-12 rounded-2xl bg-amber-300 px-6 text-base font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                    type="button"
                    disabled={isDiceRolling}
                    onClick={resolveRound}
                  >
                    결과 반영
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
