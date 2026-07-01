"use client";

import { useMemo } from "react";
import { BOARD_HEIGHT, BOARD_WIDTH, generateBoardCells, getFinishCellIndex } from "@/src/lib/board";
import { getPawnTarget } from "@/src/lib/movement";
import { useGameStore } from "@/src/stores/gameStore";
import { Cell } from "@/src/components/Cell";
import { DiceResultOverlay } from "@/src/components/DiceResultOverlay";
import { FinishRankingPanel } from "@/src/components/FinishRankingPanel";
import { Pawn } from "@/src/components/Pawn";

export function Board() {
  const teams = useGameStore((state) => state.teams);
  const lastDiceResults = useGameStore((state) => state.lastDiceResults);
  const burstMultiplier = useGameStore((state) => state.burstMultiplier);
  const isBurstActive = useGameStore((state) => state.isBurstActive);
  const isDiceOverlayVisible = useGameStore((state) => state.isDiceOverlayVisible);
  const round = useGameStore((state) => state.round);
  const miniGames = useGameStore((state) => state.miniGames);
  const selectedMiniGameId = useGameStore((state) => state.selectedMiniGameId);
  const boardCellCount = useGameStore((state) => state.boardCellCount);
  const boardShape = useGameStore((state) => state.boardShape);
  const boardCells = useMemo(
    () =>
      generateBoardCells({
        cellCount: boardCellCount,
        shape: boardShape,
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
      }),
    [boardCellCount, boardShape],
  );
  const finishIndex = getFinishCellIndex(boardCellCount);
  const selectedMiniGame = miniGames.find((miniGame) => miniGame.id === selectedMiniGameId);
  const cellSize = boardCellCount > 32 ? 58 : boardCellCount > 24 ? 68 : 84;
  const pathPoints = boardCells.map((cell) => `${cell.x},${cell.y}`).join(" ");

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
            aria-label={`${boardCellCount}칸 ${boardShape} 보드`}
          >
            <defs>
              <linearGradient id="boardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>
            <polyline
              points={`${pathPoints} ${boardCells[0]?.x ?? 0},${boardCells[0]?.y ?? 0}`}
              fill="none"
              stroke="url(#boardGlow)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
              opacity="0.24"
            />
            <polyline
              points={`${pathPoints} ${boardCells[0]?.x ?? 0},${boardCells[0]?.y ?? 0}`}
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
            <Cell key={cell.index} cell={cell} finishIndex={finishIndex} cellSize={cellSize} />
          ))}

          {teams.map((team) => {
            const target = getPawnTarget(team, teams, boardCells);

            return <Pawn key={team.id} team={team} x={target.x} y={target.y} />;
          })}
        </div>
        <FinishRankingPanel />
        <DiceResultOverlay
          round={round}
          teams={teams}
          selectedMiniGameName={selectedMiniGame?.name ?? "미니게임 미선택"}
          lastDiceResults={lastDiceResults}
          burstMultiplier={burstMultiplier}
          isBurstActive={isBurstActive}
          visible={isDiceOverlayVisible}
        />
      </div>
    </section>
  );
}
