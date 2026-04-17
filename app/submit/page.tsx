"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { MEAL_TYPE_LABELS, REGION_LABELS, SPICE_LEVELS, DIFFICULTY_LABELS } from "@/lib/constants";

export default function SubmitPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name_english: "", name_telugu: "", meal_type: [] as string[], diet: "veg",
    region: "", spice_level: "", is_healthy: false, difficulty: "",
    cook_time_minutes: "", ingredients: "", instructions: "",
    cultural_story: "", tips: "", youtube_url: "", attribution: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return; }
      setIsLoggedIn(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleMealType(type: string) {
    setForm((f) => ({ ...f, meal_type: f.meal_type.includes(type) ? f.meal_type.filter((t) => t !== type) : [...f.meal_type, type] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      cook_time_minutes: form.cook_time_minutes ? parseInt(form.cook_time_minutes) : null,
      ingredients: form.ingredients.split("\n").filter(Boolean).map((line) => {
        const [qty, ...rest] = line.split(" - ");
        return { quantity: qty?.trim(), name_english: rest.join(" - ").trim(), name_telugu: "" };
      }),
      instructions: form.instructions.split("\n").filter(Boolean),
    };
    const res = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) setSuccess(true);
    setSubmitting(false);
  }

  if (!isLoggedIn) return null;
  if (success) {
    return (
      <div className="py-12 text-center">
        <h2 className="font-heading text-2xl text-tamarind-500">Thank you!</h2>
        <p className="mt-2 text-brass-400">Your recipe has been submitted for review.</p>
        <button onClick={() => router.push("/")} className="mt-4 rounded-lg bg-turmeric-500 px-6 py-2 text-sm font-medium text-white">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-8">
      <h1 className="font-heading text-2xl text-tamarind-500">Submit a Recipe / వంటకం పంపండి</h1>
      <p className="text-sm text-brass-400">Share your family recipe with the community. It will be reviewed before publishing.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Recipe name (English) *" value={form.name_english} onChange={(e) => setForm({ ...form, name_english: e.target.value })} required className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:border-turmeric-400 focus:outline-none" />
        <input type="text" placeholder="Recipe name (Telugu)" value={form.name_telugu} onChange={(e) => setForm({ ...form, name_telugu: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:border-turmeric-400 focus:outline-none" />
        <div>
          <label className="text-xs font-semibold uppercase text-brass-500">Meal Type *</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
              <button key={value} type="button" onClick={() => toggleMealType(value)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${form.meal_type.includes(value) ? "bg-turmeric-500 text-white" : "border border-brass-200 text-tamarind-400"}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          {["veg", "nonveg"].map((d) => (
            <button key={d} type="button" onClick={() => setForm({ ...form, diet: d })}
              className={`rounded-full px-4 py-2 text-sm ${form.diet === d ? "bg-turmeric-500 text-white" : "border border-brass-200 text-tamarind-400"}`}>
              {d === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
            </button>
          ))}
        </div>
        <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm">
          <option value="">Select Region</option>
          {Object.entries(REGION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={form.spice_level} onChange={(e) => setForm({ ...form, spice_level: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm">
          <option value="">Select Spice Level</option>
          {Object.entries(SPICE_LEVELS).map(([v, { label, emoji }]) => <option key={v} value={v}>{emoji} {label}</option>)}
        </select>
        <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm">
          <option value="">Select Difficulty</option>
          {Object.entries(DIFFICULTY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input type="number" placeholder="Cook time (minutes)" value={form.cook_time_minutes} onChange={(e) => setForm({ ...form, cook_time_minutes: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />
        <label className="flex items-center gap-2 text-sm text-tamarind-400">
          <input type="checkbox" checked={form.is_healthy} onChange={(e) => setForm({ ...form, is_healthy: e.target.checked })} /> 🌿 Healthy recipe
        </label>
        <textarea placeholder="Ingredients (one per line, format: quantity - name)" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} rows={6} required className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />
        <textarea placeholder="Instructions (one step per line)" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows={6} required className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />
        <textarea placeholder="Cultural story (optional)" value={form.cultural_story} onChange={(e) => setForm({ ...form, cultural_story: e.target.value })} rows={4} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />
        <textarea placeholder="Tips & variations (optional)" value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} rows={2} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />
        <input type="url" placeholder="YouTube URL (optional)" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />
        <input type="text" placeholder="Attribution (e.g., 'From my grandmother in Nellore')" value={form.attribution} onChange={(e) => setForm({ ...form, attribution: e.target.value })} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm focus:outline-none" />
        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-turmeric-500 py-3 text-sm font-medium text-white transition-colors hover:bg-turmeric-600 disabled:opacity-50">
          {submitting ? "Submitting..." : "Submit Recipe"}
        </button>
      </form>
    </div>
  );
}
