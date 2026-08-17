"use client";
import { useEffect, useState } from "react";

function parts(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return {
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        mins: Math.floor((s % 3600) / 60),
        secs: s % 60,
    };
}

export default function Countdown({ target, setAt }) {
    const [now, setNow] = useState(null);

    useEffect(() => {
        setNow(Date.now());
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    // Render nothing time-dependent on the server — avoids hydration mismatch
    if (!target) {
        return <p className="text-sm text-mid">No meeting scheduled yet.</p>;
    }
    if (now === null) {
        return <div className="h-24" aria-hidden="true" />;
    }

    const targetMs = new Date(target).getTime();
    const diff = targetMs - now;
    const { days, hours, mins, secs } = parts(diff);
    const passed = diff <= 0;

    // Dots: one per day between when it was set and the meeting
    const startMs = setAt ? new Date(setAt).getTime() : targetMs - 30 * 86400000;
    const span = Math.max(1, Math.round((targetMs - startMs) / 86400000));
    const elapsed = Math.min(span, Math.max(0, Math.round((now - startMs) / 86400000)));
    const dots = Math.min(span, 45);
    const filledDots = Math.round((elapsed / span) * dots);

    if (passed) {
        return (
            <div>
                <p className="font-mono text-[11px] uppercase tracking-wide text-mid">
                    council is now
                </p>
                <p className="mt-1 text-2xl">It&apos;s time.</p>
            </div>
        );
    }

    return (
        <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-mid">
                next council
            </p>

            <div className="mt-2 flex items-baseline gap-4 font-mono">
                <Unit value={days} label="days" big />
                <Unit value={hours} label="hrs" />
                <Unit value={mins} label="min" />
                <Unit value={secs} label="sec" dim />
            </div>

            <div className="mt-4 flex flex-wrap gap-[3px]" aria-hidden="true">
                {Array.from({ length: dots }).map((_, i) => (
                    <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${i < filledDots ? "bg-ink" : "bg-faint"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

function Unit({ value, label, big = false, dim = false }) {
    return (
        <span className={`flex items-baseline gap-1 ${dim ? "text-mid" : ""}`}>
            <span className={big ? "text-4xl" : "text-xl"}>
                {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase text-mid">{label}</span>
        </span>
    );
}