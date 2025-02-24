"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

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
      <div className="container mx-auto p-4">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 h-72 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (recommendations.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Film Serupa</h2>
        <p className="text-gray-600">Tidak ada rekomendasi film saat ini.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Film Serupa</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map((movie) => (
          <Link href={`${movie.id}`} key={movie.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
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
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-1">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
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
