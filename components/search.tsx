import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Loader2, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchMovies();
      }
    }, 500);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const searchMovies = async () => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID&query=${encodeURIComponent(
          query
        )}&page=1`
      );
      const data = await response.json();
      setResults(data.results.slice(0, 5));
      setIsOpen(true);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari film..."
          className="w-full pl-12 pr-10 py-3 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 text-white placeholder-gray-400 transition-all duration-200 outline-none"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-700 max-h-96 overflow-auto z-50 shadow-xl shadow-black/30">
          {results.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id}>
              <div
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 hover:bg-gray-800/70 transition-colors duration-200 cursor-pointer border-b border-gray-800 last:border-0"
              >
                <div className="relative w-16 h-24 flex-shrink-0">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                      <SearchIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded-full">
                      {movie.release_date?.split('-')[0] || 'TBA'}
                    </span>
                    {movie.vote_average > 0 && (
                      <div className="flex items-center bg-gray-800/80 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" fill="#FACC15" />
                        <span className="text-sm text-gray-300">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && query && !isLoading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-700 text-center text-gray-300 shadow-xl shadow-black/30">
          Tidak ada film yang ditemukan
        </div>
      )}
    </div>
  );
};

export default Search;