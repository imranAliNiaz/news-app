"use client";

import { FC, FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { CiSearch } from "react-icons/ci";

export type SearchBarProps = SliceComponentProps<Content.SearchBarSlice>;

const SearchBar: FC<SearchBarProps> = ({ slice }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill from current URL (?query=...)
  const [value, setValue] = useState(searchParams.get("query") ?? "");

  // Sync state with URL params
  useEffect(() => {
    setValue(searchParams.get("query") ?? "");
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?query=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#F4F6F8] py-32"
    >
      <div className="mx-auto max-w-3xl px-4 text-center">
        {/* Title */}
        <PrismicRichText
          field={slice.primary.title}
          components={{
            heading1: ({ children }) => (
              <h2 className="mb-14 font-heading text-[48px] font-semibold leading-none tracking-normal text-[#2A2A2A] text-center">
                {children}
              </h2>
            ),
            heading2: ({ children }) => (
              <h2 className="mb-14 font-heading text-[48px] font-semibold leading-none tracking-normal text-[#2A2A2A] text-center">
                {children}
              </h2>
            ),
            paragraph: ({ children }) => (
              <h2 className="mb-14 font-heading text-[48px] font-semibold leading-none tracking-normal text-[#2A2A2A] text-center">
                {children}
              </h2>
            ),
          }}
        />


        {/* Search input */}
        <form onSubmit={handleSubmit} className="relative mx-auto mt-2 w-full">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <CiSearch size={18} />
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              setValue(val);
              if (val.trim() === "") {
                router.push("/search");
              }
            }}
            placeholder={slice.primary.input_placeholder || "Search news"}
            className="w-full rounded-sm border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          />
        </form>
      </div>
    </section>
  );
};

export default SearchBar;
