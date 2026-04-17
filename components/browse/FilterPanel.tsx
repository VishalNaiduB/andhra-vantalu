"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  MEAL_TYPE_LABELS,
  REGION_LABELS,
  SPICE_LEVELS,
  OCCASION_LABELS,
  DIFFICULTY_LABELS,
} from "@/lib/constants";

type FilterGroup = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

const filterGroups: FilterGroup[] = [
  {
    key: "meal",
    label: "Meal Type",
    options: Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    key: "diet",
    label: "Diet",
    options: [
      { value: "veg", label: "🟢 Veg" },
      { value: "nonveg", label: "🔴 Non-Veg" },
    ],
  },
  {
    key: "region",
    label: "Region",
    options: Object.entries(REGION_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    key: "spice",
    label: "Spice Level",
    options: Object.entries(SPICE_LEVELS).map(([value, { label, emoji }]) => ({
      value,
      label: `${emoji} ${label}`,
    })),
  },
  {
    key: "occasion",
    label: "Occasion",
    options: Object.entries(OCCASION_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    key: "difficulty",
    label: "Difficulty",
    options: Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({ value, label })),
  },
];

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key);
      if (current === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/browse?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push("/browse");
  }, [router]);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="space-y-4">
      {filterGroups.map((group) => (
        <div key={group.key}>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-brass-500">
            {group.label}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map((opt) => {
              const isActive = searchParams.get(group.key) === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilter(group.key, opt.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-turmeric-500 text-white"
                      : "border border-brass-200 bg-white text-tamarind-400 hover:border-turmeric-400"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Healthy toggle */}
      <button
        onClick={() =>
          setFilter("healthy", searchParams.get("healthy") ? "" : "true")
        }
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          searchParams.get("healthy")
            ? "bg-curry-leaf-500 text-white"
            : "border border-curry-leaf-200 bg-curry-leaf-50 text-curry-leaf-700 hover:bg-curry-leaf-100"
        }`}
      >
        🌿 Healthy Only
      </button>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs text-curry-red-500 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
