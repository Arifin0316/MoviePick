"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Users, Film } from "lucide-react";
import { motion } from "framer-motion";

interface CastMember {
  uniqueKey: string;
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  uniqueKey: string;
}

interface MovieCreditsProps {
  movieId: number;
}

const MovieCredits = ({ movieId }: MovieCreditsProps) => {
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const castSectionRef = useRef(null);
  const crewSectionRef = useRef(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID`
        );

        if (!response.ok) {
          throw new Error("Gagal memuat data credits");
        }

        const data = await response.json();
        setCast(
          data.cast
            .slice(0, 10)
            .map((actor: CastMember, index: number) => ({
              ...actor,
              uniqueKey: `${actor.id}-${index}`,
            }))
        ); // Tambahkan uniqueKey untuk menghindari duplikasi

        setCrew(
          data.crew
            .filter((member: CrewMember) =>
              ["Director", "Producer", "Screenplay", "Writer"].includes(
                member.job
              )
            )
            .map((member: CrewMember, index: number) => ({
              ...member,
              uniqueKey: `${member.id}-${member.job}-${index}`,
            }))
        ); // Tambahkan uniqueKey berdasarkan ID, job, dan index

        setError(null);
      } catch (error) {
        console.error("Error fetching credits:", error);
        setError("Gagal memuat data pemain dan kru");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchCredits();
    }
  }, [movieId]);

  // Variasi animasi
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
        ease: "easeOut"
      }
    })
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="h-8 bg-gray-800 rounded w-48 mb-6"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        ></motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i} 
              className="bg-gray-800 h-64 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="bg-red-900/50 border border-red-700 text-red-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div id="movie-credits" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cast Section */}
      <motion.section 
        className="mb-12"
        ref={castSectionRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.div 
          className="flex items-center gap-3 mb-6"
          variants={sectionVariants}
        >
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            viewport={{ once: false }}
          >
            <Users className="w-6 h-6 text-red-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Pemeran Utama</h2>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {cast.map((actor, index) => (
            <motion.div
              key={actor.uniqueKey}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/10"
              custom={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                      : "/default-placeholder.png"
                  }
                  alt={actor.name}
                  unoptimized={true}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  viewport={{ once: false }}
                ></motion.div>
              </div>
              <motion.div 
                className="p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                viewport={{ once: false }}
              >
                <h3 className="font-semibold text-lg text-white line-clamp-1">
                  {actor.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-1">
                  sebagai {actor.character}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Crew Section */}
      <motion.section
        ref={crewSectionRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.div 
          className="flex items-center gap-3 mb-6"
          variants={sectionVariants}
        >
          <motion.div
            initial={{ rotate: 10, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            viewport={{ once: false }}
          >
            <Film className="w-6 h-6 text-red-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Tim Produksi</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {crew.map((member, index) => (
            <motion.div
              key={member.uniqueKey}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors duration-300"
              custom={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 4px 20px -2px rgba(239, 68, 68, 0.2)",
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative h-16 w-16 flex-shrink-0 ring-2 ring-red-600/30 rounded-full overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                >
                  <Image
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
                        : "/default-placeholder.png"
                    }
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  viewport={{ once: false }}
                >
                  <h3 className="font-semibold text-white line-clamp-1">{member.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-1">
                    {member.job}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default MovieCredits;