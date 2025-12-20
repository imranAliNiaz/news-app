import { useState, useEffect } from "react";
import Image from "next/image";
import { NytStory } from "@/constants/types";

import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";

interface SearchNewsGridProps {
  stories: NytStory[];
  title?: string;
}

export default function SearchNewsGrid({
  stories,
  title = "Search Results",
}: SearchNewsGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [stories]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Main title */}
      <div className="h-14 mb-4 flex items-center justify-between bg-white">
        <h2 className="text-xl ml-2 md:text-2xl font-semibold text-slate-900">{title}</h2>
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.slice(0, visibleCount).map((story) => (
          <SearchNewsCard key={story.url} story={story} />
        ))}
      </div>

      {/* VIEW MORE BUTTON */}
      {stories.length > visibleCount && (
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
    </section>
  );
}

function SearchNewsCard({ story }: { story: NytStory }) {
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
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition hover:-translate-y-1">
      {/* Image with category pill */}
      {img && img.url && (
        <div className="relative h-56 w-full">
          <Image
            src={img.url}
            alt={img.caption || story.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-5">
        <h3 className="mb-3 text-lg font-semibold leading-snug text-slate-900">
          {story.title}
        </h3>

        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          {story.abstract}
        </p>

        {/* Meta row */}
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

        {/* Bottom actions */}
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
