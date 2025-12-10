import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type AnnouncementBarProps =
  SliceComponentProps<Content.AnnouncementBarSlice>;

const AnnouncementBar: FC<AnnouncementBarProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full m-0 p-0"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="
            bg-[#C31815]
            w-full
            flex flex-col sm:flex-row items-center sm:justify-center gap-4
            h-auto md:h-20
            py-4 sm:py-0
            rounded-md
          "
        >
          {/* Button / label */}
          <div className="bg-white text-[#C31815] font-semibold text-sm uppercase px-4 py-2 md:py-4 rounded whitespace-nowrap">
            {slice.primary.label}
          </div>

          {/* Message */}
          <div className="text-white text-sm text-center sm:text-left">
            <PrismicRichText field={slice.primary.message} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementBar;
