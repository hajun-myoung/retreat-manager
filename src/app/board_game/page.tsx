import { Board } from "@/src/components/Board";
import { FullscreenToggleButton } from "@/src/components/FullscreenToggleButton";
import { RoundControlPanel } from "@/src/components/RoundControlPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "정의마블 | PolyParty",
};

export default function BoardGamePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080c18] p-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1720px] flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-5">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-200">
                Retreat Opening Game
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-normal text-white xl:text-6xl">
                정의마블
              </h1>
            </div>
            <div className="flex flex-wrap items-end justify-end gap-3">
              <div className="rounded-2xl border border-white/14 bg-white/[0.07] px-5 py-3 text-right">
                <p className="text-sm font-bold text-slate-300">
                  8팀 동시 이동 · 22칸 순환 보드
                </p>
                <p className="text-lg font-black text-amber-200">
                  미니게임 결과로 이동 확정
                </p>
              </div>
              <FullscreenToggleButton />
            </div>
          </header>
          <Board />
        </div>
        <RoundControlPanel />
      </div>
    </main>
  );
}
