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

    try {
      const password = String(new FormData(event.currentTarget).get("password") || "");
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Nie uda\u0142o si\u0119 zalogowa\u0107.");
        setPending(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Nie uda\u0142o si\u0119 po\u0142\u0105czy\u0107 z panelem. Spr\u00f3buj ponownie.");
      setPending(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label>
        {"Has\u0142o administratora"}
        <input autoFocus name="password" type="password" autoComplete="current-password" required />
      </label>
      {error && <p role="alert">{error}</p>}
      <button disabled={pending} type="submit">{pending ? "Logowanie..." : "Zaloguj si\u0119"}</button>
    </form>
  );
}
