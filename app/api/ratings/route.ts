import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipe_slug, value } = await request.json();
  if (!recipe_slug || !value || value < 1 || value > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ratings")
    .upsert({ recipe_slug, user_id: user.id, value }, { onConflict: "recipe_slug,user_id" })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
