"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Film, ChevronDown } from "lucide-react";
import Search from "../search";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const movieDropdownItems = [
    { label: "Populer", href: "/movies" },
    { label: "Sedang Tayang", href: "/movies/now-playing" },
    { label: "Mendatang", href: "/movies/upcoming" },
    { label: "Top Rating", href: "/movies/top-rated" },
  ];

  const tvDropdownItems = [
    { label: "Populer", href: "/tv" },
    { label: "Sedang Tayang", href: "/tv/airing-today" },
    { label: "Tayang di TV", href: "/tv/on-the-air" },
    { label: "Top Rating", href: "/tv/top-rated" },
  ];

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-100">MovieApp</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex md:items-center md:justify-center md:flex-1 mx-4">
            <div className="w-full max-w-xl">
              <Search />
            </div>
          </div>

          {/* Desktop Menu with Dropdowns */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-200 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>

            {/* Movies Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors duration-200 cursor-pointer">
                Movies
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out bg-black/95 backdrop-blur-sm border border-gray-800 z-10">
                {movieDropdownItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* TV Series Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors duration-200 cursor-pointer">
                TV Series
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out bg-black/95 backdrop-blur-sm border border-gray-800 z-10">
                {tvDropdownItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-100 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="py-2">
              <Search />
            </div>

            {/* Mobile Menu Items */}
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>

            {/* Mobile Movies Section */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-300">
                Movies
              </div>
              {movieDropdownItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 pl-6 text-sm text-gray-300 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile TV Series Section */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-300">
                TV Series
              </div>
              {tvDropdownItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 pl-6 text-sm text-gray-300 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
