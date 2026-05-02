import Link from "next/link";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 目前行程数据暂存于 localStorage / state，
  // 后续从数据库/API获取
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← 返回首页
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <div className="text-5xl mb-4">🗺️</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          行程 #{id.slice(0, 8)}
        </h1>
        <p className="text-gray-500">
          此行程信息暂不支持直接查看，请从规划页面重新生成。
        </p>
        <Link
          href="/trip-planner"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-600 hover:to-indigo-600"
        >
          ✨ 创建新行程
        </Link>
      </div>
    </div>
  );
}
