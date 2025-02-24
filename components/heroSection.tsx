import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Star, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import TrailerModal from './TrailerModal';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
}

interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
}

const HeroSection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trailers, setTrailers] = useState<{[key: number]: Video | null}>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState<Video | null>(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID`
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 5));
        
        // Fetch trailers for each movie
        const movieIds = data.results.slice(0, 5).map((movie: Movie) => movie.id);
        fetchTrailersForMovies(movieIds);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const fetchTrailersForMovies = async (movieIds: number[]) => {
    try {
      const trailerPromises = movieIds.map(id => 
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`)
          .then(res => res.json())
      );
      
      const results = await Promise.all(trailerPromises);
      
      const trailersMap: {[key: number]: Video | null} = {};
      
      results.forEach((result, index) => {
        const videos = result.results || [];
        const trailer = videos.find(
          (video: Video) => 
            video.type.toLowerCase() === 'trailer' && 
            video.site.toLowerCase() === 'youtube'
        ) || null;
        
        trailersMap[movieIds[index]] = trailer;
      });
      
      setTrailers(trailersMap);
    } catch (error) {
      console.error('Error fetching trailers:', error);
    }
  };

  // Handle auto-rotate carousel
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [movies]);

  const handlePrevious = () => {
    if (movies.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (movies.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleOpenTrailer = () => {
    const currentMovie = movies[currentIndex];
    const trailer = trailers[currentMovie.id];
    
    if (trailer) {
      setCurrentTrailer(trailer);
      setIsModalOpen(true);
    }
  };

  if (loading || movies.length === 0) {
    return (
      <div className="h-[90vh] bg-gradient-to-b from-gray-900 to-black animate-pulse" />
    );
  }

  const currentMovie = movies[currentIndex];
  const hasTrailer = !!trailers[currentMovie.id];

  return (
    <>
      <div className="relative h-[90vh] w-full overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
          <Image
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            fill
            className="object-cover object-center"
            priority={true}
            sizes="100vw"
          />
          {/* Enhanced Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-6 lg:px-8 z-20">
          <button 
            onClick={handlePrevious}
            className="group bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Previous movie"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:text-red-500" />
          </button>
          <button 
            onClick={handleNext}
            className="group bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Next movie"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:text-red-500" />
          </button>
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight transition-all duration-500">
              {currentMovie.title}
            </h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                <Star className="w-5 h-5 text-yellow-400" fill="#FACC15" />
                <span className="ml-1.5 text-yellow-400 font-semibold">
                  {currentMovie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
            </div>
  
            <p className="text-gray-200 text-lg line-clamp-3 transition-all duration-500 max-w-2xl">
              {currentMovie.overview}
            </p>
  
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={handleOpenTrailer}
                disabled={!hasTrailer}
                className={`group flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 
                  ${hasTrailer
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-700 cursor-not-allowed text-gray-300'
                  }`}
              >
                <Play className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">Tonton Trailer</span>
              </button>
              <Link href={`/${currentMovie.id}`} className="group bg-gray-800/80 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105">
                <Info className="w-5 h-5" />
                <span className="font-medium">Info Detail</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-red-600' 
                  : 'w-2 bg-white/50 hover:bg-white/80'
              } h-2 rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trailer Modal */}
      {currentTrailer && (
        <TrailerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoKey={currentTrailer.key}
          videoTitle={currentTrailer.name}
        />
      )}
    </>
  );
};

export default HeroSection;