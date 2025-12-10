import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { CiHeart } from "react-icons/ci";
import { RiMobileDownloadLine } from "react-icons/ri";
import { VscComment } from "react-icons/vsc";

export type FeatureArticleProps = SliceComponentProps<
  Content.FeatureArticleSlice
>;

const FeatureArticle: FC<FeatureArticleProps> = ({ slice }) => {
  return (
    <section
      className="w-full
    block lg:grid lg:grid-cols-2
    lg:gap-10
    py-4 sm:py-6 lg:py-10
    px-4 sm:px-6 lg:px-16"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* LEFT — Image Composition */}
      <div className="relative w-full flex justify-center items-center">
        {/* Background Lines / Decorations (optional) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Decorative SVG or shapes */}
        </div>

        {/* Main image box */}
        <div className="relative z-10 w-full h-[350px] md:h-[500px] overflow-hidden bg-white shadow-xl">
          <PrismicNextImage
            field={slice.primary.main_image}
            className="w-full h-full object-cover"
          />

          {/* 🌟 Overlay title for small screens */}
          <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-6 lg:hidden">
            <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
              <PrismicRichText field={slice.primary.title} />
            </h2>
          </div>
        </div>
      </div>

      {/* RIGHT — Text Content (for md / lg screens) */}
      <div className="flex flex-col justify-center max-w-xl mx-auto lg:mx-0">
        {/* Show tag & icons on md+ only */}
        <div className="hidden md:flex items-center justify-between mb-3">
          <p className="text-red-500 text-sm font-semibold tracking-wide">
            {slice.primary.tag}
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-xl cursor-pointer">
            <CiHeart />
            <RiMobileDownloadLine />
            <VscComment />
          </div>
        </div>

        {/* Title — hidden on small (since overlay renders it) */}
        <div className="hidden lg:block text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
          <PrismicRichText field={slice.primary.title} />
        </div>

        {/* Summary */}
        <div className="hidden text-gray-600 text-base leading-relaxed mb-6 lg:mb-0">
          <PrismicRichText field={slice.primary.summary} />
        </div>

        {/* Meta Info — show on md+ */}
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
          {slice.primary.post_time && <span>{slice.primary.post_time}</span>}
          {slice.primary.author_name && <span>{slice.primary.author_name}</span>}
          {slice.primary.author_name && slice.primary.read_time && (
            <span className="w-px h-4 bg-gray-400"></span>
          )}
          {slice.primary.read_time && <span>{slice.primary.read_time}</span>}
        </div>
      </div>
    </section>
  );
};

export default FeatureArticle;
