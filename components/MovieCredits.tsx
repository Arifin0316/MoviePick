"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

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

  if (loading) {
    return (
      <div className="container mx-auto p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-64 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cast Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Pemeran Utama</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cast.map((actor) => (
            <div
              key={actor.uniqueKey}
              className="bg-white rounded-lg shadow-md overflow-hidden"
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
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {actor.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-1">
                  sebagai {actor.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Crew Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Tim Produksi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {crew.map((member) => (
            <div
              key={member.uniqueKey}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
                        : "/default-placeholder.png"
                    }
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold line-clamp-1">{member.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-1">
                    {member.job}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieCredits;
