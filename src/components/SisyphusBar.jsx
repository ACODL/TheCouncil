// src/components/SisyphusBar.jsx
"use client";
import { useEffect, useRef, useState } from "react";

const SPEED = 900;        // ms per unit of progress — constant speed, not duration
const FRAMES = 6;
const FPS = 10;

export default function SisyphusBar({ done, total, height = 56 }) {
    const [pos, setPos] = useState(total ? done / total : 0);
    const [walking, setWalking] = useState(false);
    const prev = useRef(pos);

    const target = total ? done / total : 0;

    useEffect(() => {
        if (target === prev.current) return;

        const distance = Math.abs(target - prev.current);
        const duration = Math.max(400, distance * SPEED * (total || 1));

        setWalking(true);
        setPos(target);

        const t = setTimeout(() => setWalking(false), duration);
        prev.current = target;
        return () => clearTimeout(t);
    }, [target, total]);

    const complete = total > 0 && done >= total;

    // Travel across the bar, rising as it goes
    const x = pos * 82;                      // % from left
    const y = pos * 62;                      // % rise from bottom
    const duration = Math.max(400, Math.abs(target - prev.current) * SPEED * (total || 1));

    // Rolling: rotation = distance / radius, so it looks physically right
    const rotation = pos * 1100;

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height }}
            role="img"
            aria-label={`${done} of ${total} complete`}
        >
            {/* the hill */}
            <svg viewBox="0 0 320 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <path d="M 0 54 L 320 8 L 320 56 L 0 56 Z" className="fill-faint" />
                <path
                    d={`M 0 54 L ${pos * 320} ${54 - pos * 46} L ${pos * 320} 56 L 0 56 Z`}
                    fill="currentColor"
                    style={{ transition: `d ${duration}ms linear` }}
                />
            </svg>

            {/* traveling group */}
            <div
                className="absolute"
                style={{
                    left: `${x}%`,
                    bottom: `${y}%`,
                    transition: `left ${duration}ms linear, bottom ${duration}ms linear`,
                }}
            >
                <img
                    src="/art/boulder.png"
                    alt=""
                    className="absolute"
                    style={{
                        width: 20,
                        height: 20,
                        left: 14,
                        bottom: 2,
                        imageRendering: "pixelated",
                        transform: `rotate(${rotation}deg)`,
                        transition: `transform ${duration}ms linear`,
                    }}
                />

                <div
                    className="absolute bottom-0 left-0"
                    style={{
                        width: 18,
                        height: 18,
                        imageRendering: "pixelated",
                        backgroundImage: `url(${complete ? "/art/sisyphus-rest.png"
                                : walking ? "/art/sisyphus-push.png"
                                    : "/art/sisyphus-brace.png"
                            })`,
                        backgroundSize: walking ? `${FRAMES * 100}% 100%` : "100% 100%",
                        animation: walking
                            ? `sisyphus-walk ${FRAMES / FPS}s steps(${FRAMES}) infinite`
                            : "none",
                    }}
                />
            </div>

            <style jsx global>{`
        @keyframes sisyphus-walk {
          from { background-position: 0% 0; }
          to   { background-position: -${FRAMES * 100}% 0; }
        }
      `}</style>
        </div>
    );
}