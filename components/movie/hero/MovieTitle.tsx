"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface MovieTitleProps {
  title: string;
  tagline?: string;
}

const MovieTitle = ({ title, tagline }: MovieTitleProps) => {
  return (
    <>
      {tagline && (
        <motion.div 
          className="mb-3 text-red-500 italic font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {tagline}
        </motion.div>
      )}
      
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {title}
      </motion.h1>
    </>
  );
};

export default MovieTitle;
