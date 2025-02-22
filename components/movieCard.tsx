import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface MovieCardProps {
  title: string;
  posterPath: string;
  rating: number;
  releaseDate: string;
  overview: string;
}

const MovieCard = ({ title, posterPath, rating, releaseDate, overview }: MovieCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200">
      <div className="relative h-64 w-full">
        <Image
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
        <div className="flex items-center mt-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-700">{new Date(releaseDate).getFullYear()}</span>
        </div>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">{overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;