"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface MovieOverviewProps {
  overview: string;
}

const MovieOverview = ({ overview }: MovieOverviewProps) => {
  return (
    <motion.p 
      className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {overview || "Belum ada deskripsi untuk film ini."}
    </motion.p>
  );
};

export default MovieOverview;