"use client";
import { useEffect, useRef, useState } from "react";

const STEPS = 10;
const W = 480, H = 260;
const SW = 34, SH = 15;
const X0 = 120, Y0 = H - 40;

function staircasePath() {
    let d = `M 0 ${H} L 0 ${Y0} L ${X0} ${Y0}`;
    for (let i = 0; i < STEPS; i++) {
        d += ` L ${X0 + i * SW} ${Y0 - (i + 1) * SH} L ${X0 + (i + 1) * SW} ${Y0 - (i + 1) * SH}`;
    }
    return d + ` L ${W} ${Y0 - STEPS * SH} L ${W} ${H} Z`;
}

function pixelCircle(cx, cy, r, fill, k) {
    const out = [];
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
        const dy = y - cy + 0.5;
        if (Math.abs(dy) > r) continue;
        const half = Math.floor(Math.sqrt(r * r - dy * dy));
        if (half <= 0) continue;
        out.push(
            <rect key={`${k}${y}`} x={cx - half} y={y} width={half * 2} height={1} fill={fill} />
        );
    }
    return out;
}

export default function Climb({
    step = 0,              // 0..STEPS — how far up he is
    total = STEPS,         // number of goals this month
    bg = "#C4682B",
    dark = "#2A1508",
    className = "",
}) {
    const idx = total > 0 ? Math.round((step / total) * STEPS) : 0;
    const clamped = Math.min(STEPS, Math.max(0, idx));

    // Bump animation when the step changes
    const [nudge, setNudge] = useState(0);
    const prev = useRef(clamped);
    useEffect(() => {
        if (prev.current !== clamped) {
            const up = clamped > prev.current;
            prev.current = clamped;
            if (up) {
                setNudge(1);
                const t = setTimeout(() => setNudge(0), 260);
                return () => clearTimeout(t);
            }
        }
    }, [clamped]);

    const surf = Y0 - clamped * SH;
    const px = clamped > 0 ? X0 + (clamped - 0.5) * SW : X0 * 0.55;
    const bcx = px + 34, bcy = surf - 26;
    const fh = 30, fx = px, fy = surf - fh - nudge * 2;

    const body = [
        [fx, fy, 7, 7],
        [fx - 2, fy + 7, 11, 5],
        [fx + 8, fy + 9, 12, 4],
        [fx, fy + 12, 8, 8],
        [fx - 3, fy + 20, 6, 10],
        [fx + 5, fy + 20, 6, 8],
        [fx + 9, fy + 28, 7, 2],
    ];

    const glide = "transform 900ms cubic-bezier(.34,.8,.4,1)";

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className={`w-full ${className}`}
            shapeRendering="crispEdges"
            preserveAspectRatio="xMidYMax slice"
            role="img"
            aria-label={`${step} of ${total} goals complete`}
        >
            <rect width={W} height={H} fill={bg} />
            <path d={staircasePath()} fill={dark} />

            <g style={{ transition: glide }}>
                {pixelCircle(bcx, bcy, 26, dark, "b")}
                {body.map(([x, y, w, h], i) => (
                    <rect key={`f${i}`} x={x} y={y} width={w} height={h} fill={dark} />
                ))}
            </g>
        </svg>
    );
}