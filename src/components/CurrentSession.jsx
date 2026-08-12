"use client";
import { formatMonthLong } from "@/lib/dates";
import { Label, Dot } from "./layout/Shell";

export default function CurrentSession({
    month, profiles, goals, userId,
    draft, setDraft, error, setError, onAdd, onToggle, onRemove,
}) {
    return (
        <div className="mt-8">
            <Label>{formatMonthLong(month)}</Label>

            <div className="mt-6 space-y-8">
                {profiles.map((p) => {
                    const mine = p.id === userId;
                    const list = goals.filter((g) => g.profile_id === p.id);
                    const done = list.filter((g) => g.done).length;

                    return (
                        <section key={p.id}>
                            <div className="flex items-baseline justify-between border-b border-faint pb-1">
                                <h2 className="text-sm font-medium">
                                    {p.display_name}
                                    {mine && <span className="ml-1.5 text-xs font-normal text-mid">you</span>}
                                </h2>
                                <span className="font-mono text-[11px] text-mid">
                                    {done}/{list.length}
                                </span>
                            </div>

                            {list.length === 0 ? (
                                <p className="pt-2 text-sm text-mid">
                                    {mine ? "Nothing yet." : "—"}
                                </p>
                            ) : (
                                <ul className="pt-2">
                                    {list.map((g) => (
                                        <li key={g.id} className="group flex items-center gap-3 py-1.5">
                                            <button
                                                onClick={() => mine && onToggle(g)}
                                                disabled={!mine}
                                                aria-label={g.done ? "Mark as not done" : "Mark as done"}
                                                className={mine ? "cursor-pointer" : "cursor-default"}
                                            >
                                                <Dot done={g.done} />
                                            </button>
                                            <span className={`flex-1 text-sm ${g.done ? "text-mid line-through" : ""}`}>
                                                {g.text}
                                            </span>
                                            {mine && (
                                                <button
                                                    onClick={() => onRemove(g)}
                                                    className="text-xs text-mid opacity-0 transition group-hover:opacity-100 hover:text-ink"
                                                >
                                                    remove
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {mine && (
                                <div className="pt-2">
                                    <input
                                        value={draft}
                                        onChange={(e) => { setDraft(e.target.value); setError(""); }}
                                        onKeyDown={(e) => e.key === "Enter" && onAdd()}
                                        placeholder="Add a goal…"
                                        className="w-full border-b border-faint pb-1 text-sm outline-none placeholder:text-mid focus:border-ink"
                                    />
                                    {error && <p className="pt-1 text-xs text-mid">{error}</p>}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}