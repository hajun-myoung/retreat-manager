"use client";

import { useMemo, useState } from "react";

import { HintEditor } from "./HintEditor";
import type { TreasureHint } from "@/src/lib/treasure-hunt/treasureTypes";

type TreasureAdminPanelProps = {
  initialHints: TreasureHint[];
};

export function TreasureAdminPanel({ initialHints }: TreasureAdminPanelProps) {
  const [hints, setHints] = useState(initialHints);
  const [message, setMessage] = useState("[SESSION] 서버 메모리 기반 mock 데이터입니다. 재시작 시 초기화될 수 있습니다.");
  const [isSaving, setIsSaving] = useState(false);

  const duplicateCodes = useMemo(() => {
    const counts = new Map<string, number>();
    hints.forEach((hint) => {
      const code = hint.code.trim().toUpperCase();
      counts.set(code, (counts.get(code) || 0) + 1);
    });

    return [...counts.entries()].filter(([, count]) => count > 1).map(([code]) => code);
  }, [hints]);

  function updateHint(nextHint: TreasureHint) {
    setHints((current) => current.map((hint) => (hint.id === nextHint.id ? nextHint : hint)));
  }

  async function saveHints() {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/treasure_hunt/admin/hints", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hints }),
      });
      const data = (await response.json()) as { ok: boolean; hints?: TreasureHint[]; message?: string };

      if (!response.ok || !data.ok || !data.hints) {
        setMessage(`[ERROR] ${data.message || "SAVE FAILED"}`);
        return;
      }

      setHints(data.hints);
      setMessage("[SAVED] 변경사항이 현재 서버 세션에 적용되었습니다.");
    } catch {
      setMessage("[NETWORK ERROR] 저장 실패");
    } finally {
      setIsSaving(false);
    }
  }

  async function resetHints() {
    setIsSaving(true);

    try {
      const response = await fetch("/api/treasure_hunt/admin/hints", { method: "DELETE" });
      const data = (await response.json()) as { ok: boolean; hints?: TreasureHint[] };

      if (response.ok && data.ok && data.hints) {
        setHints(data.hints);
        setMessage("[RESET] 초기 힌트 데이터로 복구되었습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/treasure_hunt/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#050606] px-4 py-5 font-mono text-emerald-100 sm:px-6">
      <section className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-emerald-400/25 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">operator console</p>
            <h1 className="mt-2 text-2xl font-black tracking-normal text-emerald-50 sm:text-4xl">
              TREASURE ADMIN PANEL
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-emerald-400/80">
              참가자 페이지는 활성화된 코드만 서버 검증합니다. 전체 코드 목록은 이 관리자 화면과 보호된 API에서만 확인합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveHints}
              disabled={isSaving || duplicateCodes.length > 0}
              className="min-h-11 border border-cyan-300/50 bg-cyan-300/10 px-4 font-black text-cyan-100 disabled:cursor-not-allowed disabled:text-emerald-700"
            >
              {isSaving ? "SAVING" : "SAVE"}
            </button>
            <button
              type="button"
              onClick={resetHints}
              disabled={isSaving}
              className="min-h-11 border border-amber-300/45 bg-amber-300/10 px-4 font-black text-amber-100 disabled:cursor-not-allowed disabled:text-emerald-700"
            >
              RESET
            </button>
            <button
              type="button"
              onClick={logout}
              className="min-h-11 border border-rose-300/45 bg-rose-300/10 px-4 font-black text-rose-100"
            >
              LOGOUT
            </button>
          </div>
        </header>

        <div className="my-4 space-y-2 text-sm">
          <p className="break-words text-emerald-300">{message}</p>
          {duplicateCodes.length > 0 ? (
            <p className="break-words text-rose-300">[DUPLICATE CODE] {duplicateCodes.join(", ")}</p>
          ) : null}
        </div>

        <div className="grid gap-3">
          {hints.map((hint) => (
            <HintEditor key={hint.id} hint={hint} onChange={updateHint} />
          ))}
        </div>
      </section>
    </main>
  );
}
