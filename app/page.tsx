"use client";
import HeroSection from "../components/heroSection";
import CardGrid from "../components/cardGrid";
import MovieRecommendations from "../components/movieRecommendations";

export default function Home() {
  return (
    <div className=" bg-black">
      <HeroSection />
      <CardGrid />
      <MovieRecommendations />
    </div>
  );
}
