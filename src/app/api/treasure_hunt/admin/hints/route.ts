import { getAdminHints, replaceAdminHints, resetAdminHints } from "@/src/lib/treasure-hunt/treasureData";
import { hasTreasureAdminSession } from "@/src/lib/treasure-hunt/treasureAuth";
import type { TreasureHint } from "@/src/lib/treasure-hunt/treasureTypes";

async function guardAdmin() {
  if (await hasTreasureAdminSession()) {
    return null;
  }

  return Response.json({ ok: false, message: "UNAUTHORIZED" }, { status: 401 });
}

export async function GET() {
  const blocked = await guardAdmin();
  if (blocked) {
    return blocked;
  }

  return Response.json({ ok: true, hints: getAdminHints() });
}

export async function PUT(request: Request) {
  const blocked = await guardAdmin();
  if (blocked) {
    return blocked;
  }

  try {
    const body = (await request.json()) as { hints?: unknown };

    if (!Array.isArray(body.hints)) {
      return Response.json({ ok: false, message: "HINTS REQUIRED" }, { status: 400 });
    }

    return Response.json({ ok: true, hints: replaceAdminHints(body.hints as TreasureHint[]) });
  } catch {
    return Response.json({ ok: false, message: "INVALID REQUEST" }, { status: 400 });
  }
}

export async function DELETE() {
  const blocked = await guardAdmin();
  if (blocked) {
    return blocked;
  }

  return Response.json({ ok: true, hints: resetAdminHints() });
}
