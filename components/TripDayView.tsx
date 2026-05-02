"use client";

import { useState } from "react";
import type { DayPlan } from "@/lib/types";

interface Props {
  plan: DayPlan;
}

export default function TripDayView({ plan }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden transition-all hover:shadow-md">
      {/* Day header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white shadow-sm">
          {plan.day}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900">{plan.title}</h3>
          {!expanded && (
            <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{plan.description}</p>
          )}
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 py-4 space-y-4">
          {/* Day intro — poetic diary style */}
          {plan.intro && (
            <p className="text-sm italic text-gray-500 border-l-2 border-blue-200 pl-3 leading-relaxed">
              {plan.intro}
            </p>
          )}

          {/* Day description — narrative flow */}
          {plan.description && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {plan.description}
            </p>
          )}

          {/* Activities — social media card style */}
          <div className="space-y-3">
            {plan.activities.map((activity, i) => (
              <div key={i} className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
                {/* Time badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    🕐 {activity.time}
                  </span>
                  <span className="text-xs text-gray-400">· {activity.duration}</span>
                  <span className="ml-auto text-xs font-medium text-gray-500">
                    💰 ~¥{activity.cost}
                  </span>
                </div>
                {/* Name — bold with icon */}
                <h4 className="font-semibold text-gray-900 text-sm leading-snug">
                  📍 {activity.name}
                </h4>
                {/* Description — warm and helpful */}
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>

          {/* Transport tips */}
          {plan.transportTips && (
            <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-4">
              <div className="flex items-start gap-2">
                <span className="text-base">🚖</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                    Getting Around
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {plan.transportTips}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Meals — compact food cards */}
          {plan.meals && plan.meals.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                🍜 Meals
              </p>
              <div className="grid gap-2">
                {plan.meals.map((meal, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-gray-600 border border-gray-200">
                        {meal.type === "Breakfast" ? "🌅" : meal.type === "Lunch" ? "☀️" : "🌙"} {meal.type}
                      </span>
                      <span className="text-sm text-gray-700 truncate">
                        {meal.recommendation}
                      </span>
                    </div>
                    <span className="shrink-0 ml-2 text-xs font-medium text-gray-500">
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
