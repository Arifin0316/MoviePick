import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Star, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentMovie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
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
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-6 lg:px-8 z-20">
          <motion.button 
            onClick={handlePrevious}
            className="group bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Previous movie"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:text-red-500" />
          </motion.button>
          <motion.button 
            onClick={handleNext}
            className="group bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Next movie"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:text-red-500" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center z-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentMovie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5,
                staggerChildren: 0.1
              }}
              className="max-w-3xl space-y-6"
            >
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {currentMovie.title}
              </motion.h1>
              
              <motion.div 
                className="flex items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.div 
                  className="flex items-center bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-5 h-5 text-yellow-400" fill="#FACC15" />
                  <span className="ml-1.5 text-yellow-400 font-semibold">
                    {currentMovie.vote_average.toFixed(1)}
                  </span>
                </motion.div>
                <motion.span 
                  className="text-gray-300 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  {new Date(currentMovie.release_date).getFullYear()}
                </motion.span>
              </motion.div>
    
              <motion.p 
                className="text-gray-200 text-lg line-clamp-3 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {currentMovie.overview}
              </motion.p>
    
              <motion.div 
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button 
                  onClick={handleOpenTrailer}
                  disabled={!hasTrailer}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-lg 
                    ${hasTrailer
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-700 cursor-not-allowed text-gray-300'
                    }`}
                  whileHover={{ scale: hasTrailer ? 1.05 : 1 }}
                  whileTap={{ scale: hasTrailer ? 0.95 : 1 }}
                >
                  <Play className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="font-medium">Tonton Trailer</span>
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={`/${currentMovie.id}`} className="group bg-gray-800/80 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    <span className="font-medium">Info Detail</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {movies.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full ${
                index === currentIndex 
                  ? 'bg-red-600' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              initial={false}
              animate={{ 
                width: index === currentIndex ? 32 : 8,
                transition: { duration: 0.3 } 
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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