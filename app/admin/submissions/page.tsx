"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { REGION_LABELS, SPICE_LEVELS } from "@/lib/constants";
import type { CommunitySubmission } from "@/lib/supabase/types";

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
      if (!profile?.is_admin) { router.push("/"); return; }
      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAction(id: string, status: "approved" | "rejected") {
    const res = await fetch("/api/submissions", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) return <p className="py-8 text-center text-brass-400">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl text-tamarind-500">Admin — Review Submissions</h1>
      <p className="text-sm text-brass-400">{submissions.length} pending submission{submissions.length !== 1 ? "s" : ""}</p>
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="font-heading text-lg text-tamarind-500">
              {sub.name_english}
              {sub.name_telugu && <span className="ml-2 font-telugu text-base text-brass-500">({sub.name_telugu})</span>}
            </h3>
            <p className="text-xs text-brass-400">
              {sub.meal_type.join(", ")} · {sub.diet} · {REGION_LABELS[sub.region || ""] || sub.region} · {SPICE_LEVELS[sub.spice_level || ""]?.emoji || ""}
            </p>
            {sub.attribution && <p className="mt-1 text-xs italic text-brass-500">&quot;{sub.attribution}&quot;</p>}
            {sub.cultural_story && <p className="mt-2 text-sm text-tamarind-400 line-clamp-3">{sub.cultural_story}</p>}
            <div className="mt-3 flex gap-2">
              <button onClick={() => handleAction(sub.id, "approved")} className="rounded-lg bg-curry-leaf-500 px-4 py-1.5 text-sm font-medium text-white">Approve</button>
              <button onClick={() => handleAction(sub.id, "rejected")} className="rounded-lg border border-curry-red-200 px-4 py-1.5 text-sm text-curry-red-500">Reject</button>
            </div>
          </div>
        ))}
        {submissions.length === 0 && <p className="py-8 text-center text-brass-400">No pending submissions</p>}
      </div>
    </div>
  );
}
