"use client";

import { useRouter, usePathname } from "next/navigation";
import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { FaAnglesRight } from "react-icons/fa6";
import { CiUser, CiSearch } from "react-icons/ci";
import { RiMenu3Fill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategory } from "@/store/newsSlice";
import { mapCategoryToSection } from "@/lib/nyt";

export type MainNavigationProps =
  SliceComponentProps<Content.MainNavigationSlice>;

const MainNavigation: FC<MainNavigationProps> = ({ slice }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.news.selectedCategory);

  const handleSearchClick = () => {
    router.push("/search");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleCategoryClick = (label: string) => {
    const section = mapCategoryToSection(label);
    dispatch(setCategory(section));

    if (pathname && pathname.startsWith("/search")) {
      return;
    }

    if (pathname !== "/") {
      router.push("/");
      return;
    }

    setTimeout(() => {
      const newsSection = document.querySelector('[data-news-section]');
      if (newsSection) {
        newsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 bg-white w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center shrink-0 cursor-pointer">
          <PrismicNextImage
            field={slice.primary.logo}
            className="w-16 h-auto object-contain"
            onClick={handleLogoClick}
          />
        </div>

        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {slice.primary.nav_links.map((item, index) => {
            const section = mapCategoryToSection(item.label || "");
            const isActive = selectedCategory === section;

            return (
              <button
                key={index}
                onClick={() => handleCategoryClick(item.label || "")}
                className={`
                  font-description
                  text-[16px]
                  font-semibold
                  leading-none
                  tracking-normal
                  text-[#2A2A2A]
                  hover:text-[#C31815]
                  transition
                  cursor-pointer
                  pb-1
                  ${isActive
                    ? "text-[#C31815] border-b-2 border-[#C31815]"
                    : ""
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
          <span className="text-[#C31815]">
            <FaAnglesRight />
          </span>
        </nav>

        <div className="flex items-center gap-4 text-gray-700 shrink-0">
          <CiUser
            size={22}
            color="#000"
            className="cursor-pointer hover:text-[#C31815] transition"
          />

          <CiSearch
            size={22}
            color="#000"
            className="cursor-pointer hover:text-[#C31815] transition"
            onClick={handleSearchClick}
          />

          <RiMenu3Fill
            size={22}
            color="#000"
            className="cursor-pointer hover:text-[#C31815] transition"
          />
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
