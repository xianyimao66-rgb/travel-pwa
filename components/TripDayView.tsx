"use client";

import { useState } from "react";
import type { DayPlan } from "@/lib/types";

interface Props {
  plan: DayPlan;
}

const typeColors: Record<string, string> = {
  Breakfast: "bg-orange-100 text-orange-700 border-orange-200",
  Lunch: "bg-green-100 text-green-700 border-green-200",
  Dinner: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function TripDayView({ plan }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
      {/* Day header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white shadow-sm">
          {plan.day}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{plan.description}</p>
        </div>
        <span
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 space-y-4 animate-fadeIn">
          {/* Activities */}
          <div className="space-y-3">
            {plan.activities.map((activity, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-xl bg-gray-50 p-3.5 transition-colors hover:bg-blue-50"
              >
                <div className="min-w-[60px] text-center">
                  <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {activity.time}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    ⏱ {activity.duration} · 💰 ¥{activity.cost}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Transport tips */}
          {plan.transportTips && (
            <div className="rounded-xl bg-sky-50 p-3.5 ring-1 ring-sky-100">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-sky-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                    Transport Tips
                  </p>
                  <p className="mt-0.5 text-sm text-sky-700">
                    {plan.transportTips}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Meals */}
          {plan.meals.length > 0 && (
            <div className="rounded-xl bg-gray-50 p-3.5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Meal Suggestions
              </p>
              <div className="space-y-2">
                {plan.meals.map((meal, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border bg-white px-3.5 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
                          typeColors[meal.type] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {meal.type}
                      </span>
                      <span className="text-sm text-gray-700">
                        {meal.recommendation}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ¥{meal.estimatedCost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
