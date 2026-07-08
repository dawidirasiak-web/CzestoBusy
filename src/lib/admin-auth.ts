import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "czestobusy_admin";
export const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters");
  if (process.env.NODE_ENV === "production" && value.includes("change-this")) throw new Error("ADMIN_SESSION_SECRET must be changed in production");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");
  if (process.env.NODE_ENV === "production" && (expected.length < 8 || expected.includes("change-this"))) throw new Error("ADMIN_PASSWORD must be changed in production");
  const suppliedBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  const expected = sign(expiresAt);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export async function isAdminAuthenticated() {
  return verifyAdminSessionToken((await cookies()).get(ADMIN_COOKIE)?.value);
}
