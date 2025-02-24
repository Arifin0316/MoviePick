"use client";

import { useState, useEffect } from "react";
import MovieCard from "./movieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface CardGridMovieProps {
  category: string;
  title: string;
  mediaType: 'movie' | 'tv'; // Tambahkan prop optional untuk tipe media
}

const CardGridMovie = ({ category, title, mediaType }: CardGridMovieProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
         `https://api.themoviedb.org/3/${mediaType}/${category}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID&page=${currentPage}`
        );
        const data = await response.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, category]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLoading(true);
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded-md hover:bg-gray-700 text-gray-300"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded-md hover:bg-gray-700 text-gray-300"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-black via-gray-900 to-black">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400 text-sm">
              Menampilkan {movies.length} film dari halaman {currentPage}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">Halaman</span>
            <span className="text-white font-medium">{currentPage}</span>
            <span className="text-gray-400 text-sm">dari</span>
            <span className="text-white font-medium">{totalPages}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-600"></div>
              <p className="mt-4 text-gray-400">Memuat film...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {movies.map((movie) => (
                <div key={movie.id} className="transform hover:scale-105 transition-transform duration-200">
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    rating={movie.vote_average}
                    releaseDate={movie.release_date}
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors flex items-center"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {renderPageNumbers()}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors flex items-center"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-gray-400 text-sm">
                Total {totalPages} halaman
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CardGridMovie;