"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Film } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface MovieRecommendationsProps {
  movieId: number;
}

const MovieRecommendations = ({ movieId }: MovieRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID`
        );

        if (!response.ok) {
          throw new Error("Gagal memuat rekomendasi film");
        }

        const data = await response.json();
        setRecommendations(data.results.slice(0, 6)); // Mengambil 6 rekomendasi teratas
        setError(null);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError("Gagal memuat rekomendasi film");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchRecommendations();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
          <div className="h-8 bg-gray-800 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 aspect-[2/3] rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-700 text-red-200 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Film className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Film Serupa
          </h2>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <p className="text-gray-400">Tidak ada rekomendasi film saat ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Film className="w-8 h-8 text-red-600" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Film Serupa
        </h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {recommendations.map((movie) => (
          <Link href={`/${movie.id}`} key={movie.id}>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/10">
              <div className="relative aspect-[2/3]">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/api/placeholder/300/450"
                  }
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" fill="#FACC15" />
                  {movie.vote_average.toFixed(1)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 text-white line-clamp-1">
                  {movie.title}
                </h3>
                <div className="flex justify-end">
                  <span className="text-xs text-gray-400 bg-gray-700/70 px-2 py-0.5 rounded-full">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieRecommendations;