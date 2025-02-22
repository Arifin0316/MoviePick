import HeroSection from "@/components/header"
import MovieCredits from "@/components/MovieCredits"
import MovieMetadata from "@/components/movieMetadata"
import MovieRecommendations from "@/components/MovieRecommendationsDetail"

 async function DetailMoviePage({params} : {params: Promise<{id: string}>}) {
  const id = (await params).id
  return (
    <div className="">
      <HeroSection movieId={parseInt(id)}/>
      <MovieCredits movieId={parseInt(id)}/>
      <MovieMetadata movieId={parseInt(id)}/>
      <MovieRecommendations movieId={parseInt(id)}/>
      <h1>{id}</h1>
    </div>
  )
}

export default DetailMoviePage
