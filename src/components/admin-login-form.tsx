"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) { setError(result.error || "Nie udało się zalogować."); setPending(false); return; }
    router.replace("/admin");
    router.refresh();
  }

  return <form className="admin-login-form" onSubmit={submit}><label>Hasło administratora<input autoFocus name="password" type="password" autoComplete="current-password" required/></label>{error && <p role="alert">{error}</p>}<button disabled={pending} type="submit">{pending ? "Logowanie..." : "Zaloguj się"}</button></form>;
}
