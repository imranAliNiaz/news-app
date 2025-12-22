// // lib/nyt.ts
// const API_KEY = process.env.NYT_API_KEY;

// if (!API_KEY) {
//     throw new Error("NYT_API_KEY is not defined in .env.local");
// }

// export interface NytMultimedia {
//     url: string;
//     caption: string;
//     format: string;
//     height: number;
//     width: number;
// }

// export interface NytStory {
//     title: string;
//     abstract: string;
//     url: string;
//     byline: string;
//     published_date: string;
//     section: string;
//     multimedia?: NytMultimedia[];
// }

// interface TopStoriesResponse {
//     results: NytStory[];
// }

// export async function getTopStories(section: string): Promise<TopStoriesResponse> {
//     const res = await fetch(
//         `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${API_KEY}`,
//         { next: { revalidate: 300 } }
//     );

//     if (!res.ok) {
//         throw new Error("Failed to fetch NYT stories");
//     }

//     return res.json();
// }

// /* ---------- SEARCH API ---------- */

// interface NytSearchDoc {
//     web_url: string;
//     abstract: string | null;
//     lead_paragraph: string | null;
//     pub_date: string;
//     section_name: string | null;
//     byline?: {
//         original?: string | null;
//     };
//     headline: {
//         main: string;
//     };
//     multimedia?: {
//         url: string; // relative path
//         caption?: string;
//         subtype?: string;
//         height?: number;
//         width?: number;
//     }[];
// }

// interface NytSearchMeta {
//     hits: number;
//     offset: number;
//     time: number;
// }

// interface NytSearchApiResponse {
//     response: {
//         docs: NytSearchDoc[];
//         meta: NytSearchMeta;
//     };
// }

// export interface SearchResult {
//     stories: NytStory[];
//     currentPage: number;
//     totalPages: number;
//     totalHits: number;
// }

// const SEARCH_PAGE_SIZE = 10; // NYT Article Search returns 10 per page

// export async function searchArticles(
//     query: string,
//     page: number = 1
// ): Promise<SearchResult> {
//     const trimmed = query.trim();
//     if (!trimmed) {
//         return { stories: [], currentPage: 1, totalPages: 0, totalHits: 0 };
//     }

//     const apiPage = page > 0 ? page - 1 : 0; // NYT pages are 0-indexed

//     const res = await fetch(
//         `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(
//             trimmed
//         )}&page=${apiPage}&api-key=${API_KEY}`,
//         { next: { revalidate: 60 } }
//     );

//     if (!res.ok) {
//         throw new Error("Failed to search NYT articles");
//     }

//     const data: NytSearchApiResponse = await res.json();
//     const docs = data.response.docs ?? [];
//     const hits = data.response.meta?.hits ?? 0;
//     const totalPages =
//         hits > 0 ? Math.ceil(hits / SEARCH_PAGE_SIZE) : docs.length > 0 ? 1 : 0;

//     const stories: NytStory[] = docs.map((doc) => {
//         const multimedia =
//             doc.multimedia && doc.multimedia.length
//                 ? doc.multimedia.map((m) => ({
//                     url: m.url.startsWith("http")
//                         ? m.url
//                         : `https://www.nytimes.com/${m.url}`,
//                     caption: m.caption || "",
//                     format: m.subtype || "",
//                     height: m.height || 0,
//                     width: m.width || 0,
//                 }))
//                 : undefined;

//         return {
//             title: doc.headline.main,
//             abstract: doc.abstract || doc.lead_paragraph || "",
//             url: doc.web_url,
//             byline: doc.byline?.original || "",
//             published_date: doc.pub_date,
//             section: doc.section_name || "News",
//             multimedia,
//         };
//     });

//     return {
//         stories,
//         currentPage: page,
//         totalPages,
//         totalHits: hits,
//     };
// }
