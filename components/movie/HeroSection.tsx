// File: components/movie/HeroSection.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MovieBackdrop from './hero/MovieBackdrop';
import MoviePoster from './hero/MoviePoster';
import MovieTitle from './hero/MovieTitle';
import MovieMetaBadges from './hero/MovieMetaBadges';
import MovieGenres from './hero/MovieGenres';
import MovieOverview from './hero/MovieOverview';
import TrailerButton from './hero/TrailerButton';
import VideosList from './hero/VideosList';
import CastLink from './hero/CastLink';
import TrailerModal from '../TrailerModal';
import { LoadingHero, ErrorDisplay } from './hero/LoadingStates';

// Interfaces
export interface Movie {
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

export interface Video {
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

  if (loading) {
    return <LoadingHero />;
  }

  if (error || !movie) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <>
      <div className="relative min-h-[90vh] w-full overflow-hidden">
        <MovieBackdrop backdropPath={movie.backdrop_path} title={movie.title} />

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 sm:px-6 z-10 lg:px-8 py-20 flex flex-col md:flex-row items-center md:items-stretch gap-8">
          {/* Poster */}
          <MoviePoster posterPath={movie.poster_path} title={movie.title} />
          
          {/* Movie Info */}
          <div className="w-full md:w-2/3 lg:w-3/4 md:py-12 flex flex-col justify-center">
            <div className="md:max-w-3xl">
              <MovieTitle title={movie.title} tagline={movie.tagline} />
              <MovieMetaBadges 
                voteAverage={movie.vote_average} 
                voteCount={movie.vote_count} 
                releaseDate={movie.release_date} 
                runtime={movie.runtime} 
                popularity={movie.popularity} 
              />
              <MovieGenres genres={movie.genres} />
              <MovieOverview overview={movie.overview} />
              <TrailerButton 
                selectedVideo={selectedVideo} 
                onOpenModal={() => setIsModalOpen(true)} 
              />
              
              {/* Available Videos */}
              {videos.length > 1 && (
                <VideosList 
                  videos={videos} 
                  selectedVideo={selectedVideo} 
                  onSelectVideo={(video) => {
                    setSelectedVideo(video);
                    setIsModalOpen(true);
                  }} 
                />
              )}
              
              <CastLink />
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