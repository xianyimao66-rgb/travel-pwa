// All 10 cities now have real JPEG images downloaded
// Files: public/images/destinations/{cityId}.jpg
const validCities = new Set([
  "shanghai",
  "chengdu",
  "guangzhou",
  "hangzhou",
  "nanjing",
  "shenzhen",
  "beijing",
  "zhangjiajie",
  "xiamen",
  "suzhou",
]);

export function isValidImage(cityId: string): boolean {
  return validCities.has(cityId);
}
