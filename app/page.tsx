import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { getPopularDestinations } from "@/lib/destinations";

export default function HomePage() {
  const destinations = getPopularDestinations(6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Hero */}
      <section className="mb-10 sm:mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Travel Planner
          </span>{" "}
          for China
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
          Discover China&apos;s most incredible destinations. Let AI create
          your perfect itinerary — from the Great Wall to hidden local gems.
        </p>
      </section>

      {/* AI Trip Planner CTA */}
      <Link
        href="/trip-planner"
        className="group relative mb-10 sm:mb-16 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 ring-1 ring-blue-100 transition-all hover:shadow-lg hover:ring-blue-200"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-2xl shadow-sm">
          ✨
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            Plan My Trip with AI
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            Tell us your destination, days, and budget. We&apos;ll build a
            personalized day-by-day itinerary.
          </p>
        </div>
        <span className="shrink-0 text-gray-300 group-hover:text-blue-400 transition-colors text-xl">
          →
        </span>
      </Link>

      {/* Popular Destinations */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Popular Destinations
          </h2>
          <Link
            href="/destinations"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 pt-10">
        {[
          { icon: "🧠", title: "AI-Powered", desc: "Smart itineraries tailored to your preferences in seconds" },
          { icon: "🗺️", title: "Local Insights", desc: "Curated recommendations from real travel experts" },
          { icon: "📱", title: "Works Offline", desc: "Save your trips and access them anywhere, anytime" },
        ].map((f) => (
          <div key={f.title} className="text-center">
            <span className="text-3xl">{f.icon}</span>
            <h3 className="mt-3 font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
        <p>Travel Planner · AI-powered trip planning for China</p>
      </footer>
    </div>
  );
}
