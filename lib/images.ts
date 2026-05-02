// City IDs that have valid real images (not HTML placeholder garbage)
const validImageCache: Record<string, boolean> = {};
let initialized = false;

// JPEG magic bytes + known valid city image IDs from manual inspection
// beijing.jpg, suzhou.jpg, xiamen.jpg are HTML garbage (404 pages) — exclude them
const validCities = new Set([
  "shanghai",
  "chengdu",
  "guangzhou",
  "hangzhou",
  "nanjing",
  "shenzhen",
  "zhangjiajie",
]);

export function isValidImage(cityId: string): boolean {
  return validCities.has(cityId);
}
