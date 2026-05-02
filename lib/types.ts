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
  type: "Breakfast" | "Lunch" | "Dinner";
  recommendation: string;
  estimatedCost: number;
}

// 完整行程计划
export interface TripPlan {
  destination: string;
  days: number;
  budget: number;
  style: "Relaxed" | "Balanced" | "Intensive";
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
  style: "Relaxed" | "Balanced" | "Intensive";
}
