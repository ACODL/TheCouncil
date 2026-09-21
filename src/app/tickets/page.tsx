// src/app/tickets/page.jsx

import { createClient } from '@/lib/supabase/server'
import TicketsList from '@/components/TicketsList'

export default async function TicketsPage() {
    const supabase = await createClient()

    const { data: tickets } = await supabase
        .from('tickets')
        .select('id, type, title, description, status, created_at, profiles(display_name)')
        .order('created_at', { ascending: false })

    return (
        <main className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-sm text-mid mb-6">Tickets</h1>
            <TicketsList initialTickets={tickets ?? []} />
        </main>
    )
}