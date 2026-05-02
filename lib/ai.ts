import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import type { TripPlanParams, TripPlan } from "./types";

const qwen = createOpenAI({
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: process.env.QWEN_API_KEY ?? "",
});

const dayPlanSchema = z.object({
  day: z.number(),
  title: z.string(),
  description: z.string(),
  activities: z.array(
    z.object({
      time: z.string(),
      name: z.string(),
      description: z.string(),
      duration: z.string(),
      cost: z.number(),
    })
  ),
  meals: z.array(
    z.object({
      type: z.enum(["Breakfast", "Lunch", "Dinner"]),
      recommendation: z.string(),
      estimatedCost: z.number(),
    })
  ),
});

const tripPlanSchema = z.object({
  destination: z.string(),
  days: z.number(),
  budget: z.number(),
  style: z.enum(["Relaxed", "Balanced", "Intensive"]),
  overview: z.string(),
  dayPlans: z.array(dayPlanSchema),
  totalEstimatedCost: z.number(),
  tips: z.array(z.string()),
});

export async function generateTripPlan(
  params: TripPlanParams
): Promise<TripPlan> {
  const styleCN =
    params.style === "Relaxed"
      ? "轻松"
      : params.style === "Balanced"
        ? "平衡"
        : "紧凑";
  const styleDesc =
    params.style === "Relaxed"
      ? "3-4 activities per day"
      : params.style === "Balanced"
        ? "5-6 activities per day"
        : "7-8 activities per day";

  const { object } = await generateObject({
    model: qwen("qwen-plus"),
    schema: tripPlanSchema,
    prompt: `You are a professional travel planner. Create a detailed itinerary in JSON.

Destination: ${params.destination}
Days: ${params.days}
Daily Budget: ${params.budget} CNY/day
Style: ${styleCN} (${styleDesc})

Language: Respond in English. Keep food/cuisine names in Chinese with English explanation.

Generate a complete JSON itinerary with:
1. Overview description
2. Daily plans with schedule, activities, and meal recommendations
3. Each activity: time, name, description, duration, estimated cost
4. Total estimated cost
5. Practical tips for travelers

Notes:
- Spread activities through morning, afternoon, and evening
- Costs should be realistic for the daily budget
- Recommend local cuisine and hidden gems
- Consider logical route planning between attractions`,
  });

  return object as TripPlan;
}
