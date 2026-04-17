"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { REGION_LABELS } from "@/lib/constants";
import type { Profile } from "@/lib/supabase/types";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return; }
      supabase.from("profiles").select("*").eq("id", user.id).single()
        .then(({ data }) => {
          if (data) { setProfile(data as Profile); setUsername(data.username); setBio(data.bio || ""); setRegion(data.region || ""); }
        });
    });
  }, []);

  async function handleSave() {
    if (!profile) return;
    await supabase.from("profiles").update({ username, bio, region }).eq("id", profile.id);
    setProfile({ ...profile, username, bio, region });
    setEditing(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-4">
      <h1 className="font-heading text-2xl text-tamarind-500">Profile</h1>
      {editing ? (
        <div className="space-y-3">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"
            className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 focus:border-turmeric-400 focus:outline-none" />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3}
            className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 focus:border-turmeric-400 focus:outline-none" />
          <select value={region} onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500">
            <option value="">Select your region</option>
            {Object.entries(REGION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleSave} className="rounded-lg bg-turmeric-500 px-4 py-2 text-sm font-medium text-white">Save</button>
            <button onClick={() => setEditing(false)} className="rounded-lg border border-brass-200 px-4 py-2 text-sm text-tamarind-400">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-lg font-medium text-tamarind-500">{profile.username}</p>
          {profile.region && <p className="text-sm text-brass-400">{REGION_LABELS[profile.region] || profile.region}</p>}
          {profile.bio && <p className="mt-2 text-sm text-tamarind-400">{profile.bio}</p>}
          <button onClick={() => setEditing(true)} className="mt-3 text-sm text-curry-red-500 hover:underline">Edit Profile</button>
        </div>
      )}
      <button onClick={handleLogout} className="w-full rounded-lg border border-curry-red-200 py-2 text-sm text-curry-red-500 transition-colors hover:bg-curry-red-50">Logout</button>
    </div>
  );
}
