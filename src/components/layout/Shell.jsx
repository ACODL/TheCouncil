export function Page({ children }) {
    return <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">{children}</main>;
}

export function Label({ children }) {
    return <p className="font-mono text-[11px] uppercase tracking-wide text-mid">{children}</p>;
}

export function Tabs({ tabs, active, onChange }) {
    return (
        <div className="mt-6 flex gap-6 border-b border-faint">
            {tabs.map(([key, label]) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`-mb-px border-b pb-2 text-sm transition ${active === key ? "border-ink text-ink" : "border-transparent text-mid hover:text-ink"
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export function Dot({ done, size = 14 }) {
    return (
        <span
            className={`inline-block shrink-0 rounded-full border transition ${done ? "border-ink bg-ink" : "border-mid bg-transparent"
                }`}
            style={{ width: size, height: size }}
        />
    );
}