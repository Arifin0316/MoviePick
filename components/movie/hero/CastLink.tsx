"use client";

import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CastLink = () => {
  return (
    <motion.div 
      className="flex items-center gap-2 text-gray-400 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      whileHover={{ color: "#f87171", x: 5 }}
      onClick={() => {
        // Scroll to MovieCredits component
        document.getElementById('movie-credits')?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      <Users className="w-5 h-5" />
      <span>Lihat Semua Pemeran dan Kru</span>
    </motion.div>
  );
};

export default CastLink;