"use client";

import React from 'react';
import { Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Video } from '../HeroSection';

interface VideosListProps {
  videos: Video[];
  selectedVideo: Video | null;
  onSelectVideo: (video: Video) => void;
}

const VideosList = ({ videos, selectedVideo, onSelectVideo }: VideosListProps) => {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Tag className="w-4 h-4 text-red-500" />
        Video Lainnya
      </h3>
      <div className="flex flex-wrap gap-2">
        {videos.map((video, index) => (
          <motion.button
            key={video.key}
            onClick={() => onSelectVideo(video)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-200
              ${selectedVideo?.key === video.key
                ? 'bg-red-900/30 text-red-200 border-red-800/50'
                : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50'
              }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + (index * 0.1) }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {video.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default VideosList;