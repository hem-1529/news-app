import { fetchFeed, type Article } from "@/lib/rss";

const FEEDS = [
  { url: "https://zenn.dev/feed", name: "Zenn" },
  { url: "https://qiita.com/popular-items/feed", name: "Qiita" },
];

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <h2 className="text-base font-semibold text-gray-900 leading-snug">
        {article.title}
      </h2>
      <div className="mt-auto flex flex-col gap-1">
        <span className="text-xs font-medium text-blue-600">
          {article.source}
        </span>
        <time dateTime={article.publishedAt} className="text-xs text-gray-400">
          {formatDate(article.publishedAt)}
        </time>
      </div>
    </a>
  );
}

function ErrorCard({ name, message }: { name: string; message: string }) {
  return (
    <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
      <p className="text-sm font-medium text-red-500">{name} の取得に失敗しました</p>
      <p className="text-xs text-gray-400 mt-1">{message}</p>
    </div>
  );
}

export default async function NewsFeed() {
  const results = await Promise.allSettled(
    FEEDS.map((f) => fetchFeed(f.url, f.name, 5))
  );

  const articles: Article[] = [];
  const errors: { name: string; message: string }[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      errors.push({
        name: FEEDS[i].name,
        message: result.reason instanceof Error ? result.reason.message : String(result.reason),
      });
    }
  });

  // Sort by date descending
  articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <>
      {errors.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {errors.map((e) => (
            <ErrorCard key={e.name} name={e.name} message={e.message} />
          ))}
        </div>
      )}
      {articles.length === 0 ? (
        <p className="text-center text-gray-400">記事が取得できませんでした。</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={`${article.source}-${i}`} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
