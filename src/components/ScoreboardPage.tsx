"use client";

import { FormEvent, useMemo, useState } from "react";
import { getLeaderboardEntries, useScoreboardStore } from "@/src/stores/scoreboardStore";
import type { LeaderboardEntry, ScoreRecord, ScoreboardTeam } from "@/src/types/scoreboard";

const MAX_REVEAL_STEP = 4;

function formatSignedScore(score: number) {
  return score > 0 ? `+${score}` : String(score);
}

function formatCreatedTime(isoDate: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

function getTeamName(teamId: string, teams: ScoreboardTeam[]) {
  return teams.find((team) => team.id === teamId)?.name ?? "삭제된 팀";
}

function getTeamColor(teamId: string, teams: ScoreboardTeam[]) {
  return teams.find((team) => team.id === teamId)?.color ?? "#64748b";
}

function getVisibleRevealEntries(entries: LeaderboardEntry[], revealStep: number) {
  if (revealStep === 0) {
    return new Set<string>();
  }

  if (revealStep === 1) {
    return new Set(entries.filter((entry) => entry.rank === 3).map((entry) => entry.team.id));
  }

  if (revealStep === 2) {
    return new Set(entries.filter((entry) => entry.rank === 2).map((entry) => entry.team.id));
  }

  const lastRank = Math.max(...entries.map((entry) => entry.rank), 0);

  if (revealStep === 3) {
    return new Set(
      entries
        .filter((entry) => entry.rank >= 4 && entry.rank < lastRank)
        .map((entry) => entry.team.id),
    );
  }

  return new Set(
    entries
      .filter((entry) => entry.rank === 1 || entry.rank === lastRank)
      .map((entry) => entry.team.id),
  );
}

function getRevealStepTitle(revealStep: number) {
  if (revealStep === 1) {
    return "3rd Place Reveal";
  }

  if (revealStep === 2) {
    return "2nd Place Reveal";
  }

  if (revealStep === 3) {
    return "Lower-Middle Reveal";
  }

  if (revealStep === 4) {
    return "Champion & Final Reveal";
  }

  return "Final Ranking Locked";
}

function LeaderboardPanel({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <section className="rounded-[28px] border border-white/14 bg-slate-900/88 p-5 shadow-2xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">
            Retreat Scoreboard
          </p>
          <h1 className="mt-2 text-4xl font-black text-white xl:text-6xl">종합 점수판</h1>
        </div>
        <div className="rounded-2xl border border-white/14 bg-white/[0.07] px-5 py-3 text-right">
          <p className="text-sm font-bold text-slate-300">동점은 공동 순위로 표시</p>
          <p className="text-lg font-black text-amber-200">총점 높은 순 · 등록 순 안정 정렬</p>
        </div>
      </div>

      <div className="grid gap-3">
        {entries.map((entry, index) => {
          const isTop = entry.rank <= 3;

          return (
            <article
              key={entry.team.id}
              className={`grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-2xl border p-4 ${
                isTop
                  ? "border-amber-200/70 bg-amber-200/14"
                  : "border-white/10 bg-white/[0.06]"
              }`}
            >
              <div className="text-center">
                <p className={`text-4xl font-black ${isTop ? "text-amber-200" : "text-slate-300"}`}>
                  {entry.rank}
                </p>
                {index > 0 && entry.rank === entries[index - 1].rank && (
                  <p className="text-xs font-black text-cyan-100">공동</p>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-5 w-5 shrink-0 rounded-full border border-white/50"
                    style={{ backgroundColor: entry.team.color }}
                  />
                  <h2 className="truncate text-2xl font-black text-white">{entry.team.name}</h2>
                </div>
                <p className="mt-1 text-sm font-bold text-slate-300">
                  {entry.scoreCount}개 기록 합산
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-white">{entry.totalScore}</p>
                <p className="text-sm font-black text-cyan-100">points</p>
              </div>
            </article>
          );
        })}

        {entries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-lg font-bold text-slate-300">
            아직 등록된 팀이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

function ScoreEntryPanel({
  teams,
  activityTitle,
  onSubmit,
  onActivityTitleChange,
}: {
  teams: ScoreboardTeam[];
  activityTitle: string;
  onSubmit: (input: { teamId: string; points: number; note: string }) => void;
  onActivityTitleChange: (activityTitle: string) => void;
}) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [points, setPoints] = useState("");
  const [note, setNote] = useState("");
  const safeTeamId = teams.some((team) => team.id === teamId) ? teamId : teams[0]?.id ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      teamId: safeTeamId,
      points: Number(points),
      note,
    });
    setPoints("");
    setNote("");
  }

  return (
    <section className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <h2 className="mb-3 text-lg font-black text-white">점수 입력</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-300">
            Activity
          </span>
          <input
            className="h-11 w-full rounded-xl border border-white/15 bg-white px-3 text-base font-black text-slate-950 outline-none focus:border-cyan-300"
            value={activityTitle}
            onChange={(event) => onActivityTitleChange(event.target.value)}
          />
        </label>

        <div className="grid grid-cols-[1fr_120px] gap-2">
          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-300">
              Team
            </span>
            <select
              className="h-11 w-full rounded-xl border border-white/15 bg-slate-950 px-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
              value={safeTeamId}
              onChange={(event) => setTeamId(event.target.value)}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-300">
              Points
            </span>
            <input
              className="h-11 w-full rounded-xl border border-white/15 bg-white px-3 text-center text-base font-black text-slate-950 outline-none focus:border-cyan-300"
              type="number"
              value={points}
              onChange={(event) => setPoints(event.target.value)}
              placeholder="+/-"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-300">
            Note
          </span>
          <input
            className="h-11 w-full rounded-xl border border-white/15 bg-white px-3 text-base font-bold text-slate-950 outline-none focus:border-cyan-300"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="선택 사항"
          />
        </label>

        <button
          className="h-12 w-full rounded-2xl bg-emerald-300 text-base font-black text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          type="submit"
          disabled={!safeTeamId || points.trim() === ""}
        >
          점수 추가
        </button>
      </form>
    </section>
  );
}

function TeamManagementPanel({
  teams,
  onAddTeam,
  onRemoveTeam,
  onSetTeamCount,
  onUpdateTeamName,
  onUpdateTeamColor,
}: {
  teams: ScoreboardTeam[];
  onAddTeam: () => void;
  onRemoveTeam: (team: ScoreboardTeam) => void;
  onSetTeamCount: (count: number) => void;
  onUpdateTeamName: (teamId: string, name: string) => void;
  onUpdateTeamColor: (teamId: string, color: string) => void;
}) {
  const [pendingTeamCount, setPendingTeamCount] = useState(teams.length);

  return (
    <section className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-white">팀 관리</h2>
        <button
          className="h-10 rounded-xl bg-cyan-300 px-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
          type="button"
          onClick={onAddTeam}
        >
          팀 추가
        </button>
      </div>

      <div className="mb-3 grid grid-cols-[1fr_auto] items-end gap-2 rounded-xl bg-slate-950/45 p-3">
        <label className="block">
          <span className="mb-1 block text-xs font-black uppercase tracking-[0.14em] text-slate-300">
            Total Teams
          </span>
          <input
            className="h-10 w-full rounded-lg border border-white/15 bg-white px-3 text-base font-black text-slate-950 outline-none focus:border-cyan-300"
            type="number"
            min={0}
            max={40}
            value={pendingTeamCount}
            onChange={(event) => setPendingTeamCount(Number(event.target.value))}
          />
        </label>
        <button
          className="h-10 rounded-lg bg-amber-300 px-4 text-sm font-black text-slate-950 transition hover:bg-amber-200"
          type="button"
          onClick={() => onSetTeamCount(pendingTeamCount)}
        >
          적용
        </button>
      </div>

      <div className="space-y-2">
        {teams.map((team) => (
          <div key={team.id} className="grid grid-cols-[44px_1fr_auto] items-center gap-2 rounded-xl bg-slate-950/45 p-3">
            <input
              aria-label={`${team.name} color`}
              className="h-10 w-10 rounded-lg border border-white/20 bg-transparent"
              type="color"
              value={team.color}
              onChange={(event) => onUpdateTeamColor(team.id, event.target.value)}
            />
            <input
              className="h-10 min-w-0 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-black text-white outline-none focus:border-cyan-300"
              value={team.name}
              onChange={(event) => onUpdateTeamName(team.id, event.target.value)}
            />
            <button
              className="h-10 rounded-lg border border-rose-300/60 px-3 text-xs font-black text-rose-100 transition hover:bg-rose-500/20"
              type="button"
              onClick={() => onRemoveTeam(team)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScoreHistoryPanel({
  records,
  teams,
}: {
  records: ScoreRecord[];
  teams: ScoreboardTeam[];
}) {
  return (
    <section className="rounded-[28px] border border-white/14 bg-slate-900/88 p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
            Score History
          </p>
          <h2 className="text-2xl font-black text-white">점수 기록</h2>
        </div>
        <span className="rounded-full bg-white/[0.08] px-3 py-1 text-sm font-black text-slate-200">
          {records.length} records
        </span>
      </div>

      <div className="max-h-[430px] space-y-2 overflow-auto pr-1">
        {records.map((record) => (
          <article key={record.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl bg-white/[0.06] p-3">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: getTeamColor(record.teamId, teams) }}
                />
                <p className="truncate text-sm font-black text-white">
                  {record.activityTitle} · {getTeamName(record.teamId, teams)}
                </p>
              </div>
              {record.note && (
                <p className="mt-1 truncate text-sm font-semibold text-slate-300">{record.note}</p>
              )}
              <p className="mt-1 text-xs font-bold text-slate-400">{formatCreatedTime(record.createdAt)}</p>
            </div>
            <p className={`text-2xl font-black ${record.points >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
              {formatSignedScore(record.points)}
            </p>
          </article>
        ))}

        {records.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm font-bold text-slate-300">
            아직 점수 기록이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

function RevealPanel({
  entries,
  revealStep,
  isViewOnlyMode,
  onRevealStepChange,
  onResetReveal,
}: {
  entries: LeaderboardEntry[];
  revealStep: number;
  isViewOnlyMode: boolean;
  onRevealStepChange: (step: number) => void;
  onResetReveal: () => void;
}) {
  const visibleTeamIds = getVisibleRevealEntries(entries, revealStep);

  return (
    <section className="rounded-[28px] border border-white/14 bg-slate-900/88 p-5 shadow-2xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-fuchsia-200">
            Ranking Reveal
          </p>
          <h2 className="mt-1 text-3xl font-black text-white">{getRevealStepTitle(revealStep)}</h2>
          <p className="mt-1 text-sm font-bold text-slate-300">
            공동 순위는 함께 공개됩니다. 숨김 카드는 점수와 순위를 표시하지 않습니다.
          </p>
        </div>

        {!isViewOnlyMode && (
          <div className="flex flex-wrap gap-2">
            <button
              className="h-11 rounded-xl border border-white/18 px-4 text-sm font-black text-white transition hover:bg-white/10 disabled:opacity-40"
              type="button"
              disabled={revealStep <= 0}
              onClick={() => onRevealStepChange(revealStep - 1)}
            >
              이전
            </button>
            <button
              className="h-11 rounded-xl bg-fuchsia-300 px-4 text-sm font-black text-slate-950 transition hover:bg-fuchsia-200 disabled:bg-slate-600 disabled:text-slate-300"
              type="button"
              disabled={revealStep >= MAX_REVEAL_STEP}
              onClick={() => onRevealStepChange(revealStep + 1)}
            >
              다음
            </button>
            <button
              className="h-11 rounded-xl border border-white/18 px-4 text-sm font-black text-white transition hover:bg-white/10"
              type="button"
              onClick={onResetReveal}
            >
              리셋
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => {
          const isVisible = visibleTeamIds.has(entry.team.id);
          const isChampionReveal = revealStep === 4 && entry.rank === 1;

          return (
            <article
              key={entry.team.id}
              className={`min-h-[176px] rounded-2xl border p-5 ${
                isVisible
                  ? isChampionReveal
                    ? "border-amber-200 bg-amber-200/18 shadow-[0_0_36px_rgba(251,191,36,0.24)]"
                    : "border-cyan-200/70 bg-cyan-200/10"
                  : "border-white/10 bg-slate-950/70"
              }`}
            >
              {isVisible ? (
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-950">
                      {entry.rank}위
                    </span>
                    <span
                      className="h-5 w-5 rounded-full border border-white/70"
                      style={{ backgroundColor: entry.team.color }}
                    />
                  </div>
                  <div>
                    <h3 className="truncate text-3xl font-black text-white">{entry.team.name}</h3>
                    <p className="mt-2 text-5xl font-black text-amber-100">{entry.totalScore}</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/18 bg-white/[0.06] text-2xl font-black text-slate-300">
                    ?
                  </div>
                  <p className="text-xl font-black text-white">LOCKED</p>
                  <p className="mt-2 text-sm font-bold text-slate-400">결과 공개 대기</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ScoreboardPage() {
  const teams = useScoreboardStore((state) => state.teams);
  const scoreRecords = useScoreboardStore((state) => state.scoreRecords);
  const activityTitle = useScoreboardStore((state) => state.activityTitle);
  const isViewOnlyMode = useScoreboardStore((state) => state.isViewOnlyMode);
  const revealStep = useScoreboardStore((state) => state.revealStep);
  const addScoreRecord = useScoreboardStore((state) => state.addScoreRecord);
  const addTeam = useScoreboardStore((state) => state.addTeam);
  const removeTeam = useScoreboardStore((state) => state.removeTeam);
  const setTeamCount = useScoreboardStore((state) => state.setTeamCount);
  const updateTeamName = useScoreboardStore((state) => state.updateTeamName);
  const updateTeamColor = useScoreboardStore((state) => state.updateTeamColor);
  const setActivityTitle = useScoreboardStore((state) => state.setActivityTitle);
  const toggleViewOnlyMode = useScoreboardStore((state) => state.toggleViewOnlyMode);
  const setRevealStep = useScoreboardStore((state) => state.setRevealStep);
  const resetReveal = useScoreboardStore((state) => state.resetReveal);
  const clearScoreboardData = useScoreboardStore((state) => state.clearScoreboardData);
  const leaderboardEntries = useMemo(() => getLeaderboardEntries(teams, scoreRecords), [teams, scoreRecords]);

  function handleRemoveTeam(team: ScoreboardTeam) {
    const confirmed = window.confirm(
      `${team.name} 팀을 삭제할까요?\n\n이 팀의 모든 점수 기록도 함께 삭제됩니다.`,
    );

    if (confirmed) {
      removeTeam(team.id);
    }
  }

  function handleSetTeamCount(count: number) {
    if (count < teams.length) {
      const confirmed = window.confirm(
        `팀 수를 ${teams.length}팀에서 ${count}팀으로 줄일까요?\n\n제외되는 팀의 점수 기록도 함께 삭제됩니다.`,
      );

      if (!confirmed) {
        return;
      }
    }

    setTeamCount(count);
  }

  function handleClearData() {
    const confirmed = window.confirm("점수판 데이터를 모두 초기화할까요? 이 작업은 되돌릴 수 없습니다.");

    if (confirmed) {
      clearScoreboardData();
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080c18] p-6 text-white">
      <div className="mx-auto grid max-w-[1720px] gap-6 xl:grid-cols-[1fr_470px]">
        <div className="min-w-0 space-y-6">
          <LeaderboardPanel entries={leaderboardEntries} />
          <RevealPanel
            entries={leaderboardEntries}
            revealStep={revealStep}
            isViewOnlyMode={isViewOnlyMode}
            onRevealStepChange={setRevealStep}
            onResetReveal={resetReveal}
          />
          <ScoreHistoryPanel records={scoreRecords} teams={teams} />
        </div>

        <aside className="flex max-h-none w-full flex-col gap-4 overflow-visible rounded-[28px] border border-white/14 bg-slate-900/88 p-5 shadow-2xl xl:max-h-[calc(100vh-48px)] xl:overflow-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-cyan-300 p-4 text-slate-950">
              <p className="text-xs font-black uppercase tracking-[0.18em]">Teams</p>
              <p className="text-4xl font-black">{teams.length}</p>
            </div>
            <button
              className={`rounded-2xl border p-4 text-left transition ${
                isViewOnlyMode
                  ? "border-amber-200 bg-amber-300 text-slate-950"
                  : "border-white/12 bg-white/[0.07] text-white hover:bg-white/[0.1]"
              }`}
              type="button"
              onClick={toggleViewOnlyMode}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em]">Mode</p>
              <p className="mt-1 text-2xl font-black">{isViewOnlyMode ? "View Only" : "Admin"}</p>
            </button>
          </div>

          {!isViewOnlyMode && (
            <>
              <ScoreEntryPanel
                teams={teams}
                activityTitle={activityTitle}
                onSubmit={(input) =>
                  addScoreRecord({
                    ...input,
                    activityTitle,
                  })
                }
                onActivityTitleChange={setActivityTitle}
              />
              <TeamManagementPanel
                key={teams.length}
                teams={teams}
                onAddTeam={addTeam}
                onRemoveTeam={handleRemoveTeam}
                onSetTeamCount={handleSetTeamCount}
                onUpdateTeamName={updateTeamName}
                onUpdateTeamColor={updateTeamColor}
              />
              <button
                className="h-12 rounded-2xl border border-rose-300/60 bg-rose-500/18 text-base font-black text-rose-100 transition hover:bg-rose-500/28"
                type="button"
                onClick={handleClearData}
              >
                점수판 초기화
              </button>
            </>
          )}

          {isViewOnlyMode && (
            <section className="rounded-2xl border border-white/12 bg-white/[0.07] p-4">
              <p className="text-lg font-black text-white">보기 전용 모드</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-300">
                운영 입력과 공개 컨트롤을 숨기고, 리더보드와 기록 및 현재 공개 화면만 표시합니다.
              </p>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
