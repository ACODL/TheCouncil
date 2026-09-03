"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MemberAdmin({ profiles, goals, userId, onChange }) {
    const [supabase] = useState(() => createClient());
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(null);
    const [error, setError] = useState("");

    const goalCount = (id) => goals.filter((g) => g.profile_id === id).length;

    async function mergeIntoMe(dupeId) {
        setError(""); setBusy(dupeId);
        const { error: e } = await supabase.rpc("merge_profile", { dupe: dupeId, keep: userId });
        setBusy(null);
        if (e) return setError(e.message);
        onChange();
    }

    async function removeProfile(id) {
        setError(""); setBusy(id);
        const { error: e } = await supabase.from("profiles").delete().eq("id", id);
        setBusy(null);
        if (e) return setError("Couldn't remove — that member still has goals.");
        onChange();
    }

    if (profiles.length < 2) return null;

    return (
        <div className="mt-12 border-t border-faint pt-4">
            <button
                onClick={() => setOpen((o) => !o)}
                className="font-mono text-[11px] uppercase tracking-wide text-mid hover:text-ink"
            >
                {open ? "Hide" : "Manage members"}
            </button>

            {open && (
                <div className="mt-4 space-y-3">
                    <p className="text-xs text-mid">
                        Signed in twice by accident? Merge the duplicate into the account
                        you&apos;re using now, or remove it if it has no goals.
                    </p>

                    {profiles.map((p) => {
                        const mine = p.id === userId;
                        const n = goalCount(p.id);
                        return (
                            <div key={p.id} className="flex items-center justify-between gap-3 text-sm">
                                <span>
                                    {p.display_name}
                                    {mine && <span className="ml-1.5 text-xs text-mid">you</span>}
                                    <span className="ml-2 font-mono text-[11px] text-mid">
                                        {n} goal{n === 1 ? "" : "s"}
                                    </span>
                                </span>

                                {!mine && (
                                    <span className="flex gap-3">
                                        <button
                                            onClick={() => mergeIntoMe(p.id)}
                                            disabled={busy === p.id}
                                            className="text-xs text-mid hover:text-ink disabled:opacity-40"
                                        >
                                            {busy === p.id ? "…" : "merge into me"}
                                        </button>
                                        {n === 0 && (
                                            <button
                                                onClick={() => removeProfile(p.id)}
                                                disabled={busy === p.id}
                                                className="text-xs text-mid hover:text-ink disabled:opacity-40"
                                            >
                                                remove
                                            </button>
                                        )}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {error && <p className="text-xs text-mid">{error}</p>}
                </div>
            )}
        </div>
    );
}