import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slug = request.nextUrl.searchParams.get("slug");
  const query = supabase.from("favorites").select("*").eq("user_id", user.id);
  if (slug) query.eq("recipe_slug", slug);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipe_slug } = await request.json();
  const { data: existing } = await supabase
    .from("favorites").select("id").eq("recipe_slug", recipe_slug).eq("user_id", user.id).single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return NextResponse.json({ favorited: false });
  } else {
    await supabase.from("favorites").insert({ recipe_slug, user_id: user.id });
    return NextResponse.json({ favorited: true });
  }
}
