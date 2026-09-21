'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TicketModal() {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState('bug')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!title.trim()) return
        setSubmitting(true)
        setError(null)

        const supabase = createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const { error: insertError } = await supabase.from('tickets').insert({
            profile_id: user.id,
            type,
            title: title.trim(),
            description: description.trim() || null,
        })

        setSubmitting(false)

        if (insertError) {
            setError(insertError.message)
            return
        }

        setTitle('')
        setDescription('')
        setType('bug')
        setOpen(false)
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-sm text-mid hover:text-ink border-b border-transparent hover:border-ink transition-colors"
            >
                Feedback
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/10">
                    <div className="w-full max-w-sm bg-paper border border-ink p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-mid">New ticket</span>
                            <button onClick={() => setOpen(false)} className="text-mid hover:text-ink">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex border border-mid">
                                {['bug', 'feature'].map((t) => (
                                    <button
                                        type="button"
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`flex-1 py-2 text-sm capitalize transition-colors ${type === t ? 'bg-ink text-paper' : 'text-mid hover:text-ink'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full border-b border-mid bg-transparent py-1 text-sm focus:outline-none focus:border-ink"
                                required
                            />

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Details (optional)"
                                rows={3}
                                className="w-full border-b border-mid bg-transparent py-1 text-sm resize-none focus:outline-none focus:border-ink"
                            />

                            {error && <p className="text-sm text-ember">{error}</p>}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2 bg-ink text-paper text-sm disabled:opacity-50"
                            >
                                {submitting ? 'Sending…' : 'Send'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}