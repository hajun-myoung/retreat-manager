import type { FormEvent, MouseEvent } from "react";

type TerminalInputProps = {
  code: string;
  isSubmitting: boolean;
  onCodeChange: (code: string) => void;
  onSubmit: () => void | Promise<void>;
};

export function TerminalInput({
  code,
  isSubmitting,
  onCodeChange,
  onSubmit,
}: TerminalInputProps) {
  function handleSubmit(
    event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) {
    event?.preventDefault();
    event?.stopPropagation();

    void onSubmit();
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
      noValidate
    >
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
          onSubmit={(e) => {
            e.preventDefault();
          }}
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-14 border border-cyan-300/50 bg-cyan-300/10 px-6 font-mono text-base font-black uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.16)] transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:border-emerald-800 disabled:text-emerald-700"
      >
        {isSubmitting ? "VERIFYING" : "EXECUTE"}
      </button>
    </form>
  );
}
