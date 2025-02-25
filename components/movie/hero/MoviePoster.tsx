"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface MoviePosterProps {
  posterPath: string;
  title: string;
}

const MoviePoster = ({ posterPath, title }: MoviePosterProps) => {
  return (
    <motion.div 
      className="hidden md:block md:w-1/3 lg:w-1/4 flex-shrink-0"
      initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-gray-700/50 transform hover:scale-105 transition-transform duration-300">
        <Image
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    </motion.div>
  );
};

export default MoviePoster;
