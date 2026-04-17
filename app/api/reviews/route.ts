import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(username, avatar_url, region)")
    .eq("recipe_slug", slug)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipe_slug, body } = await request.json();
  if (!recipe_slug || !body?.trim()) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({ recipe_slug, user_id: user.id, body: body.trim() })
    .select("*, profiles(username, avatar_url, region)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
