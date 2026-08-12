export default function Sisyphus({ width = 200, className = "" }) {
    return (
        <svg
            viewBox="0 0 160 96"
            width={width}
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="A small figure resting a hand on a boulder partway up a slope"
        >
            <path d="M4 88 L156 30" strokeWidth="1.25" opacity="0.4" />

            <circle cx="100" cy="36" r="15" strokeWidth="2" />

            <circle cx="64" cy="39" r="4" strokeWidth="2" />
            <path d="M64 43 L67 54" strokeWidth="2" />
            <path d="M65 46 L77 44 L85 42" strokeWidth="2" />
            <path d="M65 47 L61 54" strokeWidth="2" />
            <path d="M67 54 L61 63" strokeWidth="2" />
            <path d="M67 54 L73 62" strokeWidth="2" />
        </svg>
    );
}