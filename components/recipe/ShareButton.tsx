"use client";

import { buildWhatsAppMessage, buildWhatsAppUrl, buildShareData } from "@/lib/share";
import type { ShareableRecipe } from "@/lib/share";

export function ShareButton({ recipe }: { recipe: ShareableRecipe }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://andhra-vantalu.com";

  async function handleShare() {
    const shareData = buildShareData(recipe, baseUrl);
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to WhatsApp
      }
    }
    const message = buildWhatsAppMessage(recipe, baseUrl);
    window.open(buildWhatsAppUrl(message), "_blank");
  }

  function handleWhatsApp() {
    const message = buildWhatsAppMessage(recipe, baseUrl);
    window.open(buildWhatsAppUrl(message), "_blank");
  }

  function handleCopyLink() {
    const url = `${baseUrl}/recipe/${recipe.slug}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 rounded-lg bg-turmeric-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-turmeric-600"
      >
        📤 Share
      </button>
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
      >
        WhatsApp
      </button>
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 rounded-lg border border-brass-200 bg-white px-3 py-2 text-sm text-tamarind-400 transition-colors hover:bg-cream-100"
      >
        🔗 Copy
      </button>
    </div>
  );
}
