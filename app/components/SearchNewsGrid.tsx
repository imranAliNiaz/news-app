import { useState, useEffect } from "react";
import Image from "next/image";
import { NytStory } from "@/types/types";

import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";

import { useAppSelector } from "@/store/hooks";
import { useTopStories } from "@/hooks/useTopStories";
import NewsModal from "./NewsModal";

interface SearchNewsGridProps {
  stories: NytStory[];
  title?: string;
}

export default function SearchNewsGrid({
  stories: initialStories,
  title = "Search Results",
}: SearchNewsGridProps) {
  const selectedCategory = useAppSelector((state) => state.news.selectedCategory);

  // Hook always runs.
  const { data: categoryStories, isLoading: categoryLoading, error: categoryError } = useTopStories(selectedCategory);

  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedStory, setSelectedStory] = useState<NytStory | null>(null);

  // Logic: 
  // If initialStories provided (Search Page Result), show them initially.
  // If selectedCategory changes, user wants to see category news.
  // We use a flag or just check if selectedCategory matches 'world' (default) ?? 
  // No, easier: track if we are in "Search Mode".
  // If query is present (passed from parent), we are in search mode.
  // BUT the parent SearchPage passes `stories` directly.
  // If user clicks a category in `MainNavigation`, `selectedCategory` updates.
  // We want to switch to showing `categoryStories`.

  const [showCategoryNews, setShowCategoryNews] = useState(false);
  const [prevCategory, setPrevCategory] = useState(selectedCategory);

  useEffect(() => {
    if (selectedCategory !== prevCategory) {
      setShowCategoryNews(true);
      setPrevCategory(selectedCategory);
    }
  }, [selectedCategory, prevCategory]);

  // If props.stories change (new search), reset to show search results
  useEffect(() => {
    setShowCategoryNews(false);
  }, [initialStories]);

  useEffect(() => {
    setVisibleCount(6);
  }, [showCategoryNews, initialStories, categoryStories]);

  const displayStories = showCategoryNews ? (categoryStories || []) : initialStories;
  const loading = showCategoryNews ? categoryLoading : false;
  const error = showCategoryNews ? (categoryError ? "Failed to load" : null) : null;





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
          {typeof error === "string" ? error : "An error occurred"}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayStories.slice(0, visibleCount).map((story) => (
            <SearchNewsCard
              key={story.url}
              story={story}
              onClick={() => setSelectedStory(story)}
            />
          ))}
        </div>
      )}


      {!loading && !error && displayStories.length > visibleCount && (
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
        {/* 🟥 HEADING */}
        <h3 className="mb-3 font-heading text-[18px] font-semibold leading-[27px] text-slate-900">
          {story.title}
        </h3>

        {/* 🟩 DESCRIPTION */}
        <p className="mb-5 font-description text-[15px] font-normal leading-[22px] text-slate-600">
          {story.abstract}
        </p>

        {/* ⚫ META ROW */}
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-[13px] font-normal leading-[1.65] text-slate-500">
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

