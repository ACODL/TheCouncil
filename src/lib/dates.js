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