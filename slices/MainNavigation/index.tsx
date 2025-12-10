"use client";  // make sure this is a client component

import { useRouter } from "next/navigation";
import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { FaAnglesRight } from "react-icons/fa6";
import { CiUser, CiSearch } from "react-icons/ci";
import { RiMenu3Fill } from "react-icons/ri";

export type MainNavigationProps =
  SliceComponentProps<Content.MainNavigationSlice>;

const MainNavigation: FC<MainNavigationProps> = ({ slice }) => {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push("/search");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-9999 bg-white w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LEFT — LOGO */}
        <div className="flex items-center shrink-0 cursor-pointer">
          <PrismicNextImage
            field={slice.primary.logo}
            className="w-16 h-auto object-contain"
            onClick={handleLogoClick}
          />
        </div>

        {/* MIDDLE — NAV LINKS */}
        <nav className="hidden md:flex items-center space-x-16 text-sm font-bold text-gray-700 shrink">
          {slice.primary.nav_links.map((item, index) => (
            <button
              key={index}
              className="hover:text-black transition cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <span><FaAnglesRight /></span>
        </nav>

        {/* RIGHT — ICONS */}
        <div className="flex items-center space-x-3 md:space-x-4 text-gray-700 shrink-0">
          <CiUser size={20} color="#000" className="cursor-pointer" />
          
          {/* 🔍 Search icon — navigate to /search on click */}
          <CiSearch
            size={20}
            color="#000"
            className="cursor-pointer"
            onClick={handleSearchClick}
          />

          <RiMenu3Fill size={20} color="#000" className="cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
