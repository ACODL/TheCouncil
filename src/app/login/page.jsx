"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/theme";

export default function LoginPage() {
    const [supabase] = useState(() => createClient());
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function signIn() {
        setError("");
        setBusy(true);
        const { error: e } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (e) {
            setError("Couldn't reach Google. Try again.");
            setBusy(false);
        }
    }

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#1A1F35]">
            <img
                src="/art/clearing.gif"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ imageRendering: "pixelated", objectPosition: "center 65%" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1223]/70 via-[#0F1223]/20 to-transparent" />

            <div className="relative flex min-h-screen items-end justify-center p-8 pb-16">
                <div className="w-full max-w-xs text-center">
                    <h1 className="text-2xl font-medium text-[#F2EDE4]">{copy.title}</h1>
                    <p className="mt-1 mb-6 text-sm text-[#F2EDE4]/65">
                        Let's get to work. Sign in with Google to continue.
                    </p>

                    <button
                        onClick={signIn}
                        disabled={busy}
                        className="flex w-full items-center justify-center gap-3 rounded border border-[#F2EDE4]/25 bg-[#F2EDE4]/10 px-4 py-2.5 text-sm text-[#F2EDE4] backdrop-blur-sm transition hover:bg-[#F2EDE4]/20 disabled:opacity-40"
                    >
                        <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
                            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
                            <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
                            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
                        </svg>
                        {busy ? "Redirecting…" : "Continue with Google"}
                    </button>

                    {error && <p className="mt-3 text-xs text-[#F2EDE4]/70">{error}</p>}
                </div>
            </div>
        </main>
    );
}