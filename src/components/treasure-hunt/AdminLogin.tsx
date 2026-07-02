"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/treasure_hunt/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setMessage("[ACCESS DENIED] 비밀번호를 확인하십시오.");
        return;
      }

      window.location.reload();
    } catch {
      setMessage("[NETWORK ERROR] 다시 시도하십시오.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#050606] px-4 py-8 font-mono text-emerald-100">
      <section className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-md flex-col justify-center">
        <div className="border border-emerald-400/30 bg-black/80 p-5 shadow-[0_0_36px_rgba(16,185,129,0.16)]">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">restricted node</p>
          <h1 className="mt-3 text-2xl font-black tracking-normal text-emerald-50">
            TREASURE ADMIN
          </h1>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm text-emerald-400/80">&gt; password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-14 w-full border border-emerald-400/35 bg-black px-4 text-lg text-cyan-100 outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300/30"
                autoComplete="current-password"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-14 w-full border border-cyan-300/50 bg-cyan-300/10 px-5 font-black uppercase tracking-[0.16em] text-cyan-100 disabled:cursor-not-allowed disabled:text-emerald-700"
            >
              {isSubmitting ? "VERIFYING" : "LOGIN"}
            </button>
          </form>
          {message ? <p className="mt-4 text-sm text-rose-300">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}
