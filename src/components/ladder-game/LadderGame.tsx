"use client";

import { useEffect, useMemo, useState } from "react";
import { LadderBoard } from "@/src/components/ladder-game/LadderBoard";
import {
  createAssignments,
  createDefaultDestinations,
  createDefaultParticipants,
  generateLadder,
} from "@/src/lib/ladder";
import type {
  LadderConfig,
  LadderDestination,
  LadderParticipant,
} from "@/src/types/ladder";

const MIN_COUNT = 2;
const MAX_COUNT = 10;
const BOARD_TRACE_WIDTH = 1000;
const BOARD_TRACE_HEIGHT = 620;
const STEP_DURATION_MS = 2100;

function clampCount(count: number) {
  if (Number.isNaN(count)) {
    return 6;
  }

  return Math.max(MIN_COUNT, Math.min(MAX_COUNT, Math.round(count)));
}

function resizeParticipants(
  participants: LadderParticipant[],
  count: number,
): LadderParticipant[] {
  const nextCount = clampCount(count);

  if (participants.length >= nextCount) {
    return participants.slice(0, nextCount);
  }

  const additions = createDefaultParticipants(nextCount).slice(participants.length);

  return [...participants, ...additions];
}

function resizeDestinations(
  destinations: LadderDestination[],
  count: number,
): LadderDestination[] {
  const nextCount = clampCount(count);

  if (destinations.length >= nextCount) {
    return destinations.slice(0, nextCount);
  }

  const additions = createDefaultDestinations(nextCount).slice(destinations.length);

  return [...destinations, ...additions];
}

export function LadderGame() {
  const [participantCount, setParticipantCount] = useState(6);
  const [participants, setParticipants] = useState(() =>
    createDefaultParticipants(6),
  );
  const [destinations, setDestinations] = useState(() =>
    createDefaultDestinations(6),
  );
  const [config, setConfig] = useState<LadderConfig>(() => generateLadder(6));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [revealedParticipantIds, setRevealedParticipantIds] = useState<string[]>(
    [],
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const assignments = useMemo(
    () =>
      createAssignments({
        participants,
        destinations,
        config,
        width: BOARD_TRACE_WIDTH,
        height: BOARD_TRACE_HEIGHT,
      }),
    [config, destinations, participants],
  );

  useEffect(() => {
    if (!isAnimating || activeIndex === null) {
      return;
    }

    const activeParticipant = participants[activeIndex];

    if (!activeParticipant) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setRevealedParticipantIds((ids) =>
        ids.includes(activeParticipant.id) ? ids : [...ids, activeParticipant.id],
      );
      setActiveIndex((index) =>
        index === null || index + 1 >= participants.length ? null : index + 1,
      );

      if (activeIndex + 1 >= participants.length) {
        setIsAnimating(false);
      }
    }, STEP_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, isAnimating, participants]);

  const startTraversal = () => {
    setRevealedParticipantIds([]);
    setActiveIndex(0);
    setIsAnimating(true);
  };

  const regenerateLadder = () => {
    setConfig(generateLadder(participantCount, Date.now()));
    setRevealedParticipantIds([]);
    setActiveIndex(null);
    setIsAnimating(false);
  };

  const updateCount = (count: number) => {
    const nextCount = clampCount(count);

    setParticipantCount(nextCount);
    setParticipants((current) => resizeParticipants(current, nextCount));
    setDestinations((current) => resizeDestinations(current, nextCount));
    setConfig(generateLadder(nextCount, nextCount));
    setRevealedParticipantIds([]);
    setActiveIndex(null);
    setIsAnimating(false);
  };

  const activeParticipantId =
    activeIndex === null ? null : participants[activeIndex]?.id ?? null;
  const isComplete = revealedParticipantIds.length === participants.length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080c18] p-5 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-[1720px] flex-col gap-5">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-200">
              Amidakuji
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-normal text-white xl:text-6xl">
              사다리 게임
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="h-12 rounded-2xl bg-emerald-300 px-5 text-base font-black text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
              type="button"
              disabled={isAnimating}
              onClick={startTraversal}
            >
              {isComplete ? "다시 보기" : "사다리 실행"}
            </button>
            <button
              className="h-12 rounded-2xl border border-cyan-200/50 px-5 text-base font-black text-cyan-100 transition hover:bg-cyan-200/10 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-500"
              type="button"
              disabled={isAnimating}
              onClick={regenerateLadder}
            >
              새 사다리 생성
            </button>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 grid-cols-1 gap-5 xl:grid-cols-[390px_1fr_360px]">
          <aside className="max-h-[calc(100vh-150px)] overflow-auto rounded-[28px] border border-white/14 bg-slate-900/88 p-5 shadow-2xl">
            <div className="mb-4">
              <label className="text-sm font-black text-slate-200" htmlFor="participant-count">
                참가 수
              </label>
              <input
                id="participant-count"
                className="mt-2 h-12 w-full rounded-2xl border border-white/15 bg-slate-950 px-4 text-lg font-black text-white outline-none focus:border-cyan-300"
                min={MIN_COUNT}
                max={MAX_COUNT}
                type="number"
                value={participantCount}
                onChange={(event) => updateCount(Number(event.target.value))}
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-black text-white">참가자</h2>
              {participants.map((participant, index) => (
                <input
                  key={participant.id}
                  className="h-11 w-full rounded-xl border border-white/12 bg-slate-950 px-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
                  value={participant.name}
                  aria-label={`${index + 1}번 참가자 이름`}
                  onChange={(event) =>
                    setParticipants((current) =>
                      current.map((item) =>
                        item.id === participant.id
                          ? { ...item, name: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
              ))}
            </div>

            <div className="mt-5 space-y-3">
              <h2 className="text-lg font-black text-white">결과</h2>
              {destinations.map((destination, index) => (
                <input
                  key={destination.id}
                  className="h-11 w-full rounded-xl border border-white/12 bg-slate-950 px-3 text-sm font-bold text-white outline-none focus:border-amber-300"
                  value={destination.label}
                  aria-label={`${index + 1}번 결과`}
                  onChange={(event) =>
                    setDestinations((current) =>
                      current.map((item) =>
                        item.id === destination.id
                          ? { ...item, label: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
              ))}
            </div>
          </aside>

          <LadderBoard
            assignments={assignments}
            config={config}
            destinations={destinations}
            participants={participants}
            activeParticipantId={activeParticipantId}
            revealedParticipantIds={revealedParticipantIds}
          />

          <aside className="max-h-[calc(100vh-150px)] overflow-auto rounded-[28px] border border-white/14 bg-slate-900/88 p-5 shadow-2xl">
            <h2 className="text-xl font-black text-white">배정 결과</h2>
            <div className="mt-4 space-y-3">
              {participants.map((participant) => {
                const assignment = assignments.find(
                  (item) => item.participantId === participant.id,
                );
                const destination = destinations.find(
                  (item) => item.id === assignment?.destinationId,
                );
                const isRevealed = revealedParticipantIds.includes(participant.id);

                return (
                  <div
                    key={participant.id}
                    className={`rounded-2xl border p-3 ${
                      isRevealed
                        ? "border-amber-200 bg-amber-200/16"
                        : "border-white/12 bg-white/[0.06]"
                    }`}
                  >
                    <p className="text-sm font-black text-slate-200">
                      {participant.name}
                    </p>
                    <p className="mt-1 text-lg font-black text-white">
                      {isRevealed ? destination?.label : "대기 중"}
                    </p>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
