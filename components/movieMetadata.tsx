"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, DollarSign, BarChart2, Languages, Tag } from 'lucide-react';

interface MovieMetadata {
  status: string;
  budget: number;
  revenue: number;
  runtime: number;
  release_date: string;
  original_language: string;
  spoken_languages: Array<{ english_name: string }>;
  keywords: {
    keywords: Array<{ id: number; name: string }>;
  };
}

interface MovieMetadataProps {
  movieId: number;
}

const MovieMetadata = ({ movieId }: MovieMetadataProps) => {
  const [metadata, setMetadata] = useState<MovieMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        // Fetch movie details
        const [movieResponse, keywordsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=id-ID`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          )
        ]);

        if (!movieResponse.ok || !keywordsResponse.ok) {
          throw new Error('Gagal memuat data film');
        }

        const movieData = await movieResponse.json();
        const keywordsData = await keywordsResponse.json();

        setMetadata({ ...movieData, keywords: keywordsData });
        setError(null);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setError('Gagal memuat informasi film');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMetadata();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-700 text-red-200 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}j ${remainingMinutes}m`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-white">Status</h3>
          </div>
          <p className="text-gray-300">{metadata.status}</p>
        </div>

        {/* Runtime */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-white">Durasi</h3>
          </div>
          <p className="text-gray-300">{formatRuntime(metadata.runtime)}</p>
        </div>

        {/* Release Date */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-white">Tanggal Rilis</h3>
          </div>
          <p className="text-gray-300">
            {new Date(metadata.release_date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Budget */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-white">Anggaran</h3>
          </div>
          <p className="text-gray-300">
            {metadata.budget > 0 ? formatCurrency(metadata.budget) : 'Tidak ada data'}
          </p>
        </div>

        {/* Languages */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-white">Bahasa</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {metadata.spoken_languages.length > 0 ? (
              metadata.spoken_languages.map((lang, index) => (
                <span
                  key={index}
                  className="bg-red-900/30 text-red-200 text-sm px-3 py-1 rounded-full border border-red-800/30"
                >
                  {lang.english_name}
                </span>
              ))
            ) : (
              <span className="text-gray-400">Tidak ada data</span>
            )}
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-white">Kata Kunci</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {metadata.keywords.keywords.length > 0 ? (
              metadata.keywords.keywords.map((keyword) => (
                <span
                  key={keyword.id}
                  className="bg-gray-700/80 text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-600"
                >
                  {keyword.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400">Tidak ada kata kunci</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieMetadata;