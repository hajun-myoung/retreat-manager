type TerminalLogProps = {
  lines: {
    id: string;
    text: string;
    tone?: "normal" | "success" | "error" | "warning" | "muted";
  }[];
};

const toneClassName = {
  normal: "text-emerald-200",
  success: "text-cyan-200",
  error: "text-rose-300",
  warning: "text-amber-300",
  muted: "text-emerald-500/75",
};

export function TerminalLog({ lines }: TerminalLogProps) {
  return (
    <div className="space-y-1.5 text-sm leading-6 sm:text-base">
      {lines.map((line) => (
        <p
          key={line.id}
          className={`break-words ${toneClassName[line.tone ?? "normal"]}`}
          dir="auto"
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}
