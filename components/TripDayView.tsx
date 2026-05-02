"use client";

import type { DayPlan } from "@/lib/types";

interface Props {
  plan: DayPlan;
}

export default function TripDayView({ plan }: Props) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
          {plan.day}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
          <p className="text-sm text-gray-500">{plan.description}</p>
        </div>
      </div>

      <div className="space-y-4">
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

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-blue-600 select-none">
          餐饮推荐
        </summary>
        <div className="mt-3 space-y-2">
          {plan.meals.map((meal, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-orange-50 px-3.5 py-2">
              <div>
                <span className="text-xs font-medium text-orange-600">
                  {meal.type}
                </span>
                <p className="text-sm text-gray-700">{meal.recommendation}</p>
              </div>
              <span className="text-xs text-gray-500">¥{meal.estimatedCost}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
