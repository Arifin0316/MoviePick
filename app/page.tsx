"use client";
import HeroSection from "../components/heroSection";
import CardGrid from "../components/cardGrid";
import MovieRecommendations from "../components/movieRecommendations";

export default function Home() {
  return (
    <main className="min-h-screen mt-15">
      {/* Hero Section */}
      <section className="relative">
        <HeroSection />
      </section>

      {/* Popular Movies Section */}
          <div className="bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="py-8">
            <CardGrid />
          </div>
          <div className="py-12">
            <MovieRecommendations />
          </div>

          </div>
    </main>
  );
}