import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipe_slug } = await request.json();
  const { data: existing } = await supabase
    .from("made_this").select("id").eq("recipe_slug", recipe_slug).eq("user_id", user.id).single();

  if (existing) {
    await supabase.from("made_this").delete().eq("id", existing.id);
    return NextResponse.json({ made: false });
  } else {
    await supabase.from("made_this").insert({ recipe_slug, user_id: user.id });
    return NextResponse.json({ made: true });
  }
}
