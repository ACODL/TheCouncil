import { createClient } from "@/lib/supabase/server";
import { getMonthKey } from "@/lib/dates";

import Board from "@/components/Board";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const month = getMonthKey();
    const [{ data: profiles }, { data: goals }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at"),
        supabase.from("goals").select("*").eq("month", month),
    ]);

    return (
        <Board
            userId={user.id}
            month={month}
            initialProfiles={profiles ?? []}
            initialGoals={goals ?? []}
        />
    );
}