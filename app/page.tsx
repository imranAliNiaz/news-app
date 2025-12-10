// app/page.tsx (or pages/index.tsx depending on your setup)
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { getTopStories } from "@/lib/nyt";
import { createClient } from "@/prismicio";
import TopStoriesGrid from "@/app/components/TopStoriesGrid";

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

  const stories = topStoriesData.results.slice(0, 6); // show first 6 cards, adjust as you like

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#E7F3FA]">
      <SliceZone slices={page1.data.slices} components={components} />



      <SliceZone slices={page.data.slices} components={components} />
      <SliceZone slices={page2.data.slices} components={components} />
      {/* Dynamic NYT section */}
      <TopStoriesGrid stories={stories} />
      {/* <SliceZone slices={page3.data.slices} components={components} /> */}
      <SliceZone slices={page4.data.slices} components={components} />
      <SliceZone slices={page5.data.slices} components={components} />
    </div>
  );
}
