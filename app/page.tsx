import { fetchNytTopStories } from "@/services/newsService";
import { filterValidStories } from "@/lib/nyt";
import { createClient } from "@/prismicio";
import HomeClient from "@/app/components/HomeClient";

export default async function Home() {
  const client = createClient();

  // Parallel fetching
  const topStoriesPromise = fetchNytTopStories("world").catch(() => ({ results: [] }));

  const [topStoriesResponse, page1, page, page2, page3, page4, page5] = await Promise.all([
    topStoriesPromise,
    client.getSingle("mainnavigation"),
    client.getSingle("hamza"),
    client.getSingle("navbar"),
    client.getSingle("newscontentcard"),
    client.getSingle("topnews"),
    client.getSingle("simplefooter"),
  ]);

  const stories = filterValidStories(topStoriesResponse.results || []);

  return (
    <HomeClient
      initialStories={stories}
      slicesData={{ page1, page, page2, page3, page4, page5 }}
    />
  );
}
