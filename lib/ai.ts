import type { PlannerFormData, TripPlan } from "./types";

export async function generateTripPlan(
  params: PlannerFormData
): Promise<TripPlan> {
  const response = await fetch("/api/ai-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Request failed: ${response.status}`);
  }

  const data: TripPlan = await response.json();
  return data;
}
