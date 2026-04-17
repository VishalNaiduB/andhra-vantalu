"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-8">
      <div className="text-center">
        <h1 className="font-heading text-2xl text-tamarind-500">Welcome Back</h1>
        <p className="mt-1 text-sm text-brass-400">Login to save recipes, rate, and share your own</p>
      </div>

      <button onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-2 rounded-lg border border-brass-200 bg-white py-3 text-sm font-medium text-tamarind-500 transition-colors hover:bg-cream-100">
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-brass-200" />
        <span className="text-xs text-brass-400">or</span>
        <div className="h-px flex-1 bg-brass-200" />
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none" />
        {error && <p className="text-sm text-curry-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-turmeric-500 py-3 text-sm font-medium text-white transition-colors hover:bg-turmeric-600 disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-brass-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-curry-red-500 hover:underline">Register</Link>
      </p>
    </div>
  );
}
