import { NytStory, NytSearchDoc } from "@/types/types";

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
  if (!Array.isArray(stories)) return [];

  return stories.filter((story) => {
    const hasTitle = story.title && story.title.trim().length > 0;
    const hasAbstract = story.abstract && story.abstract.trim().length > 0;
    const hasImage = story.multimedia && story.multimedia.length > 0 && story.multimedia[0].url;

    return hasTitle && hasAbstract && hasImage;
  });
}

/**
 * 🔍 Helper to transform Search Docs to NytStory format
 */
export const mapSearchDocsToStories = (docs: NytSearchDoc[]): NytStory[] => {
  if (!Array.isArray(docs)) return [];

  return docs.map((doc) => ({
    section: doc.section_name || "search",
    subsection: "",
    title: doc.headline.main,
    abstract: doc.abstract || doc.snippet || "",
    url: doc.web_url,
    uri: doc.uri,
    byline: doc.byline?.original || "By New York Times",
    item_type: "Article",
    updated_date: doc.pub_date,
    created_date: doc.pub_date,
    published_date: doc.pub_date,
    material_type_facet: "",
    kicker: doc.headline.kicker || "",
    des_facet: [],
    org_facet: [],
    per_facet: [],
    geo_facet: [],
    multimedia: doc.multimedia,
    short_url: "",
  }));
};

/**
 * 🔍 Filter for Search Results (Wrapper)
 */
export function filterSearchStories(stories: NytStory[]): NytStory[] {
  return filterValidStories(stories);
}
