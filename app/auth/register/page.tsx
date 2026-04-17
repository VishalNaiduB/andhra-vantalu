"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-8">
      <div className="text-center">
        <h1 className="font-heading text-2xl text-tamarind-500">Join Andhra Vantalu</h1>
        <p className="mt-1 text-sm text-brass-400">Share your family recipes with the world</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none" />
        <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full rounded-lg border border-brass-200 bg-white px-4 py-3 text-sm text-tamarind-500 placeholder-brass-300 focus:border-turmeric-400 focus:outline-none" />
        {error && <p className="text-sm text-curry-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-turmeric-500 py-3 text-sm font-medium text-white transition-colors hover:bg-turmeric-600 disabled:opacity-50">
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-center text-sm text-brass-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-curry-red-500 hover:underline">Login</Link>
      </p>
    </div>
  );
}
