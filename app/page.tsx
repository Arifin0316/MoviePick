"use client";
import HeroSection from "../components/heroSection";
import CardGrid from "../components/cardGrid";
import MovieRecommendations from "../components/movieRecommendations";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative">
        <HeroSection />
      </section>

      {/* Popular Movies Section */}
      <section className="relative z-10 -mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <CardGrid />
          </div>
        </div>
      </section>

      {/* Movie Recommendations Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black -z-10" 
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <MovieRecommendations />
          </div>
        </div>
      </section>

      {/* Footer Gradient */}
      <div 
        className="h-16 bg-gradient-to-t from-black to-transparent" 
        aria-hidden="true"
      />
    </main>
  );
}