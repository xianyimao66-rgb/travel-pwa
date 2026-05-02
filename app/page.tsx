import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { getPopularDestinations } from "@/lib/destinations";

export default function HomePage() {
  const destinations = getPopularDestinations(6);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.15)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
            Your{" "}
            <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              AI Travel Planner
            </span>{" "}
            for China
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100/80 sm:text-xl">
            Discover China&apos;s most incredible destinations. Let AI create
            your perfect itinerary — from the Great Wall to hidden local gems.
            Personalized for your style and budget.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/trip-planner"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>✨</span>
              Start Planning
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50"
            >
              Explore Destinations
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Top Destinations */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Top Destinations
            </h2>
            <p className="mt-1 text-gray-500">
              Curated picks from our most popular cities
            </p>
          </div>
          <Link
            href="/destinations"
            className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
          >
            View All
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-6 py-3 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
          >
            View All Destinations
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why Travel Planner?
            </h2>
            <p className="mt-2 text-gray-500">
              Everything you need for the perfect China trip
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-2xl text-white shadow-sm group-hover:shadow-md transition-shadow">
                🤖
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                AI-Powered Planning
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Tell us your preferences, travel type, and budget. Our AI
                creates a personalized day-by-day itinerary in seconds.
              </p>
            </div>

            <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl text-white shadow-sm group-hover:shadow-md transition-shadow">
                🏯
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Curated Destinations
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Explore 10 hand-picked Chinese cities with detailed guides,
                highlights, and insider tips from local experts.
              </p>
            </div>

            <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl text-white shadow-sm group-hover:shadow-md transition-shadow">
                📧
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Save & Share
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Save your itineraries and share them with travel companions.
                Access your plans anywhere — even offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Ready to Plan Your China Adventure?
        </h2>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          Join thousands of travelers who&apos;ve discovered China with AI-powered
          itineraries. Your perfect trip is just a click away.
        </p>
        <Link
          href="/trip-planner"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg hover:-translate-y-0.5"
        >
          <span>✨</span>
          Start Planning Your Trip
        </Link>
      </section>
    </div>
  );
}
