import { findActiveHintByCode } from "@/src/lib/treasure-hunt/treasureData";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: unknown };
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";

    if (!code) {
      return Response.json({ ok: false, message: "CODE REQUIRED" }, { status: 400 });
    }

    const result = findActiveHintByCode(code);

    if (!result) {
      return Response.json({ ok: false, message: "INVALID CODE" }, { status: 404 });
    }

    return Response.json({ ok: true, hint: result.hint });
  } catch {
    return Response.json({ ok: false, message: "INVALID REQUEST" }, { status: 400 });
  }
}
