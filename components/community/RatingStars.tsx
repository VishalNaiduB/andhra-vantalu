"use client";
import { useState } from "react";

export function RatingStars({ currentRating, userRating, ratingCount, onRate, disabled }: {
  currentRating: number | null; userRating: number | null; ratingCount: number;
  onRate: (value: number) => void; disabled: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || userRating || 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onMouseEnter={() => !disabled && setHovered(star)}
            onClick={() => !disabled && onRate(star)} disabled={disabled}
            className={`text-2xl transition-colors ${star <= display ? "text-turmeric-500" : "text-brass-200"} ${disabled ? "cursor-default" : "cursor-pointer"}`}
            aria-label={`Rate ${star} stars`}>★</button>
        ))}
      </div>
      <span className="text-sm text-brass-400">
        {currentRating ? `${currentRating}/5` : "No ratings"} ({ratingCount})
      </span>
    </div>
  );
}
