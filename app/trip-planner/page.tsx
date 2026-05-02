import Link from "next/link";
import PlannerForm from "@/components/PlannerForm";

export default async function TripPlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const { destination } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← 返回首页
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          AI 行程规划
        </h1>
        <p className="mt-1 text-gray-500">
          填写以下信息，AI 将为你量身定制专属行程
        </p>
      </div>

      {/* 用 key 确保表单在参数变化时重置 */}
      <PlannerForm key={destination ?? "default"} />
    </div>
  );
}
