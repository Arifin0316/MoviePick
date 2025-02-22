import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
}

const HeroSection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID`
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 5)); // Mengambil 5 film trending teratas
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading || movies.length === 0) {
    return (
      <div className="h-[80vh] bg-gray-900 animate-pulse" />
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image with Fade Transition */}
      <div className="absolute inset-0 transition-opacity duration-500">
        <Image
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          fill
          className="object-cover"
          priority= {true}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute  bottom-0 bg-gradient-to-t from-black via-black/40  to-transparent w-full h-10" />
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transform hover:scale-110 transition-all duration-200 z-10"
        aria-label="Previous movie"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transform hover:scale-110 transition-all duration-200 z-10"
        aria-label="Next movie"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-300">
            {currentMovie.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="ml-1 text-yellow-400 font-semibold">
                {currentMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-300">
              {new Date(currentMovie.release_date).getFullYear()}
            </span>
          </div>

          <p className="text-gray-300 text-lg mb-8 line-clamp-3 transition-all duration-300">
            {currentMovie.overview}
          </p>

          <div className="flex gap-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200">
              <Play className="w-5 h-5" />
              Watch Trailer
            </button>
            <button className="bg-gray-800/80 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transform hover:scale-105 transition-transform duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-15 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;