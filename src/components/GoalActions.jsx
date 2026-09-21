'use client'

import { useEffect, useRef, useState } from 'react'

export default function GoalActions({ onEdit, onRemove, onAddSubsection }) {
    const [expanded, setExpanded] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!expanded) return

        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setExpanded(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [expanded])

    return (
        <div ref={ref} className="flex items-center justify-end">
            <button
                onClick={() => setExpanded(true)}
                aria-label="Goal actions"
                className={`shrink-0 px-1 text-faint transition-all duration-300 ease-in-out hover:text-ink ${expanded ? 'pointer-events-none w-0 opacity-0' : ''
                    }`}
            >
                ⋯
            </button>

            <div
                className="grid transition-[grid-template-columns] duration-300 ease-in-out"
                style={{ gridTemplateColumns: expanded ? '1fr' : '0fr' }}
            >
                <div
                    className={`flex min-w-0 items-center justify-end gap-1.5 overflow-hidden transition-opacity duration-300 ease-in-out ${expanded ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <button
                        onClick={() => {
                            setExpanded(false)
                            onEdit()
                        }}
                        className="whitespace-nowrap rounded-full border border-mid px-2.5 py-0.5 text-xs text-mid transition hover:border-ink hover:text-ink"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            setExpanded(false)
                            onAddSubsection()
                        }}
                        className="whitespace-nowrap rounded-full border border-mid px-2.5 py-0.5 text-xs text-mid transition hover:border-ink hover:text-ink"
                    >
                        Add subsection
                    </button>
                    <button
                        onClick={onRemove}
                        className="whitespace-nowrap rounded-full border border-mid px-2.5 py-0.5 text-xs text-mid transition hover:border-ember hover:text-ember"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    )
}