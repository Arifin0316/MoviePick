"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, DollarSign, BarChart2, Languages, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieMetadata {
  status: string;
  budget: number;
  revenue: number;
  runtime: number;
  release_date: string;
  original_language: string;
  spoken_languages: Array<{ english_name: string }>;
  keywords: {
    keywords: Array<{ id: number; name: string }>;
  };
}

interface MovieMetadataProps {
  movieId: number;
}

const MovieMetadata = ({ movieId }: MovieMetadataProps) => {
  const [metadata, setMetadata] = useState<MovieMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const metadataRef = useRef(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        // Fetch movie details
        const [movieResponse, keywordsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          )
        ]);

        if (!movieResponse.ok || !keywordsResponse.ok) {
          throw new Error('Gagal memuat data film');
        }

        const movieData = await movieResponse.json();
        const keywordsData = await keywordsResponse.json();

        setMetadata({ ...movieData, keywords: keywordsData });
        setError(null);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setError('Gagal memuat informasi film');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMetadata();
    }
  }, [movieId]);

  // Variasi animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -20 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}j ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i} 
              className="h-24 bg-gray-800 rounded-lg"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
              }}
            ></motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  if (error || !metadata) {
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

  const metadataItems = [
    {
      icon: <BarChart2 className="w-6 h-6 text-red-600" />,
      title: "Status",
      content: metadata.status
    },
    {
      icon: <Clock className="w-6 h-6 text-red-600" />,
      title: "Durasi",
      content: formatRuntime(metadata.runtime)
    },
    {
      icon: <Calendar className="w-6 h-6 text-red-600" />,
      title: "Tanggal Rilis",
      content: new Date(metadata.release_date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    },
    {
      icon: <DollarSign className="w-6 h-6 text-red-600" />,
      title: "Anggaran",
      content: metadata.budget > 0 ? formatCurrency(metadata.budget) : 'Tidak ada data'
    },
    {
      icon: <Languages className="w-6 h-6 text-red-600" />,
      title: "Bahasa",
      content: null,
      languages: metadata.spoken_languages
    },
    {
      icon: <Tag className="w-6 h-6 text-red-600" />,
      title: "Kata Kunci",
      content: null,
      keywords: metadata.keywords.keywords
    }
  ];

  return (
    <motion.div 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      ref={metadataRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {metadataItems.map((item, index) => (
          <motion.div 
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300"
            custom={index}
            variants={cardVariants}
            whileHover={{ 
              y: -10,
              boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.1)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div variants={iconVariants}>
                {item.icon}
              </motion.div>
              <motion.h3 
                className="text-lg font-semibold text-white"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                {item.title}
              </motion.h3>
            </div>
            
            {item.content && (
              <motion.p 
                className="text-gray-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                {item.content}
              </motion.p>
            )}
            
            {item.languages && (
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                {item.languages.length > 0 ? (
                  item.languages.map((lang, langIndex) => (
                    <motion.span
                      key={langIndex}
                      className="bg-red-900/30 text-red-200 text-sm px-3 py-1 rounded-full border border-red-800/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + langIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {lang.english_name}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-gray-400">Tidak ada data</span>
                )}
              </motion.div>
            )}
            
            {item.keywords && (
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                {item.keywords.length > 0 ? (
                  item.keywords.map((keyword, keywordIndex) => (
                    <motion.span
                      key={keyword.id}
                      className="bg-gray-700/80 text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-600"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + keywordIndex * 0.02 }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(156, 27, 27, 0.3)" }}
                    >
                      {keyword.name}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-gray-400">Tidak ada kata kunci</span>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MovieMetadata;