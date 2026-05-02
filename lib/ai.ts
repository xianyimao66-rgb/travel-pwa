import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import type { PlannerFormData, TripPlan } from "./types";

const qwen = createOpenAI({
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: process.env.QWEN_API_KEY ?? "",
});

const activitySchema = z.object({
  time: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  cost: z.number(),
});

const dayPlanSchema = z.object({
  day: z.number(),
  title: z.string(),
  description: z.string(),
  activities: z.array(activitySchema),
  meals: z.array(
    z.object({
      type: z.enum(["Breakfast", "Lunch", "Dinner"]),
      recommendation: z.string(),
      estimatedCost: z.number(),
    })
  ),
  transportTips: z.string().optional(),
});

const tripPlanSchema = z.object({
  destination: z.string(),
  days: z.number(),
  travelers: z.number(),
  travelType: z.enum(["solo", "couple", "family", "friends"]),
  budgetLevel: z.enum(["budget", "comfort", "luxury"]),
  preferences: z.array(z.string()),
  overview: z.string(),
  dayPlans: z.array(dayPlanSchema),
  totalEstimatedCost: z.number(),
  tips: z.array(z.string()),
});

const preferenceLabels: Record<string, string> = {
  history_culture: "History & Culture",
  nature_scenery: "Nature & Scenery",
  food: "Food & Culinary",
  citywalk: "City Walk",
  instagram: "Instagram-worthy Spots",
  shopping: "Shopping",
  outdoor_adventure: "Outdoor & Adventure",
  art_culture: "Art & Culture",
};

export async function generateTripPlan(
  params: PlannerFormData
): Promise<TripPlan> {
  const travelTypeDesc: Record<string, string> = {
    solo: "solo traveler (efficient, budget-friendly, social spots)",
    couple: "couple (romantic, cozy dining, scenic views, less walking)",
    family: "family (kid-friendly, less crowded spots, moderate pace)",
    friends: "friends (fun group activities, nightlife, energetic)",
  };

  const budgetLabel =
    params.budgetLevel === "budget"
      ? "Budget (300-500 CNY/day per person, street food, public transport, free attractions)"
      : params.budgetLevel === "comfort"
        ? "Comfort (600-1200 CNY/day per person, nice restaurants, metro/taxi, paid attractions)"
        : "Luxury (1500-4000+ CNY/day per person, fine dining, private car, VIP experiences)";

  const prefNames = params.preferences
    .map((p) => preferenceLabels[p] || p)
    .join(", ");

  const { object } = await generateObject({
    model: qwen("qwen-plus"),
    schema: tripPlanSchema,
    prompt: `You are a professional travel planner for China. Create a detailed, personalized itinerary in JSON.

USER PROFILE:
- Destination: ${params.destination}
- Duration: ${params.days} days
- Travelers: ${params.travelers}
- Travel Type: ${travelTypeDesc[params.travelType] || params.travelType}
- Budget Level: ${budgetLabel}
- Interests: ${prefNames || "General sightseeing"}

REQUIREMENTS:
1. All text in English. Keep food names in Chinese with English explanation in parentheses.
2. Activities should match the travel type and interests specified.
3. Budget allocation should match the budget level.
4. Include realistic transportation tips between attractions.
5. Each day should have 4-6 activities spread across morning, afternoon, and evening.
6. Meal recommendations should be practical and suit the budget level.

OUTPUT FORMAT - Return complete JSON:
{
  "destination": "${params.destination}",
  "days": ${params.days},
  "travelers": ${params.travelers},
  "travelType": "${params.travelType}",
  "budgetLevel": "${params.budgetLevel}",
  "preferences": [${params.preferences.map((p) => `"${p}"`).join(", ")}],
  "overview": "Brief overview of the trip...",
  "dayPlans": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Day description",
      "activities": [
        {
          "time": "09:00",
          "name": "Activity name",
          "description": "What to do and why it's great",
          "duration": "2 hours",
          "cost": 0
        }
      ],
      "meals": [
        { "type": "Breakfast", "recommendation": "Place and dish", "estimatedCost": 30 }
      ],
      "transportTips": "How to get between places today"
    }
  ],
  "totalEstimatedCost": 0,
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Generate realistic, practical itineraries with accurate costs in CNY.`,
  });

  return object as TripPlan;
}
