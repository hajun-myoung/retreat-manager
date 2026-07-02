import { clearTreasureAdminSession } from "@/src/lib/treasure-hunt/treasureAuth";

export async function POST() {
  await clearTreasureAdminSession();
  return Response.json({ ok: true });
}
