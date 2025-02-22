"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Film, User, Heart } from 'lucide-react';
import Search from './search'; // Menggunakan komponen Search yang sudah dibuat sebelumnya

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/movies' },
    { label: 'TV Series', href: '/tv' },
    { label: 'Categories', href: '/categories' },
  ];

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left Side */}
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

          {/* Desktop Menu - Right Side */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Heart className="h-6 w-6 hover:text-gray-600 text-slate-100" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="h-6 w-6 hover:text-gray-600 text-slate-100" />
              </button>
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
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="py-2">
              <Search />
            </div>
            
            {/* Mobile Menu Items */}
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gray-900 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile User Actions */}
            <div className="flex items-center gap-4 px-3 py-2">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                <Heart className="h-5 w-5" />
                <span>Watchlist</span>
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;