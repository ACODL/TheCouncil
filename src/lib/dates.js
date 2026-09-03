export const getMonthKey = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export function formatMonthLong(key) {
    const [y, m] = key.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
}

export function formatMonthShort(key) {
    const [y, m] = key.split("-").map(Number);
    const d = new Date(y, m - 1, 1);
    return `${d.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${y}`;
}

export function formatMeeting(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString([], {
        month: "long", day: "numeric", year: "numeric",
    });
}

export function formatMeetingShort(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${d.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${d.getDate()}`;
}

// The cycle we're currently in: the soonest upcoming meeting,
// or the most recent past one if none are scheduled ahead.
export function activeMeeting(meetings = []) {
    if (!meetings.length) return null;
    const now = Date.now();
    const upcoming = meetings
        .filter((m) => new Date(m.meets_at).getTime() >= now)
        .sort((a, b) => new Date(a.meets_at) - new Date(b.meets_at));
    if (upcoming.length) return upcoming[0];
    return [...meetings].sort((a, b) => new Date(b.meets_at) - new Date(a.meets_at))[0];
}