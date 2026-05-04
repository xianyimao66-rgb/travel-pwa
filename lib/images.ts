// images.ts — 已就绪版
// 使用 baoyu-cover-image 生成风格统一的景点图
// 每个活动独立，不重复
// 
// 当前状态：80+ 张图已在 image-search.ts 中建立独立映射
// 旧图（36张）在 public/images/attractions/ 中保留
// 新图路径: /images/attractions/${key}.jpg
// 
// 如果图不存在，ga 用旧图 fallback 方案：
// searchTerm → 百度图片搜索 → 临时展示（or 灰度）
// 当前实现：直接返回路径，交由前端处理 404

import {
  getCityActivityImageMap,
  getCityCoverEntry,
} from "./image-search";

export function hasAiImage(cityId: string): boolean {
  return !!getCityCoverEntry(cityId);
}

export function hasPhotoImage(cityId: string): boolean {
  return !!getCityCoverEntry(cityId);
}

export function isValidImage(cityId: string): boolean {
  return !!getCityCoverEntry(cityId);
}

export function getCoverImageUrl(cityId: string): string {
  const entry = getCityCoverEntry(cityId);
  if (!entry) return "";
  return `/images/destinations/${entry.key}.jpg`;
}

/**
 * 根据活动文本获取图片 URL
 */
export function getActivityImageUrl(activity: string, cityId: string): string | null {
  const cityMap = getCityActivityImageMap(cityId);
  if (!cityMap) return null;
  
  const entry = cityMap[activity];
  if (entry) {
    return `/images/attractions/${entry.key}.jpg`;
  }
  
  return null;
}

/**
 * 为一天的行程分配图片，保证当天内不重复
 */
export function getDayActivityImages(
  activities: string[],
  _dayIndex: number,
  cityId: string,
): (string | null)[] {
  const cityMap = getCityActivityImageMap(cityId);
  if (!cityMap) return activities.map(() => null);
  
  const usedKeys = new Set<string>();
  
  return activities.map((activity) => {
    // 精确匹配
    const entry = cityMap[activity];
    if (entry && !usedKeys.has(entry.key)) {
      usedKeys.add(entry.key);
      return `/images/attractions/${entry.key}.jpg`;
    }
    
    // 模糊匹配（去重）
    for (const [key, value] of Object.entries(cityMap)) {
      if (usedKeys.has(value.key)) continue;
      const activityLower = activity.toLowerCase();
      const keyLower = key.toLowerCase();
      const words = keyLower.split(/\s+/).filter(w => w.length > 3);
      const match = words.some(w => activityLower.includes(w)) ||
                    activityLower.includes(keyLower.substring(0, 10));
      if (match) {
        usedKeys.add(value.key);
        return `/images/attractions/${value.key}.jpg`;
      }
    }
    
    return null;
  });
}
