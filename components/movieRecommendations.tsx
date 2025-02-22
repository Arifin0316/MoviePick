import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  const [selectedGenre, setSelectedGenre] = useState<number>(28); // Default to Action

  // Predefined genres
  const genres = [
    { id: 28, name: 'Aksi' },
    { id: 12, name: 'Petualangan' },
    { id: 36, name: 'Sejarah' },
    { id: 14, name: 'Fantasi' },
    { id: 878, name: 'Cerita Fiksi' },
  ];

  // Fetch movies by genre
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
    <div className="container mx-auto px-10 py-12">
      {/* Genre Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedGenre === genre.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Container with Vertical Scroll */}
      <div className="h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading ? (
            // Loading Skeletons
            [...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[2/3] bg-gray-300 rounded-lg"></div>
                <div className="h-4 bg-gray-300 rounded mt-2 w-3/4"></div>
              </div>
            ))
          ) : (
            // Movie Cards
            movies.map((movie) => (
              <Link href={movie.id.toString()} key={movie.id}>
              <div
                className="transition-transform duration-200 hover:scale-105"
              >
                <div className="relative w-full aspect-[2/3]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 p-4 w-full">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-1">
                          <span>★</span>
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="mt-2 text-gray-100 font-medium truncate">
                  {movie.title}
                </h3>
              </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieRecommendations;