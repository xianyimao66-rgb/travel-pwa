import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { getAllDestinations } from "@/lib/destinations";

export default function DestinationsPage() {
  const destinations = getAllDestinations();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Destinations</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Destinations in China
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          Explore cities, landmarks, and hidden gems across China
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>

      {/* Stats footer */}
      <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center ring-1 ring-blue-100">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{destinations.length}</span> curated destinations
          {" · "}
          <span className="font-semibold text-blue-600">AI-powered</span> itinerary generator
          {" · "}
          <span className="font-semibold text-blue-600">Free</span> to use
        </p>
      </div>
    </div>
  );
}
