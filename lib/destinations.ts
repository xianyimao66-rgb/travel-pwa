import type { Destination } from "./types";

export const destinations: Destination[] = [
  {
    id: "beijing",
    name: "北京",
    nameEn: "Beijing",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "A city where 3,000 years of history meets cutting-edge modernity. From the Forbidden City to futuristic skyscrapers, Beijing is China's political, cultural, and historical heart.",
    descriptionZh:
      "三千年古城与现代化大都市的完美融合。故宫、长城、胡同，每一处都诉说着这座城市的传奇。",
    shortDescription: "Ancient capital, modern marvel",
    tags: ["History", "Culture", "Food", "Architecture"],
    rating: 4.8,
    bestSeason: "Spring (Mar-May) & Autumn (Sep-Nov)",
    avgBudget: 800,
    highlights: [
      "Walk the Great Wall — one of the New Seven Wonders of the World",
      "Explore the Forbidden City, the world's largest palace complex",
      "Cycle through ancient Hutongs (traditional alleyways)",
      "Savor authentic Peking Duck, a culinary masterpiece",
      "Visit the Temple of Heaven, where emperors prayed for harvest",
    ],
    quickFacts: {
      population: "21.54 million",
      language: "Mandarin Chinese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8 (same all year)",
      airport: "Beijing Capital (PEK) + Beijing Daxing (PKX)",
      bestFor: "History buffs, foodies, culture seekers",
    },
    // TODO: 添加 Unsplash 图片
  },
  {
    id: "shanghai",
    name: "上海",
    nameEn: "Shanghai",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "China's most cosmopolitan city, where futuristic Pudong skyscrapers gaze across the Huangpu River at colonial-era Bund buildings.",
    shortDescription: "The pearl of the Orient",
    tags: ["都市", "购物", "夜生活"],
    rating: 4.7,
    bestSeason: "Spring & Autumn",
    avgBudget: 1000,
    highlights: [],
    quickFacts: {
      population: "24.87 million",
      language: "Mandarin Chinese, Shanghainese",
      currency: "CNY",
      timezone: "UTC+8",
      airport: "Shanghai Pudong (PVG) + Shanghai Hongqiao (SHA)",
      bestFor: "Urban explorers, shoppers, nightlife",
    },
  },
];

// 获取单个目的地
export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

// 获取热门目的地（用于首页展示）
export function getPopularDestinations(count: number = 6): Destination[] {
  return destinations.slice(0, count);
}

// 获取所有目的地
export function getAllDestinations(): Destination[] {
  return destinations;
}
