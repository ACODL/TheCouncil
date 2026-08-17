"use client";
import { useState } from "react";
import Countdown from "./Countdown";

function toLocalInput(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MeetingBar({ meeting, onSave }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(toLocalInput(meeting?.meets_at));
    const [busy, setBusy] = useState(false);

    async function save() {
        if (!value) return;
        setBusy(true);
        await onSave(new Date(value).toISOString());
        setBusy(false);
        setEditing(false);
    }

    return (
        <div className="border-b border-faint pb-6">
            <div className="flex items-start justify-between gap-4">
                <Countdown target={meeting?.meets_at} setAt={meeting?.created_at} />
                <button
                    onClick={() => {
                        setValue(toLocalInput(meeting?.meets_at));
                        setEditing((e) => !e);
                    }}
                    className="shrink-0 text-xs text-mid hover:text-ink"
                >
                    {editing ? "Cancel" : meeting ? "Change" : "Set date"}
                </button>
            </div>

            {editing && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <input
                        type="datetime-local"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="border-b border-faint bg-transparent pb-1 text-sm outline-none focus:border-ink"
                    />
                    <button
                        onClick={save}
                        disabled={busy || !value}
                        className="border-b border-ink pb-0.5 text-sm hover:opacity-60 disabled:opacity-40"
                    >
                        {busy ? "Saving…" : "Save"}
                    </button>
                </div>
            )}

            {meeting && !editing && (
                <p className="mt-3 text-xs text-mid">
                    {new Date(meeting.meets_at).toLocaleString([], {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                    })}
                </p>
            )}
        </div>
    );
}