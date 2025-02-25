"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Film } from "lucide-react";
import { motion } from "framer-motion";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface MovieRecommendationsProps {
  movieId: number;
}

const MovieRecommendations = ({ movieId }: MovieRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recommendationsRef = useRef(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID`
        );

        if (!response.ok) {
          throw new Error("Gagal memuat rekomendasi film");
        }

        const data = await response.json();
        setRecommendations(data.results.slice(0, 6)); // Mengambil 6 rekomendasi teratas
        setError(null);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError("Gagal memuat rekomendasi film");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchRecommendations();
    }
  }, [movieId]);

  // Variasi animasi
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, rotate: 180, scale: 0 },
    visible: { 
      opacity: 1, 
      rotate: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const movieCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut"
      }
    })
  };

  const ratingVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        delay: 0.2
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-8 h-8 bg-gray-800 rounded-full"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              rotate: 360,
              transition: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          ></motion.div>
          <motion.div 
            className="h-8 bg-gray-800 rounded w-48"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          ></motion.div>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-gray-800 aspect-[2/3] rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="bg-red-900/50 border border-red-700 text-red-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={headerVariants}
        >
          <motion.div variants={iconVariants}>
            <Film className="w-8 h-8 text-red-600" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Film Serupa
          </h2>
        </motion.div>
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          <p className="text-gray-400">Tidak ada rekomendasi film saat ini.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      ref={recommendationsRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={sectionVariants}
    >
      <motion.div 
        className="flex items-center gap-3 mb-6"
        variants={headerVariants}
      >
        <motion.div variants={iconVariants}>
          <Film className="w-8 h-8 text-red-600" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Film Serupa
        </h2>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6"
        variants={sectionVariants}
      >
        {recommendations.map((movie, index) => (
          <motion.div
            key={movie.id}
            custom={index}
            variants={movieCardVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              transition: { duration: 0.2 }
            }}
          >
            <Link href={`/${movie.id}`}>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/api/placeholder/300/450"
                    }
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <motion.div 
                    className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center"
                    variants={ratingVariants}
                  >
                    <Star className="w-3 h-3 text-yellow-400 mr-1" fill="#FACC15" />
                    {movie.vote_average.toFixed(1)}
                  </motion.div>
                </div>
                <motion.div 
                  className="p-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <motion.h3 
                    className="font-semibold text-sm mb-2 text-white line-clamp-1"
                    initial={{ y: 5, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    {movie.title}
                  </motion.h3>
                  <motion.div 
                    className="flex justify-end"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <span className="text-xs text-gray-400 bg-gray-700/70 px-2 py-0.5 rounded-full">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MovieRecommendations;