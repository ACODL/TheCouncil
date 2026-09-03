"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/theme";
import { activeMeeting } from "@/lib/dates";
import { Page, Tabs } from "./layout/Shell";
import MeetingBar from "./MeetingBar";
import CurrentSession from "./CurrentSession";
import ClimbView from "./ClimbView";
import MemberAdmin from "./MemberAdmin";

export default function Board({ userId, initialProfiles, initialGoals, initialMeetings }) {
    const [supabase] = useState(() => createClient());
    const [profiles, setProfiles] = useState(initialProfiles);
    const [goals, setGoals] = useState(initialGoals);
    const [meetings, setMeetings] = useState(initialMeetings);
    const [view, setView] = useState("current");
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");

    const meeting = activeMeeting(meetings);

    const refresh = useCallback(async () => {
        const { data: mt } = await supabase
            .from("meetings").select("*").order("meets_at", { ascending: true });
        const current = activeMeeting(mt ?? []);

        const [{ data: pr }, { data: gl }] = await Promise.all([
            supabase.from("profiles").select("*").order("created_at"),
            current
                ? supabase.from("goals").select("*").eq("meeting_id", current.id)
                : Promise.resolve({ data: [] }),
        ]);

        if (mt) setMeetings(mt);
        if (pr) setProfiles(pr);
        setGoals(gl ?? []);
    }, [supabase]);

    useEffect(() => {
        const channel = supabase
            .channel("council-live")
            .on("postgres_changes", { event: "*", schema: "public", table: "goals" }, refresh)
            .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, refresh)
            .on("postgres_changes", { event: "*", schema: "public", table: "meetings" }, refresh)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [supabase, refresh]);

    async function saveMeeting(iso) {
        if (meeting && new Date(meeting.meets_at).getTime() >= Date.now()) {
            await supabase.from("meetings").update({ meets_at: iso }).eq("id", meeting.id);
        } else {
            await supabase.from("meetings").insert({ meets_at: iso, created_by: userId });
        }
        refresh();
    }

    async function addGoal() {
        if (!meeting) return setError("Set a council date first");
        if (!draft.trim()) return setError("Write a goal first");
        setError("");
        const text = draft.trim();
        setDraft("");
        const { data, error: e } = await supabase
            .from("goals")
            .insert({ meeting_id: meeting.id, profile_id: userId, text, done: false })
            .select().single();
        if (e) { setError(e.message); setDraft(text); return; }
        setGoals((g) => [...g, data]);
    }

    async function toggle(goal) {
        setGoals((g) => g.map((x) => (x.id === goal.id ? { ...x, done: !x.done } : x)));
        const { error: e } = await supabase.from("goals").update({ done: !goal.done }).eq("id", goal.id);
        if (e) refresh();
    }

    async function remove(goal) {
        setGoals((g) => g.filter((x) => x.id !== goal.id));
        const { error: e } = await supabase.from("goals").delete().eq("id", goal.id);
        if (e) refresh();
    }

    async function signOut() {
        await supabase.auth.signOut();
        window.location.href = "/login";
    }

    return (
        <Page>
            <div className="flex items-baseline justify-between">
                <h1 className="text-lg font-medium">{copy.title}</h1>
                <button onClick={signOut} className="text-xs text-mid hover:text-ink">
                    Sign out
                </button>
            </div>

            <div className="mt-6">
                <MeetingBar meeting={meeting} onSave={saveMeeting} />
            </div>

            <Tabs
                tabs={[["current", copy.tabCurrent], ["history", copy.tabHistory]]}
                active={view}
                onChange={setView}
            />

            {view === "current" ? (
                <>
                    <CurrentSession
                        meeting={meeting} profiles={profiles} goals={goals} userId={userId}
                        draft={draft} setDraft={setDraft} error={error} setError={setError}
                        onAdd={addGoal} onToggle={toggle} onRemove={remove}
                    />
                    <MemberAdmin
                        profiles={profiles} goals={goals} userId={userId} onChange={refresh}
                    />
                </>
            ) : (
                <ClimbView profiles={profiles} meetings={meetings} />
            )}
        </Page>
    );
}