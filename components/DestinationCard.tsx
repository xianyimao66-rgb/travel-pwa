import Link from "next/link";
import type { Destination } from "@/lib/types";
import { isValidImage } from "@/lib/images";

export default function DestinationCard({
  destination: d,
}: {
  destination: Destination;
}) {
  const imageUrl = `/images/destinations/${d.id}.jpg`;
  const hasImage = isValidImage(d.id);

  return (
    <Link
      href={`/destinations/${d.id}`}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image / Gradient Background */}
      <div
        className={`aspect-[4/3] w-full relative overflow-hidden ${
          hasImage ? "" : "bg-gradient-to-br from-blue-600/80 to-indigo-800/80"
        }`}
      >
        {hasImage ? (
          <img
            src={imageUrl}
            alt={d.nameEn}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : null}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="text-white">
              <h3 className="text-lg font-bold leading-tight drop-shadow-sm">
                {d.name} · {d.nameEn}
              </h3>
              <p className="mt-1 text-sm text-white/80 line-clamp-2 drop-shadow-sm">
                {d.shortDescription}
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-white/20 backdrop-blur-sm px-2 py-0.5 text-xs font-semibold text-white">
              ★ {d.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom tags section */}
      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
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
