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
      type: z.enum(["早餐", "午餐", "晚餐"]),
      recommendation: z.string(),
      estimatedCost: z.number(),
    })
  ),
});

const tripPlanSchema = z.object({
  destination: z.string(),
  days: z.number(),
  budget: z.number(),
  style: z.enum(["轻松", "平衡", "紧凑"]),
  overview: z.string(),
  dayPlans: z.array(dayPlanSchema),
  totalEstimatedCost: z.number(),
  tips: z.array(z.string()),
});

export async function generateTripPlan(
  params: TripPlanParams
): Promise<TripPlan> {
  const { object } = await generateObject({
    model: qwen("qwen-plus"),
    schema: tripPlanSchema,
    prompt: `你是一位专业的旅行规划师。请为以下旅行需求生成一个详细的行程计划。

目的地：${params.destination}
旅行天数：${params.days}天
每日预算：${params.budget}元/天
旅行风格：${params.style}（轻松=每天3-4个活动，平衡=每天5-6个活动，紧凑=每天7-8个活动）

请生成一份完整的 JSON 格式行程计划，包含：
1. 行程总览描述
2. 每天的详细安排（标题、描述、活动列表、三餐推荐）
3. 每个活动包含：时间、名称、描述、时长、预估费用
4. 总体预估总花费
5. 实用小贴士

注意：
- 活动时间要合理，早中晚分布均匀
- 费用要合理，符合每日预算
- 推荐当地特色美食
- 考虑合理的交通路线，避免绕路`,
  });

  return object as TripPlan;
}
