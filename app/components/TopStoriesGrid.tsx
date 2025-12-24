"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { NytStory, TopStoriesGridProps, NewsCardProps } from "@/types/types";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategory } from "@/store/newsSlice";
import { useTopStories } from "@/hooks/useTopStories";
import NewsModal from "./NewsModal";



export default function TopStoriesGrid({
  initialStories = [],
  title = "Top Stories",
}: TopStoriesGridProps) {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.news.selectedCategory);
  const { data: articles, isLoading: loading, error } = useTopStories(selectedCategory);

  const tabs = ["Latest Stories", "Politics", "Fashion"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedStory, setSelectedStory] = useState<NytStory | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const displayStories = articles || initialStories;

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory]);


  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-0 lg:py-10">

        {/* Tabs */}
        <div className="mb-2 flex h-[54px] max-w-[1368px] items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-[28px]">

          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "Latest Stories") dispatch(setCategory("world"));
                  else if (tab === "Politics") dispatch(setCategory("politics"));
                  else if (tab === "Fashion") dispatch(setCategory("fashion"));
                }}
                className={`cursor-pointer pb-[6px] text-[18px] leading-[1] tracking-normal transition font-body text-[#2A2A2A] ${activeTab === tab
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
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
        )}


        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayStories.slice(0, visibleCount).map((story) => (
              <NewsCard
                key={story.url}
                story={story}
                onClick={() => setSelectedStory(story)}
              />
            ))}
          </div>
        )}


        {!loading && !error && displayStories.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No stories available for this category.</p>
          </div>
        )}


        {displayStories.length > visibleCount && (
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

function NewsCard({ story, onClick }: NewsCardProps) {
  const img = story.multimedia?.[0];

  const published = new Date(story.published_date);
  const publishedLabel = published.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const author = story.byline?.replace(/^By\s+/i, "") || "New York Times";

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
        <h3 className="mb-3 font-heading text-[18px] font-semibold leading-[27px] text-slate-900">
          {story.title}
        </h3>
        <p className="mb-5 font-description text-[15px] font-normal leading-[22px] text-slate-600">
          {story.abstract}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-[13px] font-normal leading-[1.65] text-slate-500">
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



