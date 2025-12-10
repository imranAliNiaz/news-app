// app/search/page.tsx
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { getTopStories, searchNews } from "@/lib/nyt";
import { createClient } from "@/prismicio";
import SearchNewsGrid from "@/app/components/SearchNewsGrid";

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
    stories = await searchNews(query);
    title = `Search results for "${query}"`;
  } else {
    // Default to top stories (world) when no query
    const topStoriesData = await getTopStories("world");
    stories = topStoriesData.results.slice(0, 6);
    title = "Top Stories";
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6F8]">
      {/* Header */}
      <SliceZone slices={header.data.slices} components={components} />

      {/* Main content */}
      <main className="flex-1">
        {/* Search section */}
        <SliceZone slices={searchBar.data.slices} components={components} />

        {/* Search results with same UI as home */}
        <SearchNewsGrid stories={stories} title={title} />

        {/* Optional: show message if no matches */}
        {query && stories.length === 0 && (
          <p className="mx-auto max-w-3xl px-4 pb-16 text-center text-sm text-slate-500">
            No articles found matching{" "}
            <span className="font-semibold">"{query}"</span>.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <SliceZone slices={footer.data.slices} components={components} />
      </footer>
    </div>
  );
}
