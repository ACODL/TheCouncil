'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function GoalSubsections({ goalId, isOwner, showAddForm, onAddFormClose }) {
    const [subsections, setSubsections] = useState([])
    const [newText, setNewText] = useState('')
    const [loading, setLoading] = useState(true)
    const inputRef = useRef(null)

    useEffect(() => {
        let active = true
        const supabase = createClient()

        supabase
            .from('goal_subsections')
            .select('id, text, done, position')
            .eq('goal_id', goalId)
            .order('position', { ascending: true })
            .then(({ data }) => {
                if (active) {
                    setSubsections(data ?? [])
                    setLoading(false)
                }
            })

        return () => {
            active = false
        }
    }, [goalId])

    useEffect(() => {
        if (showAddForm) inputRef.current?.focus()
    }, [showAddForm])

    async function addSubsection(e) {
        e.preventDefault()
        if (!newText.trim()) return

        const supabase = createClient()
        const { data, error } = await supabase
            .from('goal_subsections')
            .insert({
                goal_id: goalId,
                text: newText.trim(),
                position: subsections.length,
            })
            .select('id, text, done, position')
            .single()

        if (!error && data) {
            setSubsections((prev) => [...prev, data])
            setNewText('')
        }
    }

    async function toggle(id, currentDone) {
        setSubsections((prev) => prev.map((s) => (s.id === id ? { ...s, done: !currentDone } : s)))

        const supabase = createClient()
        const { error } = await supabase.from('goal_subsections').update({ done: !currentDone }).eq('id', id)

        if (error) {
            setSubsections((prev) => prev.map((s) => (s.id === id ? { ...s, done: currentDone } : s)))
        }
    }

    async function remove(id) {
        const previous = subsections
        setSubsections((prev) => prev.filter((s) => s.id !== id))

        const supabase = createClient()
        const { error } = await supabase.from('goal_subsections').delete().eq('id', id)

        if (error) {
            setSubsections(previous)
        }
    }

    if (loading || (subsections.length === 0 && !showAddForm)) return null

    return (
        <div className="ml-4 mt-2 space-y-1 border-l border-faint pl-3">
            {subsections.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                    <button
                        onClick={() => isOwner && toggle(s.id, s.done)}
                        disabled={!isOwner}
                        className={`w-2.5 h-2.5 rounded-full border border-ink shrink-0 ${s.done ? 'bg-ink' : 'bg-paper'
                            }`}
                        aria-label="Toggle subsection done"
                    />
                    <span className={`text-sm flex-1 ${s.done ? 'line-through text-mid' : 'text-ink'}`}>{s.text}</span>
                    {isOwner && (
                        <button
                            onClick={() => remove(s.id)}
                            className="text-xs text-faint transition hover:text-ember"
                            aria-label="Remove subsection"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}

            {isOwner && showAddForm && (
                <form onSubmit={addSubsection} className="flex items-center gap-2 pt-1">
                    <input
                        ref={inputRef}
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Escape' && onAddFormClose?.()}
                        onBlur={() => !newText && onAddFormClose?.()}
                        placeholder="Add subsection"
                        className="flex-1 border-b border-faint bg-transparent text-sm py-0.5 focus:outline-none focus:border-ink"
                    />
                </form>
            )}
        </div>
    )
}