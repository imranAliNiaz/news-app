import { NytStory, NytSearchDoc, NytMultimedia } from "@/types/types";


export function mapCategoryToSection(label: string): string {
  const validSections = [
    "arts", "automobiles", "books", "business", "fashion", "food",
    "health", "home", "insider", "magazine", "movies", "nyregion",
    "obituaries", "opinion", "politics", "realestate", "science",
    "sports", "sundayreview", "technology", "theater", "t-magazine",
    "travel", "upshot", "us", "world"
  ];

  const normalized = label.toLowerCase().trim();

  if (validSections.includes(normalized)) {
    return normalized;
  }
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

  return "world";
}
// Filter out stories that are missing critical content
export function filterValidStories(stories: NytStory[]): NytStory[] {
  if (!Array.isArray(stories)) return [];

  return stories.filter((story) => {
    const hasTitle = story.title && story.title.trim().length > 0;
    const hasAbstract = story.abstract && story.abstract.trim().length > 0;
    const hasImage = story.multimedia && story.multimedia.length > 0 && story.multimedia[0].url;

    return hasTitle && hasAbstract && hasImage;
  });
}



// Helper to transform Search Docs to NytStory format
export const mapSearchDocsToStories = (docs: NytSearchDoc[]): NytStory[] => {
  if (!Array.isArray(docs)) return [];

  return docs.map((doc) => {
    let imageMeta: NytMultimedia | null = null;


    if (Array.isArray(doc.multimedia) && doc.multimedia.length > 0) {
      const preferred = doc.multimedia.find(
        (m) =>
          m.url &&
          ["superJumbo", "jumbo", "xlarge"].includes(m.subtype || "")
      );

      const fallback = doc.multimedia.find((m) => m.url);
      const best = preferred || fallback;

      if (best?.url) {
        const url = best.url.startsWith("http")
          ? best.url
          : `https://static01.nyt.com/${best.url.replace(/^\//, "")}`;

        imageMeta = {
          url,
          caption: best.caption || "",
          format: best.subtype || "unknown",
          height: best.height || 0,
          width: best.width || 0,
          type: "image",
          subtype: best.subtype || "",
          copyright: "",
        };
      }
    }


    else if (doc.multimedia && typeof doc.multimedia === "object") {
      const m: any = doc.multimedia;
      const target = m.default || m.thumbnail;

      if (target?.url) {
        imageMeta = {
          url: target.url,
          caption: m.caption || "",
          format: "article",
          height: target.height || 0,
          width: target.width || 0,
          type: "image",
          subtype: "default",
          copyright: m.credit || "",
        };
      }
    }

    return {
      section: doc.section_name || "search",
      subsection: "",
      title: doc.headline.main,
      abstract:
        doc.abstract ||
        doc.lead_paragraph ||
        doc.snippet ||
        "",
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
      multimedia: imageMeta ? [imageMeta] : [],
      short_url: "",
    };
  });
};


export function filterSearchStories(stories: NytStory[]): NytStory[] {
  return filterValidStories(stories);
}
