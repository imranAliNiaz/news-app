import { useState, useEffect } from "react";
import Image from "next/image";
import { NytStory } from "@/constants/types";

import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";

import { filterValidStories } from "@/lib/nyt";
import { useNewsCategory } from "./NewsProvider";
import NewsModal from "./NewsModal";

interface SearchNewsGridProps {
  stories: NytStory[];
  title?: string;
}

export default function SearchNewsGrid({
  stories: initialStories,
  title = "Search Results",
}: SearchNewsGridProps) {
  const { selectedCategory } = useNewsCategory();
  // We'll use local state for stories so we can update them when category changes
  const [stories, setStories] = useState<NytStory[]>(initialStories);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedStory, setSelectedStory] = useState<NytStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if we are in "search mode" (initial props) or "category mode" (updates)
  // Actually, we can just detect if selectedCategory changes.
  // But wait, initially selectedCategory might be "world" (default).
  // If we are on search page with query, we want to show query results first.
  // Only when user CLICKS a category (changing context) should we update.
  // But context is shared. If user searches, they are on /search. selectedCategory is whatever it was.
  // To detect "User clicked category", we rely on the fact that MainNavigation updates selectedCategory.
  // We need a ref to track if it's the first render (search results) or subsequent (category switch).

  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // On mount, we just show initialStories.
    // If selectedCategory changes AFTER mount, we fetch new stories.
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      setVisibleCount(6);

      try {
        const response = await fetch(
          `/api/top-stories?section=${encodeURIComponent(selectedCategory)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stories");
        }

        const data = await response.json();
        const validStories = filterValidStories(data.results);
        setStories(validStories);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load news. Please try again.");
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [selectedCategory]);

  useEffect(() => {
    // If initialStories changes (e.g. new search), update stories
    // But we need to be careful not to overwrite category selection if that was the intent.
    // However, if the parent passes new props (new search query), we should probably respect it.
    if (initialStories) {
      setStories(initialStories);
      setIsFirstRender(true); // Reset so we don't immediately refetch based on category
    }
  }, [initialStories]);

  useEffect(() => {
    setVisibleCount(6);
  }, [stories]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">

      <div className="h-14 mb-4 flex items-center justify-between bg-white">
        <h2 className="text-xl ml-2 md:text-2xl font-semibold text-slate-900">{title}</h2>
      </div>


      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C31815]"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.slice(0, visibleCount).map((story) => (
            <SearchNewsCard
              key={story.url}
              story={story}
              onClick={() => setSelectedStory(story)}
            />
          ))}
        </div>
      )}


      {!loading && !error && stories.length > visibleCount && (
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="cursor-pointer rounded-md px-16 md:px-10 py-3 text-sm font-semibold transition hover:bg-[#C31815] hover:text-white"
            style={{
              backgroundColor: "#ffffff",
              color: "#C31815",
              border: "1px solid #C31815",
            }}
          >
            VIEW MORE
          </button>
        </div>
      )}

      {selectedStory && (
        <NewsModal story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
    </section>
  );
}

function SearchNewsCard({ story, onClick }: { story: NytStory; onClick: () => void }) {
  const img = story.multimedia?.[0];


  const published = new Date(story.published_date);
  const publishedLabel = isNaN(published.getTime())
    ? ""
    : published.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const author =
    story.byline?.replace(/^By\s+/i, "") || "New York Times";
  const sectionLabel = story.section
    ? story.section.toUpperCase()
    : "NEWS";

  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >

      {img && img.url ? (
        <div className="relative h-56 w-full">
          <Image
            src={img.url}
            alt={img.caption || story.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-56 w-full items-center justify-center bg-slate-100 text-slate-400">
          <span className="text-sm">No image available</span>
        </div>
      )}


      <div className="flex flex-1 flex-col px-6 py-5">
        <h3 className="mb-3 text-lg font-semibold leading-snug text-slate-900">
          {story.title}
        </h3>

        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          {story.abstract}
        </p>


        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          {publishedLabel && (
            <>
              <span className="font-medium text-slate-600">
                {publishedLabel}
              </span>
              <span className="text-slate-400">|</span>
            </>
          )}
          <span>By {author}</span>
          <span className="text-slate-400">|</span>
          <span>4 min read</span>
        </div>


        <div className="mt-4 flex items-center justify-center gap-10 border-t border-slate-200 pt-3 text-xs text-slate-500">
          <button className="flex items-center gap-1 hover:text-[#C31815]">
            <AiFillHeart size={16} className="text-[#C31815]" />
            <span>28</span>
          </button>
          <button className="flex items-center gap-1 hover:text-slate-700">
            <FaRegComment size={14} />
            <span>72</span>
          </button>
          <button className="flex items-center gap-1 hover:text-slate-700">
            <BsBookmark size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
