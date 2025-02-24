import React, { useState, useEffect } from 'react';
import MovieCard from './movieCard';
import { Film } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

const MovieRecommendations = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number>(28);

  const genres = [
    { id: 28, name: 'Aksi', icon: '🎬' },
    { id: 12, name: 'Petualangan', icon: '🗺️' },
    { id: 36, name: 'Sejarah', icon: '📚' },
    { id: 14, name: 'Fantasi', icon: '🔮' },
    { id: 878, name: 'Cerita Fiksi', icon: '🚀' },
  ];

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${selectedGenre}&language=id-ID`
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoviesByGenre();
  }, [selectedGenre]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Rekomendasi Film
            </h2>
          </div>
          
          {/* Genre Selection */}
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`
                  group relative px-6 py-2.5 rounded-xl transition-all duration-300
                  ${selectedGenre === genre.id 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                  backdrop-blur-sm border border-gray-700
                  flex items-center gap-2
                `}
              >
                <span className="text-lg">{genre.icon}</span>
                <span className="font-medium">{genre.name}</span>
                {selectedGenre === genre.id && (
                  <span className="absolute inset-0 rounded-xl bg-white/10 animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid Section */}
        <div className="relative">
          <div className="h-[75vh] overflow-y-auto pr-4 custom-scrollbar">
            {loading ? (
              // Skeleton Loading
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg"></div>
                    <div className="space-y-3 mt-4">
                      <div className="h-4 bg-gray-800 rounded-full w-3/4"></div>
                      <div className="h-4 bg-gray-800 rounded-full w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {movies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="transform hover:scale-105 transition-all duration-300"
                  >
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
            )}
          </div>

          {/* Gradient Overlay for Scroll */}
          <div className="absolute bottom-0 left-0 right-4 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieRecommendations;