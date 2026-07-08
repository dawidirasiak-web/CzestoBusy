import { ADMIN_COOKIE, createAdminSessionToken, SESSION_DURATION_SECONDS, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const maxAttempts = 8;
const windowMs = 15 * 60 * 1000;

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function registerFailedAttempt(key: string) {
  const now = Date.now();
  const current = failedAttempts.get(key);
  if (!current || current.resetAt <= now) {
    failedAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  failedAttempts.set(key, { count: current.count + 1, resetAt: current.resetAt });
}

function isRateLimited(key: string) {
  const current = failedAttempts.get(key);
  if (!current) return false;
  if (current.resetAt <= Date.now()) {
    failedAttempts.delete(key);
    return false;
  }
  return current.count >= maxAttempts;
}

export async function POST(request: Request) {
  const key = clientKey(request);
  if (isRateLimited(key)) {
    return Response.json({ error: "Zbyt wiele prób logowania. Spróbuj ponownie za kilka minut." }, { status: 429 });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Nieprawidłowe dane logowania." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    registerFailedAttempt(key);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return Response.json({ error: "Nieprawidłowe hasło." }, { status: 401 });
  }

  failedAttempts.delete(key);
  const response = Response.json({ success: true });
  response.headers.append("Set-Cookie", `${ADMIN_COOKIE}=${createAdminSessionToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  return response;
}
