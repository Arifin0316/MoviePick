// components/footer.tsx
import React from 'react';
import Link from 'next/link';
import { Film, Mail, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    movies: [
      { label: 'Film Populer', href: '/movies' },
      { label: 'Sedang Tayang', href: '/movies/now-playing' },
      { label: 'Akan Datang', href: '/movies/upcoming' },
      { label: 'Film Top Rating', href: '/movies/top-rated' },
    ],
    tvShows: [
      { label: 'Series Populer', href: '/tv' },
      { label: 'Sedang Tayang', href: '/tv/airing-today' },
      { label: 'Di TV', href: '/tv/on-the-air' },
      { label: 'Series Top Rating', href: '/tv/top-rated' },
    ]
  };

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-white">FilmPedia</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Platform streaming film dan series terbaik untuk pengalaman menonton yang tak terlupakan.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Movies Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Film</h3>
            <ul className="space-y-2">
              {footerLinks.movies.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* TV Shows Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Serial TV</h3>
            <ul className="space-y-2">
              {footerLinks.tvShows.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {currentYear} MovieApp. Dibuat dengan ❤️ di Indonesia
            </p>
            <div className="flex gap-6">
              <Link 
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privasi
              </Link>
              <Link 
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Ketentuan
              </Link>
              <Link 
                href="/about"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Tentang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;