"use client";

import { useState } from "react";
import { generateTripPlan } from "@/lib/ai";
import type { TripPlan, TripPlanParams } from "@/lib/types";
import TripDayView from "./TripDayView";

export default function PlannerForm() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(500);
  const [style, setStyle] = useState<TripPlanParams["style"]>("Balanced");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [showAllTips, setShowAllTips] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError("请输入目的地");
      return;
    }
    setLoading(true);
    setError("");
    setPlan(null);
    setShowAllTips(false);
    try {
      const result = await generateTripPlan({
        destination: destination.trim(),
        days,
        budget,
        style,
      });
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 表单 */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            目的地
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="例如：北京、东京、巴黎..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            旅行天数（{days}天）
          </label>
          <input
            type="range"
            min={1}
            max={14}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1天</span>
            <span>14天</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            每日预算（¥{budget}/天）
          </label>
          <input
            type="range"
            min={100}
            max={5000}
            step={100}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>¥100</span>
            <span>¥5000</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            旅行风格
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["Relaxed", "Balanced", "Intensive"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  style === s
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              正在生成行程...
            </span>
          ) : (
            "✨ 生成行程"
          )}
        </button>
      </form>

      {/* 结果 */}
      {plan && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-md">
            <h2 className="text-xl font-bold">{plan.destination}</h2>
            <p className="mt-2 text-sm text-blue-100">{plan.overview}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/20 px-3 py-1">
                📅 {plan.days}天
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1">
                💰 ¥{plan.totalEstimatedCost}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1">
                🎯 {plan.style}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {plan.dayPlans.map((dayPlan) => (
              <TripDayView key={dayPlan.day} plan={dayPlan} />
            ))}
          </div>

          {/* 小贴士 */}
          {plan.tips.length > 0 && (
            <div className="rounded-2xl bg-yellow-50 p-5 ring-1 ring-yellow-100">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-800 mb-3">
                💡 实用小贴士
              </h4>
              <ul className="space-y-2">
                {(showAllTips ? plan.tips : plan.tips.slice(0, 3)).map(
                  (tip, i) => (
                    <li
                      key={i}
                      className="text-sm text-yellow-700 flex items-start gap-2"
                    >
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  )
                )}
              </ul>
              {plan.tips.length > 3 && (
                <button
                  onClick={() => setShowAllTips(!showAllTips)}
                  className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-800"
                >
                  {showAllTips ? "收起" : `展开全部 ${plan.tips.length} 条`}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
