"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Star } from 'lucide-react';
import TrailerModal from './TrailerModal';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
}

interface Video {
  key: string;
  site: string;
  type: string;
}

interface HeroSectionProps {
  movieId: number;
}

const HeroSection = ({ movieId }: HeroSectionProps) => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieAndTrailer = async () => {
      try {
        setLoading(true);
        const [movieResponse, videosResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          )
        ]);
        
        if (!movieResponse.ok || !videosResponse.ok) {
          throw new Error('Film tidak ditemukan');
        }
        
        const movieData = await movieResponse.json();
        const videosData = await videosResponse.json();
        
        setFeaturedMovie(movieData);
        
        const trailer = videosData.results.find(
          (video: Video) => 
            video.type.toLowerCase() === 'trailer' && 
            video.site.toLowerCase() === 'youtube'
        );
        
        setTrailer(trailer || null);
        setError(null);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError('Gagal memuat data film');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieAndTrailer();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="h-[80vh] bg-gray-900 animate-pulse" />
    );
  }

  if (error || !featuredMovie) {
    return (
      <div className="h-[80vh] bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">{error || 'Film tidak ditemukan'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[80vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            fill
            className="object-cover"
            priority = {true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {featuredMovie.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 text-yellow-400 font-semibold">
                  {featuredMovie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">
                {new Date(featuredMovie.release_date).getFullYear()}
              </span>
            </div>

            <p className="text-gray-300 text-lg mb-8 line-clamp-3">
              {featuredMovie.overview}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!trailer}
                className={`px-8 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 
                  ${trailer 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-600 cursor-not-allowed text-gray-300'}`}
              >
                <Play className="w-5 h-5" />
                Watch Trailer
              </button>
              <button className="bg-gray-800/80 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transform hover:scale-105 transition-transform duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailer && (
        <TrailerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoKey={trailer.key}
        />
      )}
    </>
  );
};

export default HeroSection;