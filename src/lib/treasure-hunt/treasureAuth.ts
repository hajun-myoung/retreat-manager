import "server-only";

import { createHash } from "node:crypto";

import { cookies } from "next/headers";

export const TREASURE_ADMIN_COOKIE = "treasure-hunt-admin";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin0726";
}

function getCookieValue() {
  return createHash("sha256")
    .update(`poly-party:${getAdminPassword()}:treasure-hunt`)
    .digest("hex");
}

export function isValidAdminPassword(password: string) {
  return password === getAdminPassword();
}

export async function hasTreasureAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get(TREASURE_ADMIN_COOKIE)?.value === getCookieValue();
}

export async function setTreasureAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(TREASURE_ADMIN_COOKIE, getCookieValue(), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearTreasureAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(TREASURE_ADMIN_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
