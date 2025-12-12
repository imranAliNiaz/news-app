// app/page.tsx
import { getTopStories } from "@/lib/nyt";
import { createClient } from "@/prismicio";
import HomeClient from "@/app/components/HomeClient";

export default async function Home() {
  const client = createClient();

  const [topStoriesData, page1, page, page2, page3, page4, page5] = await Promise.all([
    getTopStories("world"),
    client.getSingle("mainnavigation"),
    client.getSingle("hamza"),
    client.getSingle("navbar"),
    client.getSingle("newscontentcard"),
    client.getSingle("topnews"),
    client.getSingle("simplefooter"),
  ]);

  const stories = topStoriesData.results.slice(0, 6); // show first 6 cards

  return (
    <HomeClient
      initialStories={stories}
      slicesData={{ page1, page, page2, page3, page4, page5 }}
    />
  );
}
