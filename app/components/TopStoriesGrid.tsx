"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { filterValidStories } from "@/lib/nyt";
import { NytStory } from "@/constants/types";
import { FiGrid, FiList } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { useNewsCategory } from "./NewsProvider";

interface TopStoriesGridProps {
  initialStories?: NytStory[];
  title?: string;
}

export default function TopStoriesGrid({
  initialStories = [],
  title = "Top Stories",
}: TopStoriesGridProps) {
  const { selectedCategory, setSelectedCategory } = useNewsCategory();
  const tabs = ["Latest Stories", "Politics", "Fashion"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedStory, setSelectedStory] = useState<NytStory | null>(null);
  const [stories, setStories] = useState<NytStory[]>(initialStories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(6);


  useEffect(() => {
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


  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10">






        {/* Tabs */}
        <div className="mb-2 flex h-[54px] max-w-[1368px] items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-[28px]">

          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "Latest Stories") setSelectedCategory("world");
                  else if (tab === "Politics") setSelectedCategory("politics");
                  else if (tab === "Fashion") setSelectedCategory("fashion");
                }}
                className={`cursor-pointer pb-[6px] text-[18px] leading-[1] tracking-normal transition font-[var(--font-poppins)] ${activeTab === tab
                  ? "border-b-2 border-red-500 font-semibold text-slate-900"
                  : "font-medium text-slate-600 hover:text-slate-900"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>


          <div className="hidden md:flex items-center">
            <button className="flex cursor-pointer items-center justify-center p-1 transition hover:opacity-80">
              <Image
                src="/icons/tab-icon.png"
                alt="View options"
                width={27.43}
                height={24}
              />
            </button>
          </div>
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
              <NewsCard
                key={story.url}
                story={story}
                onClick={() => setSelectedStory(story)}
              />
            ))}
          </div>
        )}


        {!loading && !error && stories.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No stories available for this category.</p>
          </div>
        )}


        {stories.length > visibleCount && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="rounded-md px-16 md:px-10 py-3 text-sm font-semibold transition   cursor-pointer"
              style={{

                color: "#C31815",
                border: "1px solid #C31815",
              }}
            >
              VIEW MORE
            </button>
          </div>
        )}
      </section>


      {selectedStory && (
        <NewsModal story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
    </>
  );
}

type NewsCardProps = {
  story: NytStory;
  onClick: () => void;
};

function NewsCard({ story, onClick }: NewsCardProps) {
  const img = story.multimedia?.[0];

  const published = new Date(story.published_date);
  const publishedLabel = published.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const author = story.byline?.replace(/^By\s+/i, "") || "New York Times";
  const sectionLabel = story.section ? story.section.toUpperCase() : "NEWS";

  return (
    <article
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition hover:-translate-y-1"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {img && (
        <div className="relative h-64 md:h-56 w-full">
          <Image
            src={img.url}
            alt={img.caption || story.title}
            fill
            className="object-cover"
          />

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
          <span className="font-medium text-slate-600">{publishedLabel}</span>
          <span className="text-slate-400">|</span>
          <span>By {author}</span>
          <span className="text-slate-400">|</span>
          <span>4 min read</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-10 border-t border-slate-200 pt-3 text-xs text-slate-500">
          <button
            className="flex items-center gap-1 hover:text-[#C31815]"
            onClick={(e) => e.stopPropagation()}
          >
            <AiFillHeart size={16} className="text-[#C31815]" />
            <span>28</span>
          </button>
          <button
            className="flex items-center gap-1 hover:text-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <FaRegComment size={14} />
            <span>72</span>
          </button>
          <button
            className="flex items-center gap-1 hover:text-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <BsBookmark size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function NewsModal({
  story,
  onClose,
}: {
  story: NytStory;
  onClose: () => void;
}) {
  const img = story.multimedia?.[0];

  const published = new Date(story.published_date);
  const publishedLabel = isNaN(published.getTime())
    ? ""
    : published.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const author = story.byline?.replace(/^By\s+/i, "") || "New York Times";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-50 mx-4 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl md:flex-row">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 text-2xl rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        <div className="relative h-80 sm:h-96 w-full md:h-auto md:w-1/2">
          {img && (
            <Image
              src={img.url}
              alt={img.caption || story.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex w-full flex-col gap-4 px-6 py-6 md:w-1/2 md:py-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#C31815]">
            Trending
          </span>

          <h2 className="text-xl font-semibold leading-snug text-slate-900 md:text-2xl">
            {story.title}
          </h2>

          <p className="text-sm leading-relaxed text-slate-600">
            {story.abstract}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            {publishedLabel && (
              <>
                <span>{publishedLabel}</span>
                <span className="text-slate-400">•</span>
              </>
            )}
            <span>By {author}</span>
            <span className="text-slate-400">•</span>
            <span>4 min read</span>
          </div>

          <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
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

          <div className="mt-4">
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#C31815] hover:underline"
            >
              Read full article →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
