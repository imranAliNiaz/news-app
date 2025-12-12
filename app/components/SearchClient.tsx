"use client";

import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import SearchNewsGrid from "@/app/components/SearchNewsGrid";
import { NewsProvider } from "@/app/components/NewsProvider";
import type { NytStory } from "@/lib/nyt";

interface SearchClientProps {
    stories: NytStory[];
    title: string;
    query: string;
    slicesData: {
        header: any;
        searchBar: any;
        footer: any;
    };
}

export default function SearchClient({ stories, title, query, slicesData }: SearchClientProps) {
    return (
        <NewsProvider>
            <div className="flex min-h-screen flex-col bg-[#F4F6F8]">
                {/* Header */}
                <SliceZone slices={slicesData.header.data.slices} components={components} />

                {/* Main content */}
                <main className="flex-1">
                    {/* Search section */}
                    <SliceZone slices={slicesData.searchBar.data.slices} components={components} />

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
                    <SliceZone slices={slicesData.footer.data.slices} components={components} />
                </footer>
            </div>
        </NewsProvider>
    );
}
