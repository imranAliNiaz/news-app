"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { NewsModalProps } from "@/types/types";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";



export default function NewsModal({ story, onClose }: NewsModalProps) {
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

                    <span className="font-body text-[14px] font-semibold leading-[2.1] tracking-[0.02em] text-[#C31815]">
                        Trending
                    </span>


                    <h2 className="font-heading text-[18px] md:text-[24px] font-semibold leading-[27px] text-slate-900">
                        {story.title}
                    </h2>


                    <p className="font-description text-[15px] font-normal leading-[22px] text-slate-600">
                        {story.abstract}
                    </p>


                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-[13px] font-normal leading-[1.65] text-slate-500">
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
                            className="font-body text-[14px] font-semibold leading-[2.1] tracking-[0.02em] text-[#C31815] hover:underline"
                        >
                            Read full article →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
