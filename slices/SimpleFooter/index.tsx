import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { FiWifi } from "react-icons/fi";
import { CiTwitter } from "react-icons/ci";
import { TbBrandDiscord } from "react-icons/tb";
import { TiSocialFacebookCircular } from "react-icons/ti";

export type SimpleFooterProps = SliceComponentProps<Content.SimpleFooterSlice>;

const SimpleFooter: FC<SimpleFooterProps> = ({ slice }) => {
  return (
    <footer
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-[#0E1E32] text-gray-300 py-10"
    >
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center space-y-8 md:grid md:grid-cols-3 md:gap-10">
        {/* LEFT (or TOP on mobile) — LOGO + COPYRIGHT */}
        <div className="flex flex-col items-center space-y-3">
          <PrismicNextImage
            field={slice.primary.logo}
            className="w-12 h-auto object-contain"
          />
          <p className="text-xs text-gray-400 text-center">
            {slice.primary.copyright_text}
          </p>
        </div>

        {/* LEGAL / SITE LINKS */}
        <div className="flex flex-col space-y-2 text-sm text-center">
          {slice.primary.legal_links.map((item, index) => (
            <PrismicNextLink
              key={index}
              field={item.link}
              className="hover:text-white transition"
            />
          ))}
        </div>

        {/* NAV + SOCIAL ICONS */}
        <div className="flex flex-col items-center space-y-4">
          {/* NAVIGATION LINKS */}
          <div className="flex space-x-4 text-sm flex-wrap justify-center">
            {slice.primary.navigation_links.map((item, index) => (
              <PrismicNextLink
                key={index}
                field={item.link}
                className="hover:text-white transition"
              />
            ))}
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex space-x-6 text-2xl font-bold text-white">
            <FiWifi className="cursor-pointer" />
            <CiTwitter className="cursor-pointer" />
            <TbBrandDiscord className="cursor-pointer" />
            <TiSocialFacebookCircular className="cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
