import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination } from "@/lib/destinations";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dest = getDestination(id);

  if (!dest) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/destinations"
          className="hover:text-blue-600 transition-colors"
        >
          Destinations
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{dest.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {dest.name}
            </h1>
            <p className="text-lg text-gray-400 mt-1">
              {dest.nameEn}, {dest.countryEn}
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-yellow-50 px-3 py-1.5 text-sm font-semibold text-yellow-700">
            ★ {dest.rating}
          </span>
        </div>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          {dest.description}
        </p>
        {dest.descriptionZh && (
          <p className="mt-2 text-sm text-gray-400 italic">
            {dest.descriptionZh}
          </p>
        )}
      </div>

      {/* Quick Facts Grid */}
      <section className="mb-10 rounded-2xl bg-gray-50 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Facts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {[
            { label: "Population", value: dest.quickFacts.population },
            { label: "Language", value: dest.quickFacts.language },
            { label: "Currency", value: dest.quickFacts.currency },
            { label: "Timezone", value: dest.quickFacts.timezone },
            { label: "Airport", value: dest.quickFacts.airport },
            { label: "Best for", value: dest.quickFacts.bestFor },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                {f.label}
              </p>
              <p className="mt-1 text-gray-800 font-medium">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      {dest.highlights.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Why Visit {dest.name}
          </h2>
          <ul className="space-y-3">
            {dest.highlights.map((h, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600">
                  {i + 1}
                </span>
                <span className="text-gray-600 leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Best Time & Budget */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold">
            Best Season
          </p>
          <p className="mt-1 font-medium text-gray-900">
            {dest.bestSeason || "Year-round"}
          </p>
        </div>
        {dest.avgBudget && (
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-xs uppercase tracking-wide text-green-500 font-semibold">
              Avg. Daily Budget
            </p>
            <p className="mt-1 font-medium text-gray-900">
              ~¥{dest.avgBudget} (~${Math.round(dest.avgBudget / 7)})
            </p>
          </div>
        )}
      </section>

      {/* Tags */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2">
          {dest.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3.5 py-1.5 text-sm text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* CTA: AI Trip Planner */}
      <Link
        href={`/trip-planner?destination=${dest.name}`}
        className="group block rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-5 sm:p-6 text-white transition-all hover:shadow-lg"
      >
        <p className="text-lg font-semibold group-hover:underline">
          ✨ Plan Your {dest.name} Trip with AI
        </p>
        <p className="mt-1 text-sm text-blue-100">
          Get a personalized day-by-day itinerary in seconds
        </p>
      </Link>
    </div>
  );
}
