"use client";

import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import TopStoriesGrid from "@/app/components/TopStoriesGrid";

import { HomeClientProps } from "@/types/types";

export default function HomeClient({ initialStories, slicesData }: HomeClientProps) {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#F1F2F3]">
            <SliceZone slices={slicesData.page1.data.slices} components={components} />
            <SliceZone slices={slicesData.page.data.slices} components={components} />
            <SliceZone slices={slicesData.page2.data.slices} components={components} />

            <div data-news-section>
                <TopStoriesGrid initialStories={initialStories} />
            </div>

            <SliceZone slices={slicesData.page4.data.slices} components={components} />
            <SliceZone slices={slicesData.page5.data.slices} components={components} />
        </div>
    );
}
