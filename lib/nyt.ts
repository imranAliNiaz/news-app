// lib/nyt.ts

// Prefer NEXT_PUBLIC_NYT_API_KEY for client usage, fall back to server-only NYT_API_KEY
const NYT_API_KEY =
  process.env.NEXT_PUBLIC_NYT_API_KEY ?? process.env.NYT_API_KEY;

if (!NYT_API_KEY) {
  throw new Error("NYT_API_KEY is not defined in .env.local");
}

export interface NytMultimedia {
  url: string;
  caption?: string;
  format?: string;
  height?: number;
  width?: number;
}

export interface NytStory {
  title: string;
  abstract: string;
  url: string;
  byline: string;
  published_date: string;
  section: string;
  multimedia?: NytMultimedia[];
}

interface TopStoriesResponse {
  results: NytStory[];
}

/**
 * 📰 Fetch top stories for a section (world, business, sports, etc.)
 */
export async function getTopStories(
  section: string
): Promise<TopStoriesResponse> {
  const res = await fetch(
    `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${NYT_API_KEY}`,
    {
      // revalidate every 5 minutes (optional)
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch NYT stories");
  }

  return res.json();
}

/**
 * 🔍 Filter a list of stories by a query string (local search only).
 * It checks title, abstract, section and byline.
 */
export function filterStories(stories: NytStory[], query: string): NytStory[] {
  const trimmed = query.trim();
  if (!trimmed) return stories;

  const lower = trimmed.toLowerCase();

  return stories.filter((story) => {
    const title = story.title?.toLowerCase() || "";
    const abstract = story.abstract?.toLowerCase() || "";
    const section = story.section?.toLowerCase() || "";
    const byline = story.byline?.toLowerCase() || "";

    return (
      title.includes(lower) ||
      abstract.includes(lower) ||
      section.includes(lower) ||
      byline.includes(lower)
    );
  });
}

/**
 * 🔍 Convenience function:
 * fetch top stories for a section and return only the ones matching the query.
 */
export async function searchTopStories(
  section: string,
  query: string
): Promise<NytStory[]> {
  const data = await getTopStories(section);
  return filterStories(data.results, query);
}

/**
 * 🔎 NYT Article Search API
 * Full-text search across all NYT articles.
 */
export async function searchNews(query: string): Promise<NytStory[]> {
  const url = new URL(
    "https://api.nytimes.com/svc/search/v2/articlesearch.json"
  );
  url.searchParams.set("q", query);
  url.searchParams.set("api-key", NYT_API_KEY || "");
  url.searchParams.set("sort", "relevance"); // or "newest"

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 }, // cache for 1 minute
  });

  if (!res.ok) {
    console.error("NYT Search API error", await res.text());
    throw new Error("Failed to fetch NYT search results");
  }

  const json = await res.json();
  const docs = json.response?.docs ?? [];

  const stories: NytStory[] = docs.map((doc: any) => {
    // ✅ Pick a "best" image if multimedia exists
    let multimedia: NytMultimedia[] = [];

    if (Array.isArray(doc.multimedia) && doc.multimedia.length > 0) {
      // Prefer the widest image
      const best = [...doc.multimedia].sort(
        (a, b) => (b.width ?? 0) - (a.width ?? 0)
      )[0];


      const rawUrl: string = best?.url ?? "";

      // Article Search usually returns something like "images/2024/01/01/..."
      let absoluteUrl = rawUrl;
      if (rawUrl && !rawUrl.startsWith("http")) {
        if (rawUrl.startsWith("/")) {
          absoluteUrl = `https://static01.nyt.com${rawUrl}`;
        } else {
          absoluteUrl = `https://static01.nyt.com/${rawUrl}`;
        }
      }

      if (absoluteUrl) {
        multimedia = [
          {
            url: absoluteUrl,
            caption: best.caption,
            format: best.subtype,
            height: best.height,
            width: best.width,
          },
        ];
      }
    }

    return {
      url: doc.web_url,
      title: doc.headline?.main ?? "",
      abstract: doc.abstract || doc.lead_paragraph || "",
      byline: doc.byline?.original || "",
      published_date: doc.pub_date,
      section: doc.section_name || "News",
      multimedia,
    };
  });

  return stories;
}

/**
 * 🗂️ Map a navigation label to a valid NYT API section
 * Supports automatic mapping with fallback to "world"
 */
export function mapCategoryToSection(label: string): string {
  const validSections = [
    "arts", "automobiles", "books", "business", "fashion", "food",
    "health", "home", "insider", "magazine", "movies", "nyregion",
    "obituaries", "opinion", "politics", "realestate", "science",
    "sports", "sundayreview", "technology", "theater", "t-magazine",
    "travel", "upshot", "us", "world"
  ];

  const normalized = label.toLowerCase().trim();

  // Direct match
  if (validSections.includes(normalized)) {
    return normalized;
  }

  // Common mappings
  const mappings: Record<string, string> = {
    "tech": "technology",
    "entertainment": "arts",
    "movies": "movies",
    "film": "movies",
    "real estate": "realestate",
    "property": "realestate",
    "usa": "us",
    "united states": "us",
    "international": "world",
    "global": "world",
  };

  if (mappings[normalized]) {
    return mappings[normalized];
  }

  // Fallback to world
  return "world";
}

