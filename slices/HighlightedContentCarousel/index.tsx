"use client";

import { FC, useMemo, useState, useEffect } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

export type HighlightedContentCarouselProps =
  SliceComponentProps<Content.HighlightedContentCarouselSlice>;

const AUTO_INTERVAL = 5000;

const HighlightedContentCarousel: FC<HighlightedContentCarouselProps> = ({
  slice,
}) => {
  const items = slice.primary.items || [];

  const getItemsPerSlide = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 2;
    return 1;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Update itemsPerSlide on resize
  useEffect(() => {
    const update = () => setItemsPerSlide(getItemsPerSlide());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slides = useMemo(() => {
    const chunks: (typeof items[number])[][] = [];
    for (let i = 0; i < items.length; i += itemsPerSlide) {
      chunks.push(items.slice(i, i + itemsPerSlide));
    }
    return chunks;
  }, [items, itemsPerSlide]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [itemsPerSlide]);
  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, slides.length - 1)));
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto max-w-7xl px-4 py-10"
    >
      <div className="mb-6 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {slice.primary.section_title}
        </h2>
        <span className="text-yellow-500 text-xl">★</span>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideItems, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {slideItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 md:flex-row"
                >
                  <div className="h-48 w-full overflow-hidden rounded-lg md:h-28 md:w-40 flex-shrink-0">
                    <PrismicNextImage
                      field={item.media}
                      className="h-full w-full object-cover"
                    />
                  </div>

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

      {slides.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition ${index === currentSlide
                ? "w-6 bg-red-600"
                : "w-3 bg-red-300"
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
