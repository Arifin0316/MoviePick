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
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Status</h3>
          </div>
          <p className="text-gray-700">{metadata.status}</p>
        </div>

        {/* Runtime */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Durasi</h3>
          </div>
          <p className="text-gray-700">{formatRuntime(metadata.runtime)}</p>
        </div>

        {/* Release Date */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Tanggal Rilis</h3>
          </div>
          <p className="text-gray-700">
            {new Date(metadata.release_date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Anggaran</h3>
          </div>
          <p className="text-gray-700">
            {metadata.budget > 0 ? formatCurrency(metadata.budget) : 'Tidak ada data'}
          </p>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Bahasa</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {metadata.spoken_languages.map((lang, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {lang.english_name}
              </span>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Kata Kunci</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {metadata.keywords.keywords.map((keyword) => (
              <span
                key={keyword.id}
                className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
              >
                {keyword.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieMetadata;