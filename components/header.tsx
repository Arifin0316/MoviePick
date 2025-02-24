"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Star, Calendar, Clock, Users, TrendingUp, Tag } from 'lucide-react';
import TrailerModal from './TrailerModal';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
  popularity: number;
  vote_count: number;
}

interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
}

interface HeroSectionProps {
  movieId: number;
}

const HeroSection = ({ movieId }: HeroSectionProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
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
        
        setMovie(movieData);
        
        const filteredVideos = videosData.results
          .filter((video: Video) => video.site.toLowerCase() === 'youtube')
          .slice(0, 5);
        
        setVideos(filteredVideos);
        
        const trailer = filteredVideos.find(
          (video: Video) => video.type.toLowerCase() === 'trailer'
        );
        
        setSelectedVideo(trailer || (filteredVideos.length > 0 ? filteredVideos[0] : null));
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

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}j ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div className="h-[90vh] bg-gray-900 animate-pulse" />
    );
  }

  if (error || !movie) {
    return (
      <div className="h-[90vh] bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-700 text-red-200 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>{error || 'Film tidak ditemukan'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-[90vh] w-full overflow-hidden">
        {/* Background Image with enhanced gradient overlay */}
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center md:items-stretch gap-8">
          {/* Poster */}
          <div className="hidden md:block md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-gray-700/50 transform hover:scale-105 transition-transform duration-300">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Movie Info */}
          <div className="w-full md:w-2/3 lg:w-3/4 md:py-12 flex flex-col justify-center">
            <div className="md:max-w-3xl">
              {movie.tagline && (
                <div className="mb-3 text-red-500 italic font-medium">
                  {movie.tagline}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                {movie.title}
              </h1>
              
              {/* Movie Metadata Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-sm md:text-base">
                {/* Rating */}
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-yellow-600/30">
                  <Star className="w-4 h-4 text-yellow-500 mr-1.5" fill="#EAB308" />
                  <span className="text-yellow-400 font-semibold mr-1">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-xs">
                    ({movie.vote_count.toLocaleString()})
                  </span>
                </div>
                
                {/* Year */}
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                
                {/* Runtime */}
                {movie.runtime > 0 && (
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                
                {/* Popularity */}
                <div className="flex items-center text-gray-300">
                  <TrendingUp className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span>Popularitas: {Math.round(movie.popularity)}</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span 
                    key={genre.id}
                    className="bg-gray-800/70 backdrop-blur-sm text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-700"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              {/* Overview */}
              <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                {movie.overview || "Belum ada deskripsi untuk film ini."}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => {
                    if (selectedVideo) {
                      setIsModalOpen(true);
                    }
                  }}
                  disabled={!selectedVideo}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 
                    ${selectedVideo 
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30' 
                      : 'bg-gray-700 cursor-not-allowed text-gray-300'}`}
                >
                  <Play className="w-5 h-5" />
                  Tonton Trailer
                </button>
              </div>
              
              {/* Available Videos */}
              {videos.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-red-500" />
                    Video Lainnya
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {videos.map((video) => (
                      <button
                        key={video.key}
                        onClick={() => {
                          setSelectedVideo(video);
                          setIsModalOpen(true);
                        }}
                        className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-200
                          ${selectedVideo?.key === video.key
                            ? 'bg-red-900/30 text-red-200 border-red-800/50'
                            : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50'
                          }`}
                      >
                        {video.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Cast Teaser - Links to full credits below */}
              <div className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer" onClick={() => {
                // Scroll to MovieCredits component
                document.getElementById('movie-credits')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Users className="w-5 h-5" />
                <span>Lihat Semua Pemeran dan Kru</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Trailer Modal */}
      {selectedVideo && (
        <TrailerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoKey={selectedVideo.key}
        />
      )}
    </>
  );
};

export default HeroSection;