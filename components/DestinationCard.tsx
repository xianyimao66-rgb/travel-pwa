import Link from "next/link";
import type { Destination } from "@/lib/types";

// 城市对应的 emoji 图标
const cityEmojis: Record<string, string> = {
  beijing: "🏯",
  shanghai: "🌆",
  guangzhou: "🥟",
  shenzhen: "🏢",
  chengdu: "🐼",
  hangzhou: "🌊",
  zhangjiajie: "🏔️",
  suzhou: "🌿",
  xiamen: "🏖️",
  nanjing: "🏛️",
};

export default function DestinationCard({
  destination: d,
}: {
  destination: Destination;
}) {
  return (
    <Link
      href={`/destinations/${d.id}`}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-blue-200"
    >
      {/* Image placeholder */}
      <div className="aspect-[4/3] w-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
        <span className="text-5xl opacity-40">
          {cityEmojis[d.id] || "🗺️"}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {d.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {d.nameEn}, {d.countryEn}
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
            ★ {d.rating}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {d.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {d.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
