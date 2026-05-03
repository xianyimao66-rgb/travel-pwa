"use client";

import { useState, useEffect } from "react";

interface FeedbackEntry {
  id: string;
  text: string;
  timestamp: string;
  page: string;
  read: boolean;
}

export default function AdminFeedbackPage() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      fetchFeedback(saved);
    }
  }, []);

  const fetchFeedback = async (t: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        headers: { "X-Admin-Token": t },
      });

      if (res.status === 401) {
        setError("Invalid token");
        setAuthenticated(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setFeedback(data.feedback || []);
      setAuthenticated(true);
      localStorage.setItem("admin_token", t);
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    fetchFeedback(token.trim());
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setToken("");
    setFeedback([]);
    localStorage.removeItem("admin_token");
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-sm text-gray-500 mb-4">
            Enter your admin token to view feedback submissions
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin token"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={!token.trim() || loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {loading ? "Loading..." : "Access"}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Feedback</h1>
          <p className="text-sm text-gray-500">
            {feedback.length} submission{feedback.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No feedback yet. Share the site!
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {entry.page}
                </span>
                <span className="text-sm text-gray-400 shrink-0">
                  {new Date(entry.timestamp).toLocaleString("zh-CN", {
                    timeZone: "Asia/Shanghai",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {entry.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
