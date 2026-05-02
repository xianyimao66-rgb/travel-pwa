import Link from "next/link";
import type { Destination } from "@/lib/types";

interface Props {
  destination: Destination;
}

export default function DestinationCard({ destination }: Props) {
  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:ring-blue-200"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-indigo-500 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white text-6xl opacity-30">
          🌍
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <span>★</span>
            <span>{destination.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {destination.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {destination.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {destination.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
