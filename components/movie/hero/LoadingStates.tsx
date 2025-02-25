"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const LoadingHero = () => {
  return (
    <motion.div 
      className="h-[90vh] bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.5, 0.8, 0.5],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      }}
    />
  );
};

export const ErrorDisplay = ({ error }: { error: string | null }) => {
  return (
    <div className="h-[90vh] bg-gray-900 flex items-center justify-center">
      <motion.div 
        className="bg-red-900/50 border border-red-700 text-red-200 rounded-lg p-6 max-w-md text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p>{error || 'Film tidak ditemukan'}</p>
      </motion.div>
    </div>
  );
};