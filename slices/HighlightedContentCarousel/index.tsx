"use client";

import { FC, useMemo, useState, useEffect } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

export type HighlightedContentCarouselProps =
  SliceComponentProps<Content.HighlightedContentCarouselSlice>;

const ITEMS_PER_SLIDE = 2; // how many cards per "page"
const AUTO_INTERVAL = 5000; // 5 seconds

const HighlightedContentCarousel: FC<HighlightedContentCarouselProps> = ({
  slice,
}) => {
  // if your repeatable zone is slice.items, swap this
  const items = slice.primary.items || [];

  // Build slides: [[item0, item1], [item2, item3], ...]
  const slides = useMemo(() => {
    const chunks: typeof items[] = [];
    for (let i = 0; i < items.length; i += ITEMS_PER_SLIDE) {
      chunks.push(items.slice(i, i + ITEMS_PER_SLIDE));
    }
    return chunks;
  }, [items]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    if (!slides.length) return;
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    setCurrentSlide(clamped);
  };

  // ✅ AUTO CAROUSEL
  useEffect(() => {
    if (!slides.length) return;

    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, AUTO_INTERVAL);

    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="max-w-7xl mx-auto px-6 py-10"
    >
      {/* SECTION TITLE */}
      <div className="mb-6 flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {slice.primary.section_title}
        </h2>
        <span className="text-yellow-500 text-xl">★</span>
      </div>

      {/* CAROUSEL WRAPPER */}
      <div className="relative overflow-hidden">
        {/* SLIDES TRACK */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slideItems, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {slideItems.map((item, index) => (
                <div key={index} className="flex space-x-4">
                  {/* IMAGE */}
                  <div className="h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg">
                    <PrismicNextImage
                      field={item.media}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* TEXT CONTENT */}
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold leading-5 text-gray-900">
                      <PrismicRichText field={item.title} />
                    </div>

                    <div className="mt-1 text-sm leading-5 text-gray-600 line-clamp-3">
                      <PrismicRichText field={item.description} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PAGE DOTS */}
      {slides.length > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition ${index === currentSlide ? "w-6 bg-red-600" : "w-3 bg-red-300"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HighlightedContentCarousel;
