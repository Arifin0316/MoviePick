"use client";

import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Video } from '../HeroSection';

interface TrailerButtonProps {
  selectedVideo: Video | null;
  onOpenModal: () => void;
}

const TrailerButton = ({ selectedVideo, onOpenModal }: TrailerButtonProps) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <motion.button
        onClick={() => {
          if (selectedVideo) {
            onOpenModal();
          }
        }}
        disabled={!selectedVideo}
        className={`px-6 py-3 rounded-lg flex items-center gap-2 transform transition-all duration-200 
          ${selectedVideo 
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30' 
            : 'bg-gray-700 cursor-not-allowed text-gray-300'}`}
        whileHover={selectedVideo ? { scale: 1.05 } : {}}
        whileTap={selectedVideo ? { scale: 0.95 } : {}}
      >
        <motion.div
          animate={selectedVideo ? { x: [0, 5, 0] } : {}}
          transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
        >
          <Play className="w-5 h-5" />
        </motion.div>
        Tonton Trailer
      </motion.button>
    </motion.div>
  );
};

export default TrailerButton;