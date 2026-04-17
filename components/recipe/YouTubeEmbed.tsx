"use client";

import { useState } from "react";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

export function YouTubeEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="relative aspect-video w-full overflow-hidden rounded-lg bg-black"
        aria-label="Play video"
      >
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-curry-red-500 p-4 text-white shadow-lg">
            ▶
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Tap to play
        </span>
      </button>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="Recipe video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
