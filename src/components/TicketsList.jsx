'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TicketsList({ initialTickets }) {
    const [tickets, setTickets] = useState(initialTickets)

    async function toggleDone(id, currentStatus) {
        const nextStatus = currentStatus === 'done' ? 'open' : 'done'
        setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)))

        const supabase = createClient()
        const { error } = await supabase.from('tickets').update({ status: nextStatus }).eq('id', id)

        // RLS will reject this for non-admins — revert the optimistic update if so
        if (error) {
            setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: currentStatus } : t)))
        }
    }

    const open = tickets.filter((t) => t.status === 'open')
    const done = tickets.filter((t) => t.status === 'done')

    return (
        <div className="space-y-8">
            {[
                ['Open', open],
                ['Done', done],
            ].map(([label, group]) => (
                <div key={label}>
                    <div className="text-sm text-faint mb-2">{label}</div>
                    <ul className="space-y-2">
                        {group.map((t) => (
                            <li key={t.id} className="flex items-start gap-3 border-b border-faint pb-2">
                                <button
                                    onClick={() => toggleDone(t.id, t.status)}
                                    className={`mt-1 w-3 h-3 rounded-full border border-ink shrink-0 ${t.status === 'done' ? 'bg-ink' : 'bg-paper'
                                        }`}
                                    aria-label="Toggle done"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-mid">{t.type}</span>
                                        <span className={`text-sm ${t.status === 'done' ? 'line-through text-mid' : 'text-ink'}`}>
                                            {t.title}
                                        </span>
                                    </div>
                                    {t.description && <p className="text-xs text-mid mt-1">{t.description}</p>}
                                    <p className="text-xs text-faint mt-1">{t.profiles?.display_name}</p>
                                </div>
                            </li>
                        ))}
                        {group.length === 0 && <li className="text-sm text-faint">Nothing here.</li>}
                    </ul>
                </div>
            ))}
        </div>
    )
}