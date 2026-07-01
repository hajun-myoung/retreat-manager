"use client";

import { motion } from "motion/react";
import type { Team } from "@/src/types/game";

type PawnProps = {
  team: Team;
  x: number;
  y: number;
};

export function Pawn({ team, x, y }: PawnProps) {
  return (
    <motion.div
      className="absolute z-20 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white text-base font-black text-white shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
      animate={{ x: x - 22, y: y - 22, scale: team.hasFinished ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 115, damping: 18, mass: 0.9 }}
      style={{ backgroundColor: team.color }}
      title={team.name}
    >
      {team.name.replace("팀", "")}
    </motion.div>
  );
}

