import { Suspense } from "react";
import NewsFeed from "@/app/components/NewsFeed";

function FeedSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="mt-auto flex flex-col gap-1">
            <div className="h-3 bg-blue-100 rounded w-12" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tech News まとめ</h1>
          <p className="text-sm text-gray-500 mt-1">
            Zenn・Qiita の最新記事をお届け
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Suspense fallback={<FeedSkeleton />}>
          <NewsFeed />
        </Suspense>
      </main>
    </div>
  );
}
