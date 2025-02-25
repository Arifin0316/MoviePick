"use client";

import React from 'react';
import { Star, Calendar, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieMetaBadgesProps {
  voteAverage: number;
  voteCount: number;
  releaseDate: string;
  runtime: number;
  popularity: number;
}

const MovieMetaBadges = ({ 
  voteAverage, 
  voteCount, 
  releaseDate, 
  runtime, 
  popularity 
}: MovieMetaBadgesProps) => {
  
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}j ${remainingMinutes}m`;
  };

  return (
    <motion.div 
      className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-sm md:text-base"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Rating */}
      <motion.div 
        className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-yellow-600/30"
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Star className="w-4 h-4 text-yellow-500 mr-1.5" fill="#EAB308" />
        </motion.div>
        <span className="text-yellow-400 font-semibold mr-1">
          {voteAverage.toFixed(1)}
        </span>
        <span className="text-gray-400 text-xs">
          ({voteCount.toLocaleString()})
        </span>
      </motion.div>
      
      {/* Year */}
      <motion.div 
        className="flex items-center text-gray-300"
        whileHover={{ scale: 1.05 }}
      >
        <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
        <span>{new Date(releaseDate).getFullYear()}</span>
      </motion.div>
      
      {/* Runtime */}
      {runtime > 0 && (
        <motion.div 
          className="flex items-center text-gray-300"
          whileHover={{ scale: 1.05 }}
        >
          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
          <span>{formatRuntime(runtime)}</span>
        </motion.div>
      )}
      
      {/* Popularity */}
      <motion.div 
        className="flex items-center text-gray-300"
        whileHover={{ scale: 1.05 }}
      >
        <TrendingUp className="w-4 h-4 mr-1.5 text-gray-400" />
        <span>Popularitas: {Math.round(popularity)}</span>
      </motion.div>
    </motion.div>
  );
};

export default MovieMetaBadges;
