"use client";

import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "@/src/stores/gameStore";
import type { Team } from "@/src/types/game";

type DiceResultOverlayProps = {
  round: number;
  teams: Team[];
  selectedMiniGameName: string;
  lastDiceResults: Record<string, number>;
  burstMultiplier: 1 | 2;
  isBurstActive: boolean;
  visible: boolean;
};

function getGridClass(teamCount: number) {
  if (teamCount <= 2) {
    return "grid-cols-2";
  }

  if (teamCount <= 4) {
    return "grid-cols-2";
  }

  if (teamCount <= 9) {
    return "grid-cols-3";
  }

  return "grid-cols-4";
}

export function DiceResultOverlay({
  round,
  teams,
  selectedMiniGameName,
  lastDiceResults,
  burstMultiplier,
  isBurstActive,
  visible,
}: DiceResultOverlayProps) {
  const selectedWinnerIds = useGameStore((state) => state.selectedWinnerIds);
  const toggleWinner = useGameStore((state) => state.toggleWinner);
  const resolveRound = useGameStore((state) => state.resolveRound);
  const closeDiceOverlay = useGameStore((state) => state.closeDiceOverlay);
  const isCompact = teams.length >= 7;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="dice-result-overlay"
          className="absolute inset-0 z-40 flex flex-col bg-slate-950/88 p-5 text-white backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/14 bg-white/[0.08] p-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
                Round {round} Result
              </p>
              <h2 className="mt-1 text-2xl font-black md:text-3xl">라운드 결과 처리</h2>
              <p className="mt-1 text-sm font-bold text-slate-300 md:text-base">
                미니게임 진행 후 이동을 확정할 팀을 선택하세요.
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-amber-100">{selectedMiniGameName}</p>
              <p className="mt-1 text-sm font-black text-slate-300">
                {isBurstActive ? `Burst ON · ×${burstMultiplier}` : "Burst OFF · ×1"}
              </p>
            </div>
          </div>

          <div className={`grid min-h-0 flex-1 gap-3 ${getGridClass(teams.length)}`}>
            {teams.map((team, index) => {
              const finalResult = lastDiceResults[team.id] ?? 0;
              const baseResult =
                isBurstActive && burstMultiplier === 2 ? finalResult / burstMultiplier : finalResult;
              const isWinner = selectedWinnerIds.includes(team.id);

              return (
                <motion.div
                  key={team.id}
                  data-testid={`winner-card-${team.id}`}
                  className={`flex min-h-0 flex-col justify-between rounded-2xl border text-center shadow-2xl transition ${
                    isWinner
                      ? "border-amber-200 bg-amber-200/16"
                      : "border-white/18 bg-white/[0.08]"
                  } ${isCompact ? "p-3" : "p-4"}`}
                  onPointerDownCapture={(event) => {
                    const target = event.target as HTMLElement;

                    if (target.closest("[data-overlay-action]")) {
                      return;
                    }

                    toggleWinner(team.id);
                  }}
                  initial={{ scale: 0.9, y: 16, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ delay: index * 0.035, duration: 0.28 }}
                  style={{
                    boxShadow: `inset 0 0 0 2px ${team.color}, 0 18px 40px rgba(0,0,0,0.34)`,
                  }}
                >
                  <div>
                    <p className={`max-w-full truncate font-black text-white ${isCompact ? "text-lg" : "text-2xl"}`}>
                      {team.name}
                    </p>
                    <div
                      className={`mx-auto flex items-center justify-center rounded-2xl border border-white/25 bg-white shadow-inner ${
                        isCompact ? "mt-1 h-10 w-10 text-2xl" : "mt-3 h-16 w-16 text-4xl"
                      }`}
                    >
                      🎲
                    </div>
                    <p className={`mt-1 font-black leading-none text-white ${isCompact ? "text-3xl" : "text-5xl md:text-6xl"}`}>
                      {finalResult || "-"}
                    </p>
                    <p className={`mt-1 min-h-5 font-black text-amber-100 ${isCompact ? "text-xs" : "text-base"}`}>
                      {isBurstActive && burstMultiplier === 2
                        ? `🎲 ${baseResult} ×2 = ${finalResult}`
                        : finalResult
                          ? `🎲 ${finalResult}`
                          : ""}
                    </p>
                    <div className={`grid grid-cols-2 gap-2 font-bold text-slate-200 ${isCompact ? "mt-1 text-xs" : "mt-3 text-sm"}`}>
                      <div className={`rounded-xl bg-slate-950/45 ${isCompact ? "p-1" : "p-2"}`}>
                        <p className="text-xs text-slate-400">이전</p>
                        <p className={`${isCompact ? "text-sm" : "text-lg"} font-black`}>{team.previousPosition}</p>
                      </div>
                      <div className={`rounded-xl bg-slate-950/45 ${isCompact ? "p-1" : "p-2"}`}>
                        <p className="text-xs text-slate-400">이동 예정</p>
                        <p className={`${isCompact ? "text-sm" : "text-lg"} font-black`}>{team.position}</p>
                      </div>
                    </div>
                  </div>

                  <div className={isCompact ? "mt-1" : "mt-3"}>
                    <label
                      data-overlay-action="winner-toggle"
                      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-black transition ${
                        isWinner
                          ? "bg-amber-300 text-slate-950"
                          : "bg-slate-950/65 text-white hover:bg-slate-800"
                      } ${isCompact ? "h-9 text-sm" : "h-11 text-base"}`}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        toggleWinner(team.id);
                      }}
                    >
                      <input
                        className={`${isCompact ? "h-4 w-4" : "h-5 w-5"} accent-slate-950`}
                        data-testid={`winner-toggle-${team.id}`}
                        type="checkbox"
                        checked={isWinner}
                        readOnly
                      />
                      {isWinner ? "승리 선택됨" : "승리 선택"}
                    </label>
                    <p className={`${isCompact ? "mt-1 text-xs" : "mt-2 text-sm"} font-black ${isWinner ? "text-amber-100" : "text-rose-100"}`}>
                      {isWinner ? "이동 유지" : "원위치 복귀"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/14 bg-white/[0.08] p-3">
            <p className="text-xl font-black">
              선택된 승리팀 {selectedWinnerIds.length}팀
            </p>
            <div className="flex gap-3">
              <button
                data-overlay-action="close"
                className="h-12 rounded-2xl border border-white/20 px-5 text-base font-black text-white transition hover:bg-white/10"
                type="button"
                onClick={closeDiceOverlay}
              >
                닫기
              </button>
              <button
                data-overlay-action="resolve"
                className="h-12 rounded-2xl bg-amber-300 px-6 text-base font-black text-slate-950 transition hover:bg-amber-200"
                type="button"
                onClick={resolveRound}
              >
                결과 반영
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
