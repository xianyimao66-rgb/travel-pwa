import Link from "next/link";
import PlannerForm from "@/components/PlannerForm";

export default function TripPlannerPage() {

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          AI Trip Planner
        </h1>
        <p className="mt-1 text-gray-500">
          Tell us about your trip and we&apos;ll build a personalized itinerary
          just for you
        </p>
      </div>

      {/* Form */}
      <PlannerForm />
    </div>
  );
}
