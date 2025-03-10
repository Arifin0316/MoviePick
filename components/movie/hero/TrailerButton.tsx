"use client";

import React from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { Video } from "../HeroSection";

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
          ${
            selectedVideo
              ? "group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-red-500/80 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-red-600/50 border border-white/20"
              : "bg-gray-700 cursor-not-allowed text-gray-300"
          }`}
      >
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
          <div className="relative h-full w-10 bg-white/30"></div>
        </div>
        <motion.div
          animate={selectedVideo ? { x: [0, 5, 0] } : {}}
          transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
        >
          <Play className="w-5 h-5" />
        </motion.div >
        Tonton Trailer
      </motion.button>
    </motion.div>
  );
};

export default TrailerButton;
