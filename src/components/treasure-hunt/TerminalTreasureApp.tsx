"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { HintOutput } from "./HintOutput";
import { TerminalInput } from "./TerminalInput";
import { TerminalLog } from "./TerminalLog";
import type {
  PublicTreasureHint,
  UnlockedTreasureHint,
} from "@/src/lib/treasure-hunt/treasureTypes";

type TerminalTreasureAppProps = {
  totalHints: number;
};

type LogLine = {
  id: string;
  text: string;
  tone?: "normal" | "success" | "error" | "warning" | "muted";
};

const STORAGE_KEY = "treasure-hunt-unlocked-hints";
const COPY_WARNING = "[WARNING] 복붙으로 알아내려고 한 당신, 참 치사하군요.";
const INITIAL_LOG_LINES: LogLine[] = [
  {
    id: "boot",
    text: "[BOOT] TREASURE_HINT_TERMINAL v1.2.1",
    tone: "success",
  },
  {
    id: "ready",
    text: "[READY] 획득한 코드를 입력하십시오.",
    tone: "muted",
  },
];

function logTreasureApp(message: string, detail?: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[treasure_hunt] ${message}`, detail ?? "");
  }
}

function createLogLine(text: string, tone?: LogLine["tone"]): LogLine {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    tone,
  };
}

function normalizeStoredHint(item: unknown): UnlockedTreasureHint | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const hint = item as Record<string, unknown>;
  const id = typeof hint.id === "number" ? hint.id : null;
  const code = typeof hint.code === "string" ? hint.code : null;
  const unlockedAt =
    typeof hint.unlockedAt === "string" ? hint.unlockedAt : null;
  const isFalseHint =
    typeof hint.isFalseHint === "boolean" ? hint.isFalseHint : false;

  if (id === null || !code || !unlockedAt) {
    return null;
  }

  if (hint.type === "image") {
    const imageSrc = typeof hint.imageSrc === "string" ? hint.imageSrc : null;
    const alt = typeof hint.alt === "string" ? hint.alt : null;

    if (!imageSrc || !alt) {
      return null;
    }

    return {
      id,
      code,
      unlockedAt,
      type: "image",
      imageSrc,
      alt,
      isFalseHint,
    };
  }

  const content = typeof hint.content === "string" ? hint.content : null;

  if (!content) {
    return null;
  }

  return {
    id,
    code,
    unlockedAt,
    type: hint.type === "system" ? "system" : "text",
    content,
    isFalseHint,
  };
}

function readStoredHints() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || "[]",
    ) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item) => {
      const hint = normalizeStoredHint(item);
      return hint ? [hint] : [];
    });
  } catch {
    return [];
  }
}

export function TerminalTreasureApp({ totalHints }: TerminalTreasureAppProps) {
  const [code, setCode] = useState("");
  const [unlockedHints, setUnlockedHints] = useState<UnlockedTreasureHint[]>(
    [],
  );
  const [logLines, setLogLines] = useState<LogLine[]>(INITIAL_LOG_LINES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedStoredHintsRef = useRef(false);

  const unlockedIds = useMemo(
    () => new Set(unlockedHints.map((hint) => hint.id)),
    [unlockedHints],
  );

  useEffect(() => {
    logTreasureApp("Mounted: TerminalTreasureApp");

    return () => logTreasureApp("Unmounted: TerminalTreasureApp");
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      hasLoadedStoredHintsRef.current = true;
      setUnlockedHints(readStoredHints());
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredHintsRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedHints));
  }, [unlockedHints]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [logLines, unlockedHints]);

  function appendLogs(nextLines: LogLine[]) {
    setLogLines((current) => [...current.slice(-42), ...nextLines]);
  }

  function warnCopyAttempt() {
    appendLogs([createLogLine(COPY_WARNING, "warning")]);
  }

  async function verifyCode() {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode || isSubmitting) {
      logTreasureApp("submit ignored: TerminalTreasureApp", {
        hasCode: Boolean(normalizedCode),
        isSubmitting,
      });
      return;
    }

    logTreasureApp("submit started: TerminalTreasureApp", {
      codeLength: normalizedCode.length,
    });
    setIsSubmitting(true);
    appendLogs([createLogLine(`> unlock --code ${normalizedCode}`, "normal")]);

    try {
      logTreasureApp("verify request started", {
        endpoint: "/api/treasure_hunt/verify",
      });
      const response = await fetch("/api/treasure_hunt/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode }),
      });
      logTreasureApp("verify request finished", {
        ok: response.ok,
        status: response.status,
      });
      const data = (await response.json()) as
        | { ok: true; hint: PublicTreasureHint }
        | { ok: false; message: string };

      if (!data.ok) {
        appendLogs([createLogLine("[ACCESS DENIED] INVALID CODE", "error")]);
        return;
      }

      if (unlockedIds.has(data.hint.id)) {
        appendLogs([
          createLogLine(
            `[SKIPPED] HINT #${String(data.hint.id).padStart(2, "0")} ALREADY UNLOCKED`,
            "warning",
          ),
        ]);
        return;
      }

      appendLogs([
        createLogLine(`[ACCESS GRANTED] CODE ${normalizedCode}`, "success"),
        createLogLine("[DECRYPTING...]", "muted"),
      ]);

      window.setTimeout(() => {
        setUnlockedHints((current) => [
          ...current,
          {
            ...data.hint,
            code: normalizedCode,
            unlockedAt: new Date().toISOString(),
          },
        ]);
        appendLogs([
          createLogLine(
            `[HINT #${String(data.hint.id).padStart(2, "0")} UNLOCKED]`,
            "success",
          ),
        ]);
      }, 360);
    } catch {
      logTreasureApp("verify request failed");
      appendLogs([createLogLine("[NETWORK ERROR] RETRY REQUIRED", "error")]);
    } finally {
      setCode("");
      setIsSubmitting(false);
      logTreasureApp("submit finished: TerminalTreasureApp");
    }
  }

  return (
    <main
      className="relative min-h-dvh overflow-x-hidden bg-[#020403] font-mono text-emerald-100"
      onContextMenu={(event) => {
        event.preventDefault();
        warnCopyAttempt();
      }}
      onCopy={(event) => {
        event.preventDefault();
        warnCopyAttempt();
      }}
      onKeyDown={(event) => {
        if (
          (event.metaKey || event.ctrlKey) &&
          event.key.toLowerCase() === "c"
        ) {
          event.preventDefault();
          warnCopyAttempt();
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.055)_1px,transparent_1px)] bg-[length:100%_4px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(45,212,191,0.14),transparent_32rem),radial-gradient(circle_at_80%_85%,rgba(245,158,11,0.10),transparent_28rem)]" />
      <section className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-8">
        <header className="border-b border-emerald-400/25 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="break-words text-lg font-black tracking-[0.12em] text-cyan-100 sm:text-2xl">
                TREASURE_HINT_TERMINAL v1.0
                <span className="ml-1 animate-pulse text-amber-300">_</span>
              </p>
              <p className="mt-2 text-sm text-emerald-400/80">
                획득한 코드를 입력하십시오.
              </p>
            </div>
            <p className="w-fit border border-emerald-400/25 bg-black/60 px-3 py-2 text-sm text-amber-200">
              UNLOCKED: {unlockedHints.length} / {totalHints}
            </p>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-5 py-5 lg:grid-cols-[1fr_0.85fr]">
          <section className="min-h-[44dvh] border border-emerald-400/25 bg-black/72 p-4 shadow-[0_0_36px_rgba(16,185,129,0.14)] sm:p-5">
            <TerminalLog lines={logLines} />
            <div ref={logEndRef} />
          </section>
          <section className="min-h-[34dvh] border border-cyan-400/20 bg-black/65 p-4 shadow-[0_0_36px_rgba(34,211,238,0.10)] sm:p-5">
            <HintOutput hints={unlockedHints} />
          </section>
        </div>

        <div className="sticky bottom-0 border-t border-emerald-400/25 bg-[#020403]/95 py-4 backdrop-blur">
          <TerminalInput
            code={code}
            isSubmitting={isSubmitting}
            onCodeChange={setCode}
            onSubmit={verifyCode}
          />
        </div>
      </section>
    </main>
  );
}
