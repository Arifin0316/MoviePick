import HeroSection from "@/components/header"
import MovieCredits from "@/components/MovieCredits"
import MovieMetadata from "@/components/movieMetadata"
import MovieRecommendations from "@/components/MovieRecommendationsDetail"

 async function DetailMoviePage({params} : {params: Promise<{id: string}>}) {
  const id = (await params).id
  return (
    <div className="mt-10">
      <HeroSection movieId={parseInt(id)}/>
      <div className="bg-gradient-to-b from-black via-gray-900 to-black">
      <MovieCredits movieId={parseInt(id)}/>
      <MovieMetadata movieId={parseInt(id)}/>
      <MovieRecommendations movieId={parseInt(id)}/>
      </div>
    </div>
  )
}

export default DetailMoviePage
