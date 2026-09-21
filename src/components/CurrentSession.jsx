"use client";
import { useRef, useState } from "react";
import { formatMeeting } from "@/lib/dates";
import { Label } from "./layout/Shell";
import GoalDot from "./GoalDot";
import GoalSubsections from "./GoalSubsections";
import GoalActions from "./GoalActions";

export default function CurrentSession({
    meeting, profiles, goals, userId,
    draft, setDraft, error, setError, onAdd, onToggle, onRemove, onEditGoal,
}) {
    const [addingGoal, setAddingGoal] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
    const editInputRef = useRef(null);

    return (
        <div className="mt-8">
            <Label>
                {meeting ? `Cycle ending ${formatMeeting(meeting.meets_at)}` : "No council scheduled"}
            </Label>

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
                                        <li key={g.id} className="py-1.5">
                                            <div className="group flex items-center gap-3">
                                                <button
                                                    onClick={() => mine && onToggle(g)}
                                                    disabled={!mine}
                                                    aria-label={g.done ? "Mark as not done" : "Mark as done"}
                                                    className={mine ? "cursor-pointer" : "cursor-default"}
                                                >
                                                    <GoalDot
                                                        done={g.done}
                                                        total={g.subsection_total}
                                                        completed={g.subsection_done}
                                                    />
                                                </button>
                                                {editingGoal === g.id ? (
                                                    <div className="flex flex-1 items-center gap-2 border-b border-ink">
                                                        <input
                                                            ref={editInputRef}
                                                            autoFocus
                                                            defaultValue={g.text}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") e.currentTarget.blur();
                                                                if (e.key === "Escape") {
                                                                    e.currentTarget.value = g.text;
                                                                    e.currentTarget.blur();
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                const value = e.currentTarget.value.trim();
                                                                if (value && value !== g.text) onEditGoal(g, value);
                                                                setEditingGoal(null);
                                                            }}
                                                            className="flex-1 bg-transparent text-sm outline-none"
                                                        />
                                                        <button
                                                            onClick={() => editInputRef.current?.blur()}
                                                            aria-label="Save edit"
                                                            className="shrink-0 text-faint transition-colors hover:text-ink"
                                                        >
                                                            ✓
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`flex-1 text-sm ${g.done ? "text-mid line-through" : ""}`}>
                                                        {g.text}
                                                    </span>
                                                )}
                                                {mine && (
                                                    <GoalActions
                                                        onEdit={() => setEditingGoal(g.id)}
                                                        onRemove={() => onRemove(g)}
                                                        onAddSubsection={() => setAddingGoal(g.id)}
                                                    />
                                                )}
                                            </div>
                                            <GoalSubsections
                                                goalId={g.id}
                                                isOwner={mine}
                                                showAddForm={addingGoal === g.id}
                                                onAddFormClose={() => setAddingGoal(null)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {mine && (
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 border-b border-faint pb-1 focus-within:border-ink">
                                        <input
                                            value={draft}
                                            onChange={(e) => { setDraft(e.target.value); setError(""); }}
                                            onKeyDown={(e) => e.key === "Enter" && onAdd()}
                                            placeholder="Add a goal…"
                                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-mid"
                                        />
                                        <button
                                            onClick={onAdd}
                                            disabled={!draft.trim()}
                                            aria-label="Add goal"
                                            className="shrink-0 text-faint transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                                        >
                                            ✓
                                        </button>
                                    </div>

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