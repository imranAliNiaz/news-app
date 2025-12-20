// app/search/page.tsx
import { getTopStories, searchNews, filterValidStories } from "@/lib/nyt";
import { createClient } from "@/prismicio";
import SearchClient from "@/app/components/SearchClient";

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const client = createClient();

  // 🔑 UNWRAP THE PROMISE
  const params = await searchParams;
  const query = params?.query?.trim() || "";

  const [header, searchBar, footer] = await Promise.all([
    client.getSingle("mainnavigation"),
    client.getSingle("searchbar"),
    client.getSingle("simplefooter"),
  ]);

  let stories;
  let title;

  if (query) {
    // Use NYT Article Search API
    const rawStories = await searchNews(query);
    stories = filterValidStories(rawStories);
    title = `Search results for "${query}"`;
  } else {
    // Default to top stories (world) when no query
    const topStoriesData = await getTopStories("world");
    stories = filterValidStories(topStoriesData.results);
    title = "Top Stories";
  }

  return (
    <SearchClient
      stories={stories}
      title={title}
      query={query}
      slicesData={{ header, searchBar, footer }}
    />
  );
}
