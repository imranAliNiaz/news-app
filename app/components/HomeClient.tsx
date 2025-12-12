"use client";

import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import TopStoriesGrid from "@/app/components/TopStoriesGrid";
import { NewsProvider } from "@/app/components/NewsProvider";
import type { NytStory } from "@/lib/nyt";

interface HomeClientProps {
    initialStories: NytStory[];
    slicesData: {
        page1: any;
        page: any;
        page2: any;
        page3: any;
        page4: any;
        page5: any;
    };
}

export default function HomeClient({ initialStories, slicesData }: HomeClientProps) {
    return (
        <NewsProvider>
            <div className="min-h-screen overflow-x-hidden bg-[#E7F3FA]">
                <SliceZone slices={slicesData.page1.data.slices} components={components} />

                <SliceZone slices={slicesData.page.data.slices} components={components} />
                <SliceZone slices={slicesData.page2.data.slices} components={components} />

                {/* Dynamic NYT section with data-attribute for smooth scrolling */}
                <div data-news-section>
                    <TopStoriesGrid initialStories={initialStories} />
                </div>

                {/* <SliceZone slices={slicesData.page3.data.slices} components={components} /> */}
                <SliceZone slices={slicesData.page4.data.slices} components={components} />
                <SliceZone slices={slicesData.page5.data.slices} components={components} />
            </div>
        </NewsProvider>
    );
}
