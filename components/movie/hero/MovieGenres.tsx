"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Genre {
  id: number;
  name: string;
}

interface MovieGenresProps {
  genres: Genre[];
}

const MovieGenres = ({ genres }: MovieGenresProps) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-2 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {genres.map((genre, index) => (
        <motion.span 
          key={genre.id}
          className="bg-gray-800/70 backdrop-blur-sm text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-700"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + (index * 0.1) }}
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            borderColor: "rgba(239, 68, 68, 0.5)"
          }}
        >
          {genre.name}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default MovieGenres;
