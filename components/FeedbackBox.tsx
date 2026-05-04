"use client";

import { useState } from "react";

export default function FeedbackBox() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "330261196@qq.com",
          subject: `💬 Feedback: ${window.location.pathname}`,
          plan: {
            destination: "User Feedback",
            days: 1,
            travelers: 0,
            travelType: "solo",
            budgetLevel: "comfort",
            preferences: [],
            overview: text.trim(),
            dayPlans: [{
              day: 1,
              title: "",
              description: text.trim(),
              activities: [],
              meals: [],
            }],
            totalEstimatedCost: 0,
            tips: [],
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(errData.error || "Failed to send");
      }

      setSubmitted(true);
      setText("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        {submitted ? (
          <div className="text-center animate-fadeIn">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              Thank You for Your Feedback! 🙏
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Your message has been sent to our team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              We Value Your Feedback
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Help us improve your travel planning experience
            </p>
            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report an issue..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        )}
        {error && (
          <p className="mt-2 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </section>
  );
}
