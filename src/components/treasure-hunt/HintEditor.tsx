"use client";

import type { TreasureHint, TreasureHintType } from "@/src/lib/treasure-hunt/treasureTypes";

type HintEditorProps = {
  hint: TreasureHint;
  onChange: (hint: TreasureHint) => void;
};

const hintTypes: TreasureHintType[] = ["score", "location", "special", "fragment", "system"];

export function HintEditor({ hint, onChange }: HintEditorProps) {
  return (
    <article className="border border-emerald-400/20 bg-black/65 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black text-cyan-100">HINT #{String(hint.id).padStart(2, "0")}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <label className="flex min-h-8 items-center gap-2 border border-emerald-500/25 px-2">
            <input
              type="checkbox"
              checked={hint.isActive}
              onChange={(event) => onChange({ ...hint, isActive: event.target.checked })}
            />
            active
          </label>
          <label className="flex min-h-8 items-center gap-2 border border-orange-400/30 px-2 text-orange-200">
            <input
              type="checkbox"
              checked={hint.isFalseHint}
              onChange={(event) => onChange({ ...hint, isFalseHint: event.target.checked })}
            />
            false
          </label>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[9rem_11rem_1fr]">
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-emerald-500/80">code</span>
          <input
            value={hint.code}
            onChange={(event) => onChange({ ...hint, code: event.target.value.toUpperCase() })}
            className="h-11 w-full border border-emerald-400/25 bg-black px-3 text-base uppercase tracking-[0.14em] text-emerald-100 outline-none focus:border-cyan-200"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase text-emerald-500/80">type</span>
          <select
            value={hint.type}
            onChange={(event) => onChange({ ...hint, type: event.target.value as TreasureHintType })}
            className="h-11 w-full border border-emerald-400/25 bg-black px-3 text-base text-emerald-100 outline-none focus:border-cyan-200"
          >
            {hintTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-xs uppercase text-emerald-500/80">hint</span>
          <textarea
            value={hint.content}
            onChange={(event) => onChange({ ...hint, content: event.target.value })}
            className="min-h-24 w-full resize-y border border-emerald-400/25 bg-black px-3 py-2 text-base leading-6 text-emerald-100 outline-none focus:border-cyan-200"
            dir="auto"
          />
        </label>
      </div>
    </article>
  );
}
