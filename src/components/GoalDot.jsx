import { Dot } from './layout/Shell'

export default function GoalDot({ total = 0, completed = 0, done, size = 14 }) {
    if (!total) {
        return <Dot done={done} size={size} />
    }

    const percent = Math.round((completed / total) * 100)

    return (
        <span
            className={`inline-block shrink-0 rounded-full border text-ink transition ${percent >= 100 ? 'border-ink' : 'border-mid'
                }`}
            style={{
                width: size,
                height: size,
                background: percent > 0 ? `conic-gradient(currentColor ${percent}%, transparent ${percent}%)` : 'transparent',
            }}
        />
    )
}