"use client";

import { motion } from "motion/react";
import type {
  LadderAssignment,
  LadderConfig,
  LadderDestination,
  LadderParticipant,
} from "@/src/types/ladder";

type LadderBoardProps = {
  assignments: LadderAssignment[];
  config: LadderConfig;
  destinations: LadderDestination[];
  participants: LadderParticipant[];
  activeParticipantId: string | null;
  revealedParticipantIds: string[];
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 620;
const TOP_Y = 70;
const LADDER_HEIGHT = 460;
const LEFT_X = 70;
const RIGHT_X = 930;

function getColumnX(column: number, columnCount: number) {
  const step = (RIGHT_X - LEFT_X) / Math.max(1, columnCount - 1);

  return LEFT_X + column * step;
}

function getRungY(row: number, rowCount: number) {
  const step = LADDER_HEIGHT / Math.max(1, rowCount + 1);

  return TOP_Y + (row + 1) * step;
}

function getAssignmentPath(assignment: LadderAssignment) {
  return assignment.path
    .map((point) => `${LEFT_X + point.x * ((RIGHT_X - LEFT_X) / 1000)},${TOP_Y + point.y * (LADDER_HEIGHT / 620)}`)
    .join(" ");
}

export function LadderBoard({
  assignments,
  config,
  destinations,
  participants,
  activeParticipantId,
  revealedParticipantIds,
}: LadderBoardProps) {
  const activeAssignment = assignments.find(
    (assignment) => assignment.participantId === activeParticipantId,
  );

  return (
    <div className="min-h-0 rounded-[28px] border border-white/14 bg-[#111a30] p-4 shadow-2xl">
      <svg
        className="h-full min-h-[420px] w-full"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="사다리 게임 보드"
      >
        <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} rx="28" fill="#111827" />
        <g>
          {participants.map((participant, index) => {
            const x = getColumnX(index, config.columnCount);
            const isActive = activeParticipantId === participant.id;

            return (
              <g key={participant.id}>
                <text
                  x={x}
                  y="34"
                  textAnchor="middle"
                  className={`fill-white text-[22px] font-black ${isActive ? "fill-amber-200" : ""}`}
                >
                  {participant.name}
                </text>
                <line
                  x1={x}
                  x2={x}
                  y1={TOP_Y}
                  y2={TOP_Y + LADDER_HEIGHT}
                  stroke={isActive ? "#facc15" : "#cbd5e1"}
                  strokeWidth={isActive ? 8 : 4}
                  strokeLinecap="round"
                  opacity={isActive ? 0.95 : 0.58}
                />
              </g>
            );
          })}
        </g>

        <g>
          {config.rungs.map((rung) => {
            const y = getRungY(rung.row, config.rowCount);
            const x1 = getColumnX(rung.leftColumn, config.columnCount);
            const x2 = getColumnX(rung.leftColumn + 1, config.columnCount);

            return (
              <line
                key={rung.id}
                x1={x1}
                x2={x2}
                y1={y}
                y2={y}
                stroke="#38bdf8"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.72"
              />
            );
          })}
        </g>

        {activeAssignment && (
          <motion.polyline
            key={`${activeAssignment.participantId}-${revealedParticipantIds.length}`}
            points={getAssignmentPath(activeAssignment)}
            fill="none"
            stroke="#facc15"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        )}

        <g>
          {destinations.map((destination, index) => {
            const x = getColumnX(index, config.columnCount);
            const assignment = assignments.find(
              (item) =>
                item.endColumn === index &&
                revealedParticipantIds.includes(item.participantId),
            );
            const participant = participants.find(
              (item) => item.id === assignment?.participantId,
            );

            return (
              <g key={destination.id}>
                <rect
                  x={x - 74}
                  y={TOP_Y + LADDER_HEIGHT + 30}
                  width="148"
                  height="58"
                  rx="14"
                  fill={assignment ? "#facc15" : "#1f2937"}
                  opacity={assignment ? 1 : 0.86}
                />
                <text
                  x={x}
                  y={TOP_Y + LADDER_HEIGHT + 56}
                  textAnchor="middle"
                  className={`text-[16px] font-black ${assignment ? "fill-slate-950" : "fill-slate-200"}`}
                >
                  {destination.label}
                </text>
                {participant && (
                  <text
                    x={x}
                    y={TOP_Y + LADDER_HEIGHT + 78}
                    textAnchor="middle"
                    className="fill-slate-950 text-[13px] font-black"
                  >
                    {participant.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
