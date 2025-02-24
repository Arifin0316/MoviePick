"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Film, ChevronDown } from "lucide-react";
import Search from "../search";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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

  // Control navbar visibility based on scroll direction
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        // Don't hide navbar when mobile menu is open
        if (isMobileMenuOpen) {
          setIsVisible(true);
          return;
        }
        
        const currentScrollY = window.scrollY;
        
        // Always show navbar at the top of the page
        if (currentScrollY < 100) {
          setIsVisible(true);
        } else {
          // Hide on scroll down, show on scroll up
          if (currentScrollY > lastScrollY) {
            setIsVisible(false);
            // Also close any open dropdowns when hiding navbar
            setActiveDropdown(null);
          } else {
            setIsVisible(true);
          }
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', controlNavbar);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY, isMobileMenuOpen]);

  // Clean up function to handle any click outside the dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Close dropdowns if clicking outside navbar
      if (!target.closest('nav')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-black shadow-md transition-transform duration-300 ${isHomePage ? 'z-50' : 'z-40'} ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors duration-200 cursor-pointer py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'movies' ? null : 'movies');
                }}
                onMouseEnter={() => setActiveDropdown('movies')}
              >
                Movies
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'movies' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'movies' && (
                <div 
                  className="absolute top-full left-0 w-48 rounded-md shadow-lg bg-black/95 backdrop-blur-sm border border-gray-800 z-50 py-1"
                  onMouseLeave={() => setActiveDropdown(null)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {movieDropdownItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* TV Series Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors duration-200 cursor-pointer py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'tv' ? null : 'tv');
                }}
                onMouseEnter={() => setActiveDropdown('tv')}
              >
                TV Series
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'tv' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'tv' && (
                <div 
                  className="absolute top-full left-0 w-48 rounded-md shadow-lg bg-black/95 backdrop-blur-sm border border-gray-800 z-50 py-1"
                  onMouseLeave={() => setActiveDropdown(null)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {tvDropdownItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-100 hover:text-white hover:bg-gray-800"
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
        <div className="md:hidden bg-black border-t border-gray-800 relative z-40">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="py-2">
              <Search />
            </div>

            {/* Mobile Menu Items */}
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
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
                  className="block px-3 py-2 pl-6 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
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
                  className="block px-3 py-2 pl-6 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
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