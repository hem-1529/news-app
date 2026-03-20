export type Article = {
  title: string;
  link: string;
  publishedAt: string;
  source: string;
};

function extractCdata(xml: string, tag: string): string {
  // Matches <tag>...</tag> with optional CDATA wrapper
  const re = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    "i"
  );
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

function extractAttrFromTag(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, "i");
  const m = xml.match(re);
  return m ? m[1] : "";
}

function parseItems(xml: string, sourceName: string, limit: number): Article[] {
  // RSS 2.0 — <item> blocks
  const rssItems = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  if (rssItems.length > 0) {
    return rssItems.slice(0, limit).map((m) => {
      const item = m[1];
      return {
        title: extractCdata(item, "title"),
        link: extractCdata(item, "link"),
        publishedAt: extractCdata(item, "pubDate"),
        source: sourceName,
      };
    });
  }

  // Atom — <entry> blocks
  const atomEntries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)];
  return atomEntries.slice(0, limit).map((m) => {
    const entry = m[1];
    return {
      title: extractCdata(entry, "title"),
      link: extractAttrFromTag(entry, "link", "href"),
      publishedAt:
        extractCdata(entry, "published") || extractCdata(entry, "updated"),
      source: sourceName,
    };
  });
}

export async function fetchFeed(
  url: string,
  sourceName: string,
  limit = 5
): Promise<Article[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`${sourceName}: HTTP ${res.status}`);
  const xml = await res.text();
  return parseItems(xml, sourceName, limit);
}
