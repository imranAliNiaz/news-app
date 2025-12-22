import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import Image from "next/image";

export type SimpleFooterProps = SliceComponentProps<Content.SimpleFooterSlice>;

const SimpleFooter: FC<SimpleFooterProps> = ({ slice }) => {
  return (
    <footer
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full bg-[#0E1E32]"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-2
            text-center
            md:grid-cols-2
            md:gap-12
            lg:grid-cols-3
            lg:gap-16
          "
        >
          {/* SECTION 1 — LOGO + COPYRIGHT */}
          <div className="flex flex-col items-center space-y-2 md:space-y-4 lg:space-y-6">
            <PrismicNextImage
              field={slice.primary.logo}
              className="w-12 h-auto object-contain"
            />
            <p className="font-body text-[12px] font-normal leading-[2.1] tracking-[0.02em] text-white">
              {slice.primary.copyright_text}
            </p>
          </div>

          {/* SECTION 2 — LEGAL LINKS (DESKTOP ONLY) */}
          <div className="hidden flex-col items-center space-y-2 lg:flex">
            {slice.primary.legal_links.map((item, index) => (
              <PrismicNextLink
                key={index}
                field={item.link}
                className="font-body text-[15px] font-medium leading-[2.1] tracking-[0.02em] text-white hover:text-white transition"
              />
            ))}
          </div>

          {/* SECTION 3 — NAV + SOCIAL */}
          <div className="flex flex-col items-center space-y-6">
            {/* NAV LINKS */}
            <div
              className="
                flex
                flex-col
                items-center
                gap-y-0
                md:flex-row
                md:gap-y-0
                md:gap-x-6
              "
            >
              {slice.primary.navigation_links.map((item, index) => (
                <PrismicNextLink
                  key={index}
                  field={item.link}
                  className="font-body text-[15px] font-medium leading-[2.1] tracking-[0.02em] text-white hover:text-white transition"
                />
              ))}
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center justify-center gap-6">
              <Image src="/icons/footer-icon-1.png" alt="" width={28} height={28} />
              <Image src="/icons/footer-icon-2.png" alt="" width={28} height={28} />
              <Image src="/icons/footer-icon-3.png" alt="" width={28} height={28} />
              <Image src="/icons/footer-icon-4.png" alt="" width={28} height={28} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
