import { createClient } from "@/lib/supabase/server";
import { activeMeeting } from "@/lib/dates";
import Board from "@/components/Board";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: meetings } = await supabase
        .from("meetings").select("*").order("meets_at", { ascending: true });

    const current = activeMeeting(meetings ?? []);

    const [{ data: profiles }, { data: goals }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at"),
        current
            ? supabase.from("goals").select("*").eq("meeting_id", current.id)
            : Promise.resolve({ data: [] }),
    ]);

    // Safety net: if the signup trigger ever missed, create the profile now
    let list = profiles ?? [];
    if (user && !list.some((p) => p.id === user.id)) {
        const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Member";
        const { data: created } = await supabase
            .from("profiles")
            .insert({ id: user.id, display_name: name, color_index: list.length })
            .select().single();
        if (created) list = [...list, created];
    }

    return (
        <Board
            userId={user.id}
            initialProfiles={list}
            initialGoals={goals ?? []}
            initialMeetings={meetings ?? []}
        />
    );
}