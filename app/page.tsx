import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import type { Destination } from "@/lib/types";

const popularDestinations: Destination[] = [
  {
    id: "beijing",
    name: "北京",
    image: "",
    description: "千年古都，融合历史与现代的东方魅力之城",
    tags: ["历史", "美食", "文化"],
    rating: 4.8,
  },
  {
    id: "shanghai",
    name: "上海",
    image: "",
    description: "魔都风情，繁华都市与弄堂文化的完美交汇",
    tags: ["都市", "购物", "夜生活"],
    rating: 4.7,
  },
  {
    id: "chengdu",
    name: "成都",
    image: "",
    description: "天府之国，美食天堂，慢生活的代名词",
    tags: ["美食", "熊猫", "休闲"],
    rating: 4.9,
  },
  {
    id: "xiamen",
    name: "厦门",
    image: "",
    description: "海上花园，文艺小清新的海滨城市",
    tags: ["海岛", "文艺", "美食"],
    rating: 4.6,
  },
  {
    id: "guilin",
    name: "桂林",
    image: "",
    description: "桂林山水甲天下，如诗如画的山水仙境",
    tags: ["自然", "山水", "徒步"],
    rating: 4.5,
  },
  {
    id: "dali",
    name: "大理",
    image: "",
    description: "风花雪月，苍山洱海间的诗意栖居",
    tags: ["古镇", "自然", "摄影"],
    rating: 4.7,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      {/* 头部 */}
      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            旅行规划
          </span>
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-500">
          AI 帮你规划完美旅程
        </p>
      </header>

      {/* 搜索入口 */}
      <Link
        href="/trip-planner"
        className="group relative mb-8 sm:mb-12 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-blue-200"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl shadow-sm">
          ✨
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            AI 智能规划行程
          </p>
          <p className="text-sm text-gray-400">
            输入目的地，立即生成专属行程
          </p>
        </div>
        <span className="text-gray-300 group-hover:text-blue-400 transition-colors">
          →
        </span>
      </Link>

      {/* 热门目的地 */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">热门目的地</h2>
          <Link
            href="/destinations"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 底部 */}
      <footer className="mt-12 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
        <p>旅行规划 · AI 驱动的智能助手</p>
      </footer>
    </div>
  );
}
