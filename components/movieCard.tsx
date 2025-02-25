"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number;
  releaseDate: string;
  index?: number; // Optional index untuk staggering effect
}

const MovieCard = ({
  title,
  posterPath,
  rating,
  releaseDate,
  id,
  index = 0,
}: MovieCardProps) => {
  // Ref untuk deteksi scroll
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  // Handle missing poster image
  const imageUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : '/placeholder-movie.jpg'; // Pastikan ada gambar placeholder di public folder

  // Handle invalid rating
  const formattedRating = !isNaN(rating) ? rating.toFixed(1) : "N/A";

  // Handle invalid date
  const getYear = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.getFullYear() : "TBA";
  };

  // Variasi animasi untuk kartu saat scroll
  const scrollVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: index * 0.1, // Efek staggering berdasarkan index
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Variasi animasi untuk overlay
  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Variasi animasi untuk info
  const infoVariants = {
    rest: { y: 20, opacity: 0 },
    hover: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={scrollVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="block"
    >
      <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={`Poster for ${title}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
          priority={false}
          loading="lazy"
        />
        
        <Link href={`/${id}`}>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg"
            variants={overlayVariants}
            initial="rest"
            whileHover="hover"
          >
            <motion.div 
              className="absolute bottom-0 p-4 w-full"
              variants={infoVariants}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5">
                  <motion.span 
                    className="text-yellow-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  >
                    ★
                  </motion.span>
                  <span className="font-medium">{formattedRating}</span>
                </div>
                <span className="text-sm">{getYear(releaseDate)}</span>
              </div>
            </motion.div>
          </motion.div>
        </Link>
      </div>
      
      <motion.div 
        className="mt-2 space-y-1"
        variants={infoVariants}
      >
        <h3 className="text-gray-100 font-medium line-clamp-1" title={title}>
          {title}
        </h3>
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;