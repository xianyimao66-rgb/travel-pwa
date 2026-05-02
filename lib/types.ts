// 目的地
export interface Destination {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  countryEn: string;
  image: string;
  description: string;
  descriptionZh?: string;
  shortDescription: string;
  tags: string[];
  rating: number;
  bestSeason?: string;
  avgBudget?: number;
  highlights: string[];
  quickFacts: {
    population: string;
    language: string;
    currency: string;
    timezone: string;
    airport: string;
    bestFor: string;
  };
}

// 旅行类型
export type TravelType = "solo" | "couple" | "family" | "friends";

// 旅行偏好
export type TravelPreference =
  | "history_culture"   // 人文历史
  | "nature_scenery"    // 自然风景
  | "food"              // 美食
  | "citywalk"          // Citywalk
  | "instagram"         // 网红打卡
  | "shopping"          // 购物
  | "outdoor_adventure" // 户外冒险
  | "art_culture";      // 文化艺术

// 预算档位
export type BudgetLevel = "budget" | "comfort" | "luxury";

// 每日行程
export interface DayPlan {
  day: number;
  title: string;
  intro?: string;
  description: string;
  activities: Activity[];
  meals: { type: "Breakfast" | "Lunch" | "Dinner"; recommendation: string; estimatedCost: number }[];
  transportTips?: string; // 当天的交通建议
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  duration: string;
  cost: number;
  image?: string;
}

export interface Meal {
  type: "Breakfast" | "Lunch" | "Dinner";
  recommendation: string;
  estimatedCost: number;
}

// 完整行程计划
export interface TripPlan {
  destination: string;
  days: number;
  travelers: number;
  travelType: TravelType;
  budgetLevel: BudgetLevel;
  preferences: TravelPreference[];
  overview: string;
  dayPlans: DayPlan[];
  totalEstimatedCost: number;
  tips: string[];
}

// 表单数据
export interface PlannerFormData {
  destination: string;
  days: number;
  travelers: number;
  travelType: TravelType;
  preferences: TravelPreference[];
  budgetLevel: BudgetLevel;
}

// 旧版兼容（保留以保持兼容性，但不再使用）
export type TripPlanParams = PlannerFormData;
