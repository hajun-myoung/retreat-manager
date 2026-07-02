import type { Metadata } from "next";

import { TerminalTreasureApp } from "@/src/components/treasure-hunt/TerminalTreasureApp";
import { getTotalHintCount } from "@/src/lib/treasure-hunt/treasureData";

export const metadata: Metadata = {
  title: "TREASURE_HINT_TERMINAL",
  description: "수련회 보물찾기 힌트 해금 터미널",
};

export default function TreasureHuntPage() {
  return <TerminalTreasureApp totalHints={getTotalHintCount()} />;
}
