import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

type TerminalInputProps = {
  code: string;
  isSubmitting: boolean;
  onCodeChange: (code: string) => void;
  onSubmit: () => void | Promise<void>;
};

function logTerminalInput(message: string, detail?: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[treasure_hunt] ${message}`, detail ?? "");
  }
}

export function TerminalInput({
  code,
  isSubmitting,
  onCodeChange,
  onSubmit,
}: TerminalInputProps) {
  const [isComposing, setIsComposing] = useState(false);
  const submitCountRef = useRef(0);

  useEffect(() => {
    logTerminalInput("Mounted: TerminalInput");

    return () => logTerminalInput("Unmounted: TerminalInput");
  }, []);

  function handleSubmit(event?: MouseEvent<HTMLButtonElement>) {
    console.log("1. handle submit called");
    event?.preventDefault();
    event?.stopPropagation();
    console.log("2. preventDefaul");

    submitCountRef.current += 1;
    logTerminalInput("submit started: TerminalInput", {
      codeLength: code.trim().length,
      submitCount: submitCountRef.current,
      source: event?.type ?? "keyboard",
    });
    console.log("3. loging");

    void onSubmit();
    console.log("4. onsubmit called");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.nativeEvent.isComposing || isComposing) {
      logTerminalInput("submit ignored: composing");
      return;
    }

    handleSubmit();
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="min-w-0 flex-1">
        <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-emerald-500/80">
          &gt; unlock --code
        </span>
        <input
          value={code}
          onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
          inputMode="text"
          enterKeyHint="go"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={12}
          placeholder="CODE"
          className="h-14 w-full min-w-0 border border-emerald-400/35 bg-black/80 px-4 font-mono text-lg uppercase tracking-[0.18em] text-cyan-100 caret-amber-300 outline-none shadow-[0_0_22px_rgba(16,185,129,0.14)] placeholder:text-emerald-700 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300/30"
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
        />
      </label>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="min-h-14 border border-cyan-300/50 bg-cyan-300/10 px-6 font-mono text-base font-black uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.16)] transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:border-emerald-800 disabled:text-emerald-700"
      >
        {isSubmitting ? "VERIFYING" : "EXECUTE"}
      </button>
    </div>
  );
}
