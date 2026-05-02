import Link from "next/link";
import type { Destination } from "@/lib/types";
import DestinationCard from "@/components/DestinationCard";

const allDestinations: Destination[] = [
  { id: "beijing", name: "北京", image: "", description: "千年古都，融合历史与现代的东方魅力之城", tags: ["历史", "美食", "文化"], rating: 4.8 },
  { id: "shanghai", name: "上海", image: "", description: "魔都风情，繁华都市与弄堂文化的完美交汇", tags: ["都市", "购物", "夜生活"], rating: 4.7 },
  { id: "chengdu", name: "成都", image: "", description: "天府之国，美食天堂，慢生活的代名词", tags: ["美食", "熊猫", "休闲"], rating: 4.9 },
  { id: "xiamen", name: "厦门", image: "", description: "海上花园，文艺小清新的海滨城市", tags: ["海岛", "文艺", "美食"], rating: 4.6 },
  { id: "guilin", name: "桂林", image: "", description: "桂林山水甲天下，如诗如画的山水仙境", tags: ["自然", "山水", "徒步"], rating: 4.5 },
  { id: "dali", name: "大理", image: "", description: "风花雪月，苍山洱海间的诗意栖居", tags: ["古镇", "自然", "摄影"], rating: 4.7 },
  { id: "hangzhou", name: "杭州", image: "", description: "人间天堂，西湖烟雨中的诗意江南", tags: ["江南", "自然", "文化"], rating: 4.8 },
  { id: "chongqing", name: "重庆", image: "", description: "8D魔幻城市，火锅与山城的独特魅力", tags: ["美食", "夜景", "都市"], rating: 4.6 },
  { id: "sanya", name: "三亚", image: "", description: "热带海滨，阳光沙滩的度假天堂", tags: ["海岛", "度假", "潜水"], rating: 4.5 },
];

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← 返回首页
        </Link>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">所有目的地</h1>
      <p className="text-gray-500 mb-8">探索精彩目的地，开启你的下一次旅行</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allDestinations.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </div>
  );
}
