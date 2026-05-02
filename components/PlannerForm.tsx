"use client";

import { useState, useCallback } from "react";
import { generateTripPlan } from "@/lib/ai";
import type {
  TripPlan,
  TravelType,
  TravelPreference,
  BudgetLevel,
} from "@/lib/types";
import { destinations } from "@/lib/destinations";
import TripDayView from "./TripDayView";

const travelTypes: { value: TravelType; label: string; icon: string }[] = [
  { value: "solo", label: "Solo", icon: "🧑" },
  { value: "couple", label: "Couple", icon: "💑" },
  { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Friends", icon: "👫" },
];

const preferences: {
  value: TravelPreference;
  label: string;
  icon: string;
}[] = [
  { value: "history_culture", label: "History & Culture", icon: "🏛️" },
  { value: "nature_scenery", label: "Nature & Scenery", icon: "🏔️" },
  { value: "food", label: "Food & Culinary", icon: "🍜" },
  { value: "citywalk", label: "City Walk", icon: "🚶" },
  { value: "instagram", label: "Instagram Spots", icon: "📸" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "outdoor_adventure", label: "Outdoor Adventure", icon: "🧗" },
  { value: "art_culture", label: "Art & Culture", icon: "🎨" },
];

const budgetLevels: {
  value: BudgetLevel;
  label: string;
  desc: string;
  icon: string;
}[] = [
  { value: "budget", label: "Budget", desc: "¥300-500/day", icon: "💰" },
  { value: "comfort", label: "Comfort", desc: "¥600-1200/day", icon: "✨" },
  { value: "luxury", label: "Luxury", desc: "¥1500+/day", icon: "👑" },
];

export default function PlannerForm() {
  const [destination, setDestination] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [travelType, setTravelType] = useState<TravelType>("solo");
  const [selectedPreferences, setSelectedPreferences] = useState<
    TravelPreference[]
  >(["food", "history_culture"]);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("comfort");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [showAllTips, setShowAllTips] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  const filteredCities = destinations.filter(
    (d) =>
      destination &&
      (d.nameEn.toLowerCase().includes(destination.toLowerCase()) ||
        d.name.includes(destination))
  );

  const togglePreference = useCallback((pref: TravelPreference) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref]
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError("Please enter or select a destination");
      return;
    }
    if (selectedPreferences.length === 0) {
      setError("Please select at least one travel preference");
      return;
    }
    setLoading(true);
    setError("");
    setPlan(null);
    setShowAllTips(false);
    setEmailSent(false);
    try {
      const result = await generateTripPlan({
        destination: destination.trim(),
        days,
        travelers,
        travelType,
        preferences: selectedPreferences,
        budgetLevel,
      });
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendToEmail = async () => {
    if (!emailTo || !emailTo.includes('@')) return;
    setSending(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo, itinerary: plan }),
      });
      if (res.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
    } catch (e) {
      console.error('Send failed', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-5"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Tell Us About Your Trip
        </h2>

        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Destination
          </label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search city or type any destination..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-10 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {showSuggestions && filteredCities.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    setDestination(city.name);
                    setShowSuggestions(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-blue-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="text-gray-600">{city.name}</span>
                  <span className="text-gray-400">{city.nameEn}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    ★ {city.rating}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Days & Travelers row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Days
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDays(Math.max(1, days - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center text-lg font-semibold text-gray-900">
                {days}
              </span>
              <button
                type="button"
                onClick={() => setDays(Math.min(14, days + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Travelers
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center text-lg font-semibold text-gray-900">
                {travelers}
              </span>
              <button
                type="button"
                onClick={() => setTravelers(Math.min(10, travelers + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Travel type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Travel Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {travelTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTravelType(t.value)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  travelType === t.value
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="text-lg mb-0.5">{t.icon}</div>
                <div>{t.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Travel Preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {preferences.map((p) => {
              const selected = selectedPreferences.includes(p.value);
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => togglePreference(p.value)}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    selected
                      ? "bg-blue-500 text-white shadow-sm ring-2 ring-blue-300 ring-offset-1"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200"
                  }`}
                >
                  <span className="mr-1">{p.icon}</span>
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Budget Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {budgetLevels.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setBudgetLevel(b.value)}
                className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  budgetLevel === b.value
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="text-lg">{b.icon}</div>
                <div className="font-semibold">{b.label}</div>
                <div className="text-xs opacity-75">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-600 hover:to-indigo-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating Your Itinerary...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>✨</span>
              Generate My Itinerary
            </span>
          )}
        </button>
      </form>

      {/* Results */}
      {plan && (
        <div className="space-y-4 animate-fadeIn">
          {/* Overview card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6 text-white shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold">{plan.destination}</h2>
                <p className="mt-1 text-sm text-blue-100">
                  {plan.travelers} traveler{plan.travelers > 1 ? "s" : ""} ·{" "}
                  {plan.days} days · {plan.travelType} trip
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              {plan.overview}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                📅 {plan.days} Days
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                💰 ¥{plan.totalEstimatedCost.toLocaleString()} Total
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                🏷️ {plan.budgetLevel}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                🎯 {plan.preferences?.length || 0} Interests
              </span>
            </div>
          </div>

          {/* Day plans */}
          <div className="space-y-3">
            {plan.dayPlans.map((dayPlan) => (
              <TripDayView key={dayPlan.day} plan={dayPlan} />
            ))}
          </div>

          {/* Transport tips summary */}
          {plan.dayPlans.some((d) => d.transportTips) && (
            <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-5 ring-1 ring-sky-100">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-sky-800 mb-3">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Transport Tips Summary
              </h4>
              <div className="space-y-2">
                {plan.dayPlans
                  .filter((d) => d.transportTips)
                  .map((d) => (
                    <div key={d.day} className="text-sm text-sky-700">
                      <span className="font-semibold">Day {d.day}:</span>{" "}
                      {d.transportTips}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {plan.tips.length > 0 && (
            <div className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-3">
                💡 Travel Tips
              </h4>
              <ul className="space-y-2">
                {(showAllTips ? plan.tips : plan.tips.slice(0, 3)).map(
                  (tip, i) => (
                    <li
                      key={i}
                      className="text-sm text-amber-700 flex items-start gap-2"
                    >
                      <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      <span>{tip}</span>
                    </li>
                  )
                )}
              </ul>
              {plan.tips.length > 3 && (
                <button
                  onClick={() => setShowAllTips(!showAllTips)}
                  className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
                >
                  {showAllTips
                    ? "Show less"
                    : `Show all ${plan.tips.length} tips`}
                </button>
              )}
            </div>
          )}

          {/* Send to email */}
          <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              📧 Send Itinerary to Your Email
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={handleSendToEmail}
                disabled={sending || !emailTo.includes('@')}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : emailSent ? '✅ Sent!' : 'Send'}
              </button>
            </div>
            {emailSent && (
              <p className="mt-2 text-sm text-green-600">Itinerary sent to {emailTo}!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
