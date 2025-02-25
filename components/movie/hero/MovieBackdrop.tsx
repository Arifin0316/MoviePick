"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface MovieBackdropProps {
  backdropPath: string;
  title: string;
}

const MovieBackdrop = ({ backdropPath, title }: MovieBackdropProps) => {
  return (
    <motion.div 
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Image
        src={`https://image.tmdb.org/t/p/original${backdropPath}`}
        alt={title}
        fill
        className="object-cover"
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    </motion.div>
  );
};

export default MovieBackdrop;
