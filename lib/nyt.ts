// lib/nyt.ts

import {
  NytStory,
  TopStoriesResponse,
  NytMultimedia,
  NytSearchDoc,
} from "@/constants/types";

// Prefer NEXT_PUBLIC_NYT_API_KEY for client usage, fall back to server-only NYT_API_KEY
const NYT_API_KEY =
  process.env.NEXT_PUBLIC_NYT_API_KEY ?? process.env.NYT_API_KEY;

if (!NYT_API_KEY) {
  throw new Error("NYT_API_KEY is not defined in .env.local");
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

  // const res = await fetch(url.toString(), {
  //   next: { revalidate: 60 }, // cache for 1 minute
  // });

  const res = await fetch(url.toString(), {
    cache: "no-store",
  });


  if (!res.ok) {
    console.error("NYT Search API error", await res.text());
    throw new Error("Failed to fetch NYT search results");
  }

  const json = await res.json();
  const docs = json.response?.docs ?? [];



  const stories: NytStory[] = docs.map((doc: NytSearchDoc) => {
    const multimedia: NytMultimedia[] = [];

    if (Array.isArray(doc.multimedia) && doc.multimedia.length > 0) {
      console.log("🔎 ARTICLE:", doc.headline?.main);
      console.log("🖼 RAW multimedia (Array):", doc.multimedia);

      const imageCandidates = doc.multimedia.filter(
        (m) =>
          m.url &&
          (m.subtype === "xlarge" ||
            m.subtype === "jumbo" ||
            m.subtype === "superJumbo")
      );

      console.log("✅ IMAGE CANDIDATES:", imageCandidates);

      const best =
        imageCandidates[0] ??
        doc.multimedia.find((m) => m.url); // Fallback: Pick ANY image with a URL

      console.log("⭐ BEST IMAGE PICKED:", best);

      if (best?.url) {
        const absoluteUrl = best.url.startsWith("http")
          ? best.url
          : `https://static01.nyt.com/${best.url.replace(/^\//, "")}`;

        console.log("🌐 FINAL IMAGE URL:", absoluteUrl);

        multimedia.push({
          url: absoluteUrl,
          caption: best.caption || "",
          format: best.subtype || "unknown",
          height: best.height || 0,
          width: best.width || 0,
        });
      }
    } else if (doc.multimedia && typeof doc.multimedia === "object") {
      // Handle case where multimedia is an object (e.g. valid "sports" search results)
      console.log("🔎 ARTICLE:", doc.headline?.main);
      console.log("🖼 RAW multimedia (Object):", doc.multimedia);

      const m = doc.multimedia as any;
      const target = m.default || m.thumbnail; // Prefer default, fallback to thumbnail

      if (target && target.url) {
        multimedia.push({
          url: target.url,
          caption: m.caption || "",
          format: "default",
          height: target.height || 0,
          width: target.width || 0,
        });
        console.log("🌐 FINAL IMAGE URL (from Object):", target.url);
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


/**
 * 🧹 Filter out stories that are missing critical content
 * Returns only stories that have title, abstract, and at least one image
 */
export function filterValidStories(stories: NytStory[]): NytStory[] {
  return stories.filter((story) => {
    const hasTitle = story.title && story.title.trim().length > 0;
    const hasAbstract = story.abstract && story.abstract.trim().length > 0;
    const hasImage = story.multimedia && story.multimedia.length > 0 && story.multimedia[0].url;

    return hasTitle && hasAbstract && hasImage;
  });
}

/**
 * 🔍 Filter for Search Results (Lenient)
 * Allows stories without images, but requires title and URL.
 */
export function filterSearchStories(stories: NytStory[]): NytStory[] {
  return stories.filter((story) => {
    const hasTitle = story.title && story.title.trim().length > 0;
    const hasUrl = story.url && story.url.trim().length > 0;
    return hasTitle && hasUrl;
  });
}
