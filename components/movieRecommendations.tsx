"use client";

import React, { useState, useEffect } from 'react';
import MovieCard from './movieCard';
import { Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Animasi untuk judul
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      }
    }
  };

  // Animasi untuk tombol genre
  const genreButtonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: custom * 0.1,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  // Animasi untuk container film
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2 
      }
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  // Animasi untuk skeleton loading
  const skeletonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.3,
        delay: custom * 0.05 
      }
    })
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              initial={{ rotate: -20, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <Film className="w-8 h-8 text-red-600" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Rekomendasi Film
            </h2>
          </motion.div>
          
          {/* Genre Selection */}
          <motion.div 
            className="flex flex-wrap gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {genres.map((genre, index) => (
              <motion.button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`
                  group relative px-6 py-2.5 rounded-xl
                  ${selectedGenre === genre.id 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                  backdrop-blur-sm border border-gray-700
                  flex items-center gap-2
                `}
                variants={genreButtonVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span 
                  className="text-lg"
                  animate={selectedGenre === genre.id ? { 
                    scale: [1, 1.2, 1],
                    transition: { repeat: Infinity, repeatDelay: 1.5 }
                  } : {}}
                >
                  {genre.icon}
                </motion.span>
                <span className="font-medium">{genre.name}</span>
                {selectedGenre === genre.id && (
                  <motion.span 
                    className="absolute inset-0 rounded-xl bg-white/10"
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  ></motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Movies Grid Section */}
        <div className="relative">
          <div className="h-[75vh] overflow-y-auto pr-4 custom-scrollbar">
            <AnimatePresence mode="wait">
              {loading ? (
                // Skeleton Loading
                <motion.div 
                  key="skeleton"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                >
                  {[...Array(10)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="animate-pulse"
                      variants={skeletonVariants}
                      custom={i}
                    >
                      <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg"></div>
                      <div className="space-y-3 mt-4">
                        <div className="h-4 bg-gray-800 rounded-full w-3/4"></div>
                        <div className="h-4 bg-gray-800 rounded-full w-1/2"></div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="movies"
                  className="grid mb-10 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                >
                  {movies.map((movie, index) => (
                    <motion.div 
                      key={movie.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            duration: 0.5,
                            delay: index * 0.05
                          }
                        }
                      }}
                    >
                      <MovieCard
                        id={movie.id}
                        title={movie.title}
                        posterPath={movie.poster_path}
                        rating={movie.vote_average}
                        releaseDate={movie.release_date}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gradient Overlay for Scroll */}
          <motion.div 
            className="absolute bottom-0 left-0 right-4 h-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{
              background: "linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)"
            }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default MovieRecommendations;