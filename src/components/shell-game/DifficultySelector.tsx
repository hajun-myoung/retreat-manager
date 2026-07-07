"use client";

import type { Difficulty } from "@/src/components/shell-game/ShellGame";

type DifficultySelectorProps = {
  difficulty: Difficulty;
  disabled: boolean;
  onChange: (difficulty: Difficulty) => void;
};

const options: Array<{
  value: Difficulty;
  label: string;
  description: string;
}> = [
  { value: "easy", label: "Easy", description: "6컵 · 22회 · 빠름" },
  {
    value: "hard",
    label: "Hard",
    description: "8컵 · 30회 · 매우빠름",
  },
];

export function DifficultySelector({
  difficulty,
  disabled,
  onChange,
}: DifficultySelectorProps) {
  return (
    <div className="grid gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          className={`rounded-2xl border p-4 text-left transition ${
            difficulty === option.value
              ? "border-amber-300 bg-amber-300/18 text-white"
              : "border-white/12 bg-white/[0.06] text-slate-200 hover:bg-white/[0.1]"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          <p className="text-lg font-black">{option.label}</p>
          <p className="mt-1 text-sm font-bold text-slate-300">
            {option.description}
          </p>
        </button>
      ))}
    </div>
  );
}
