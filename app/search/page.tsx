import { searchNytNews, fetchNytTopStories } from "@/services/newsService";
import { filterValidStories, mapSearchDocsToStories } from "@/lib/nyt";
import { createClient } from "@/prismicio";
import SearchClient from "@/app/components/SearchClient";
import { NytStory } from "@/types/types";

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const client = createClient();

  const params = await searchParams;
  const query = params?.query?.trim() || "";

  const [header, searchBar, footer] = await Promise.all([
    client.getSingle("mainnavigation"),
    client.getSingle("searchbar"),
    client.getSingle("simplefooter"),
  ]);

  let stories: NytStory[] = [];
  let title = "Latest News";

  if (query) {
    try {
      const rawStories = await searchNytNews(query);
      stories = filterValidStories(rawStories);
      title = `Search results for "${query}"`;
    } catch (e) {
      stories = [];
    }
  } else {
    try {
      const topStoriesData = await fetchNytTopStories("world");
      stories = filterValidStories(topStoriesData.results);
    } catch (e) {
      stories = [];
    }
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
