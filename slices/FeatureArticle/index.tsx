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
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full"
    >
      {/* ✅ MAX-WIDTH CONTAINER (LIKE ANNOUNCEMENT BAR) */}
      <div className="mx-auto max-w-7xl px-4 ">
        {/* FLEX WRAPPER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 pt-4 sm:pt-6 lg:pt-10 pb-0 lg:pb-10">

          {/* LEFT — IMAGE */}
          <div className="relative w-full lg:flex-[3]">
            <div className="relative aspect-[16/9] overflow-hidden shadow-xl">
              <PrismicNextImage
                field={slice.primary.main_image}
                className="h-full w-full object-cover"
                fallbackAlt=""
              />

              {/* OVERLAY TITLE — MOBILE + TABLET */}
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/70 to-transparent p-5 lg:hidden">
                <div className="max-w-[90%] text-xl sm:text-2xl font-bold leading-tight text-white">
                  <PrismicRichText field={slice.primary.title} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — TEXT (DESKTOP ONLY) */}
          <div className="hidden lg:flex lg:flex-[2] flex-col justify-center">
            {/* TAG + ICONS */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold tracking-wide text-red-500">
                {slice.primary.tag}
              </p>
              <div className="flex items-center gap-4 text-xl text-gray-600 cursor-pointer">
                <CiHeart />
                <RiMobileDownloadLine />
                <VscComment />
              </div>
            </div>

            {/* TITLE */}
            <div className="mb-4 text-3xl xl:text-4xl font-bold leading-tight text-gray-900">
              <PrismicRichText field={slice.primary.title} />
            </div>

            {/* SUMMARY */}
            <div className="mb-6 max-w-[640px] text-base leading-relaxed text-gray-600">
              <PrismicRichText field={slice.primary.summary} />
            </div>

            {/* META */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {slice.primary.post_time && <span>{slice.primary.post_time}</span>}
              {slice.primary.author_name && <span>{slice.primary.author_name}</span>}
              {slice.primary.author_name && slice.primary.read_time && (
                <span className="h-4 w-px bg-gray-400" />
              )}
              {slice.primary.read_time && <span>{slice.primary.read_time}</span>}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureArticle;
