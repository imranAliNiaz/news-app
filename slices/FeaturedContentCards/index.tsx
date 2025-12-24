import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

export type FeaturedContentCardsProps =
  SliceComponentProps<Content.FeaturedContentCardsSlice>;

const FeaturedContentCards: FC<FeaturedContentCardsProps> = ({ slice }) => {
  return (
    <section
      className="w-full py-16 px-4 lg:px-10"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {slice.primary.cards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="w-full h-56 overflow-hidden">
              <PrismicNextImage
                field={item.thumbnail_image}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-900 leading-tight mb-3">
                <PrismicRichText field={item.title} />
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                <PrismicRichText field={item.description} />
              </p>

              <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <span>{item.timestamp}</span>
                <span>• {item.author}</span>
                <span>• {item.read_time}</span>
              </div>

              <div className="flex justify-between items-center border-t pt-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  ❤️ <span>{item.likes_count}</span>
                </div>

                <div className="flex items-center gap-2">
                  💬 <span>{item.comments_count}</span>
                </div>

                <div className="flex items-center gap-3">🔖 📤</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-md shadow-sm hover:shadow-md transition">
          View More
        </button>
      </div>
    </section>
  );
};

export default FeaturedContentCards;
