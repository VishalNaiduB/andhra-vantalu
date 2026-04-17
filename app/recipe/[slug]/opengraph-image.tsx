import { ImageResponse } from "next/og";
import { sanityClient } from "@/lib/sanity/client";
import { recipeBySlugQuery } from "@/lib/sanity/queries";
import { REGION_LABELS, SPICE_LEVELS } from "@/lib/constants";

export const runtime = "edge";
export const alt = "Andhra Vantalu Recipe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await sanityClient.fetch(recipeBySlugQuery, { slug });

  if (!recipe) {
    return new ImageResponse(
      <div style={{ display: "flex", fontSize: 40, background: "#FAF3E0", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
        Andhra Vantalu
      </div>,
      { ...size }
    );
  }

  const region = REGION_LABELS[recipe.region] || recipe.region;
  const spice = SPICE_LEVELS[recipe.spice_level]?.emoji || "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #FAF3E0 0%, #FFF0BF 100%)",
          padding: 60,
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#B08D57", marginBottom: 12 }}>
          Andhra Vantalu
        </div>
        <div style={{ fontSize: 64, color: "#4A2C17", fontWeight: 700, lineHeight: 1.1 }}>
          {recipe.name_telugu}
        </div>
        <div style={{ fontSize: 36, color: "#6B4226", marginTop: 8 }}>
          {recipe.name_english}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 20, fontSize: 24, color: "#8B5E3C" }}>
          <span>{region}</span>
          <span>·</span>
          <span>{recipe.diet === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}</span>
          <span>·</span>
          <span>{spice}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
