"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatMeetingShort } from "@/lib/dates";
import { copy } from "@/lib/theme";
import { Label } from "./layout/Shell";

export default function ClimbView({ profiles, meetings }) {
    const [goals, setGoals] = useState(null);

    useEffect(() => {
        (async () => {
            const supabase = createClient();
            const { data } = await supabase.from("goals").select("*");
            setGoals(data ?? []);
        })();
    }, []);

    if (!goals) return <p className="mt-8 text-sm text-mid">Loading…</p>;

    const cycles = [...meetings].sort((a, b) => new Date(a.meets_at) - new Date(b.meets_at));
    const used = cycles.filter((m) => goals.some((g) => g.meeting_id === m.id));

    if (used.length === 0) {
        return <p className="mt-8 text-sm text-mid">No history yet.</p>;
    }

    return (
        <div className="mt-8">
            <Label>{copy.historyIntro}</Label>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="pb-2 text-left font-normal text-mid" />
                            {used.map((m) => (
                                <th key={m.id} className="px-2 pb-2 font-mono text-[10px] font-normal text-mid">
                                    {formatMeetingShort(m.meets_at)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((p) => (
                            <tr key={p.id} className="border-t border-faint">
                                <td className="py-3 pr-4 whitespace-nowrap">{p.display_name}</td>
                                {used.map((m) => {
                                    const list = goals.filter(
                                        (g) => g.meeting_id === m.id && g.profile_id === p.id
                                    );
                                    const done = list.filter((g) => g.done).length;
                                    const frac = list.length ? done / list.length : null;
                                    return (
                                        <td key={m.id} className="px-2 py-3 text-center">
                                            {frac === null ? (
                                                <span className="text-faint">·</span>
                                            ) : (
                                                <span
                                                    title={`${done} of ${list.length}`}
                                                    className="inline-block h-3.5 w-3.5 rounded-full border border-ink"
                                                    style={{
                                                        background: `linear-gradient(to top, var(--color-ink) ${frac * 100}%, transparent ${frac * 100}%)`,
                                                    }}
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}