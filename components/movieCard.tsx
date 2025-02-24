import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number;
  releaseDate: string;
}

const MovieCard = ({
  title,
  posterPath,
  rating,
  releaseDate,
  id,
}: MovieCardProps) => {
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

  return (
    <Link href={`/${id}`} className="block">
      <div className="transition-transform duration-200 hover:scale-105">
        <div className="relative w-full aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Poster for ${title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
            priority={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 p-4 w-full">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium">{formattedRating}</span>
                </div>
                <span className="text-sm">{getYear(releaseDate)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <h3 className="text-gray-100 font-medium line-clamp-1" title={title}>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;