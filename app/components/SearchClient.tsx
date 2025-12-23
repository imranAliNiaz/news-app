"use client";

import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import SearchNewsGrid from "@/app/components/SearchNewsGrid";

import { SearchClientProps } from "@/types/types";

export default function SearchClient({ stories, title, query, slicesData }: SearchClientProps) {
    return (
        <div className="flex min-h-screen flex-col bg-[#F4F6F8]">

            <SliceZone slices={slicesData.header.data.slices} components={components} />
            <main className="flex-1">
                <SliceZone slices={slicesData.searchBar.data.slices} components={components} />
                <SearchNewsGrid stories={stories} title={title} />
                {query && stories.length === 0 && (
                    <p className="mx-auto max-w-3xl px-4 pb-16 text-center text-sm text-slate-500">
                        No articles found matching{" "}
                        <span className="font-semibold">"{query}"</span>.
                    </p>
                )}
            </main>
            <footer className="mt-auto">
                <SliceZone slices={slicesData.footer.data.slices} components={components} />
            </footer>
        </div>
    );
}
