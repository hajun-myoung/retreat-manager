import { isValidAdminPassword, setTreasureAdminSession } from "@/src/lib/treasure-hunt/treasureAuth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: unknown };
    const password = typeof body.password === "string" ? body.password : "";

    if (!isValidAdminPassword(password)) {
      return Response.json({ ok: false, message: "INVALID PASSWORD" }, { status: 401 });
    }

    await setTreasureAdminSession();

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, message: "INVALID REQUEST" }, { status: 400 });
  }
}
