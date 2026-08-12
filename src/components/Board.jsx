"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/theme";
import { Page, Tabs } from "./layout/Shell";
import CurrentSession from "./CurrentSession";
import ClimbView from "./ClimbView";

export default function Board({ userId, month, initialProfiles, initialGoals }) {
    const [supabase] = useState(() => createClient());
    const [profiles, setProfiles] = useState(initialProfiles);
    const [goals, setGoals] = useState(initialGoals);
    const [view, setView] = useState("current");
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");

    const refresh = useCallback(async () => {
        const [{ data: pr }, { data: gl }] = await Promise.all([
            supabase.from("profiles").select("*").order("created_at"),
            supabase.from("goals").select("*").eq("month", month),
        ]);
        if (pr) setProfiles(pr);
        if (gl) setGoals(gl);
    }, [supabase, month]);

    useEffect(() => {
        const channel = supabase
            .channel("council-live")
            .on("postgres_changes", { event: "*", schema: "public", table: "goals" }, refresh)
            .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, refresh)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [supabase, refresh]);

    async function addGoal() {
        if (!draft.trim()) return setError("Write a goal first");
        setError("");
        const text = draft.trim();
        setDraft("");
        const { data, error: e } = await supabase
            .from("goals")
            .insert({ month, profile_id: userId, text, done: false })
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

            <Tabs
                tabs={[["current", copy.tabCurrent], ["history", copy.tabHistory]]}
                active={view}
                onChange={setView}
            />

            {view === "current" ? (
                <CurrentSession
                    month={month} profiles={profiles} goals={goals} userId={userId}
                    draft={draft} setDraft={setDraft} error={error} setError={setError}
                    onAdd={addGoal} onToggle={toggle} onRemove={remove}
                />
            ) : (
                <ClimbView profiles={profiles} />
            )}
        </Page>
    );
}