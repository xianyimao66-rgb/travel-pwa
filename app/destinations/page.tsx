import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { getAllDestinations } from "@/lib/destinations";

export default function DestinationsPage() {
  const destinations = getAllDestinations();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Destinations</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Destinations in China
      </h1>
      <p className="mt-2 text-gray-500 text-lg">
        Explore cities, landmarks, and hidden gems across China
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {destinations.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </div>
  );
}
