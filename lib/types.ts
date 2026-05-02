// 目的地
export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  tags: string[];
  rating: number;
}

// 每日行程
export interface DayPlan {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  meals: Meal[];
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  duration: string;
  cost: number;
}

export interface Meal {
  type: "早餐" | "午餐" | "晚餐";
  recommendation: string;
  estimatedCost: number;
}

// 完整行程计划
export interface TripPlan {
  destination: string;
  days: number;
  budget: number;
  style: "轻松" | "平衡" | "紧凑";
  overview: string;
  dayPlans: DayPlan[];
  totalEstimatedCost: number;
  tips: string[];
}

// 生成参数
export interface TripPlanParams {
  destination: string;
  days: number;
  budget: number;
  style: "轻松" | "平衡" | "紧凑";
}
