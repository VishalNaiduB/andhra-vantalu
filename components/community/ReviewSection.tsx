"use client";
import { useState, useEffect } from "react";
import type { Review } from "@/lib/supabase/types";

export function ReviewSection({ slug, isLoggedIn }: { slug: string; isLoggedIn: boolean }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?slug=${slug}`).then((r) => r.json()).then(setReviews);
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_slug: slug, body }),
    });
    if (res.ok) { const review = await res.json(); setReviews((prev) => [review, ...prev]); setBody(""); }
    setSubmitting(false);
  }

  return (
    <section className="space-y-4">
      <h3 className="font-heading text-lg text-tamarind-500">Reviews ({reviews.length})</h3>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input type="text" value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience..."
            className="flex-1 rounded-lg border border-brass-200 bg-white px-3 py-2 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none" />
          <button type="submit" disabled={submitting || !body.trim()}
            className="rounded-lg bg-turmeric-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Post</button>
        </form>
      ) : (
        <p className="text-sm text-brass-400"><a href="/auth/login" className="text-curry-red-500 hover:underline">Login</a> to leave a review</p>
      )}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-tamarind-500">{(review as any).profiles?.username || "Anonymous"}</span>
              {(review as any).profiles?.region && <span className="text-xs text-brass-400">from {(review as any).profiles.region}</span>}
            </div>
            <p className="mt-1 text-sm text-tamarind-400">{review.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
