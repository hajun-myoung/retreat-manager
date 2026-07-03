import type { UnlockedTreasureHint } from "@/src/lib/treasure-hunt/treasureTypes";

type HintOutputProps = {
  hints: UnlockedTreasureHint[];
};

const typeLabel = {
  score: "SCORE",
  location: "LOCATION",
  special: "SPECIAL",
  fragment: "FRAGMENT",
  system: "SYSTEM",
};

export function HintOutput({ hints }: HintOutputProps) {
  if (hints.length === 0) {
    return (
      <div className="select-none border-t border-emerald-400/20 pt-4 text-sm text-emerald-500/80">
        [NO_UNLOCKED_HINTS] 대기 중...
      </div>
    );
  }

  return (
    <div className="select-none space-y-3 border-t border-emerald-400/20 pt-4">
      {hints.map((hint) => (
        <article
          key={hint.id}
          className={`border-l-2 py-1 pl-3 ${
            hint.isFalseHint
              ? "border-orange-300 text-orange-300"
              : "border-cyan-300 text-emerald-100"
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase text-emerald-500/80">
            <span>[HINT #{String(hint.id).padStart(2, "0")}]</span>
            <span>{typeLabel[hint.type]}</span>
            {/* {hint.isFalseHint ? <span className="text-orange-300">FALSE_SIGNAL</span> : null} */}
          </div>
          <p
            className="mt-1 whitespace-pre-wrap break-words text-base leading-7"
            dir="auto"
          >
            {hint.content}
          </p>
        </article>
      ))}
    </div>
  );
}
