"use client";

import { boardCells, BOARD_HEIGHT, BOARD_WIDTH } from "@/src/lib/board";
import { getPawnTarget } from "@/src/lib/movement";
import { useGameStore } from "@/src/stores/gameStore";
import { Cell } from "@/src/components/Cell";
import { Pawn } from "@/src/components/Pawn";

export function Board() {
  const teams = useGameStore((state) => state.teams);

  return (
    <section className="min-w-0 flex-1">
      <div className="relative mx-auto aspect-[1000/720] w-full max-w-[1120px] overflow-hidden rounded-[28px] border border-white/15 bg-[#18213a] shadow-2xl">
        <div
          className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2"
          style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
        >
          <svg
            className="absolute inset-0"
            viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
            role="img"
            aria-label="22칸 순환 보드"
          >
            <defs>
              <linearGradient id="boardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>
            <path
              d="M84 84 H916 V636 H84 V84 H360 L498 360 L360 360"
              fill="none"
              stroke="url(#boardGlow)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
              opacity="0.24"
            />
            <path
              d="M84 84 H916 V636 H84 V84 H360 L498 360 L360 360"
              fill="none"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              strokeDasharray="10 18"
              opacity="0.28"
            />
            <circle cx="500" cy="360" r="132" fill="#0f172a" opacity="0.54" />
            <text
              x="500"
              y="344"
              textAnchor="middle"
              className="fill-white text-[42px] font-black"
            >
              POLY PARTY
            </text>
            <text
              x="500"
              y="389"
              textAnchor="middle"
              className="fill-cyan-100 text-[18px] font-bold tracking-[0.35em]"
            >
              RETREAT OPENING GAME
            </text>
          </svg>

          {boardCells.map((cell) => (
            <Cell key={cell.index} cell={cell} />
          ))}

          {teams.map((team) => {
            const target = getPawnTarget(team, teams);

            return <Pawn key={team.id} team={team} x={target.x} y={target.y} />;
          })}
        </div>
      </div>
    </section>
  );
}

