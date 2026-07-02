import type { Metadata } from "next";

import { AdminLogin } from "@/src/components/treasure-hunt/AdminLogin";
import { TreasureAdminPanel } from "@/src/components/treasure-hunt/TreasureAdminPanel";
import { getAdminHints } from "@/src/lib/treasure-hunt/treasureData";
import { hasTreasureAdminSession } from "@/src/lib/treasure-hunt/treasureAuth";

export const metadata: Metadata = {
  title: "TREASURE ADMIN",
  description: "보물찾기 힌트 관리자 콘솔",
};

export default async function TreasureHuntAdminPage() {
  const isAuthed = await hasTreasureAdminSession();

  if (!isAuthed) {
    return <AdminLogin />;
  }

  return <TreasureAdminPanel initialHints={getAdminHints()} />;
}
