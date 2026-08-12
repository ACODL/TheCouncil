"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatMonthShort } from "@/lib/dates";
import { copy } from "@/lib/theme";
import { Label } from "./layout/Shell";

export default function ClimbView({ profiles }) {
    const [byMonth, setByMonth] = useState(null);

    useEffect(() => {
        (async () => {
            const supabase = createClient();
            const { data } = await supabase.from("goals").select("*").order("month");
            const grouped = {};
            (data ?? []).forEach((g) => { (grouped[g.month] ||= []).push(g); });
            setByMonth(grouped);
        })();
    }, []);

    if (!byMonth) return <p className="mt-8 text-sm text-mid">Loading…</p>;

    const months = Object.keys(byMonth).sort();
    if (months.length === 0) {
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
                            {months.map((m) => (
                                <th key={m} className="px-2 pb-2 font-mono text-[10px] font-normal text-mid">
                                    {formatMonthShort(m)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((p) => (
                            <tr key={p.id} className="border-t border-faint">
                                <td className="py-3 pr-4 whitespace-nowrap">{p.display_name}</td>
                                {months.map((m) => {
                                    const list = byMonth[m].filter((g) => g.profile_id === p.id);
                                    const done = list.filter((g) => g.done).length;
                                    const frac = list.length ? done / list.length : null;
                                    return (
                                        <td key={m} className="px-2 py-3 text-center">
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