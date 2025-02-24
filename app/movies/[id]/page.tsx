import CardGridMovie from "@/components/cardGrideMovie"

// Definisikan tipe untuk kategori yang valid
type MovieCategory = {
  [key: string]: {
    title: string;
    endpoint: string;
  }
};

// Mapping kategori ke endpoint TMDB API
const MOVIE_CATEGORIES: MovieCategory = {
  'now-playing': {
    title: 'Sedang Tayang',
    endpoint: 'now_playing'
  },
  'upcoming': {
    title: 'Film Mendatang',
    endpoint: 'upcoming'
  },
  'top-rated': {
    title: 'Film Top Rating',
    endpoint: 'top_rated'
  }
};

async function MoviesCatagoripage({params} : {params: Promise<{id: string}>}) {
  const id = (await params).id
  const category = MOVIE_CATEGORIES[id];
  
  if (!category) {
    return <div className="text-center py-10">Kategori tidak ditemukan</div>;
  }

  return (
    <div className="bg-black mt-15 ">
      <CardGridMovie 
        category={category.endpoint}
        title={category.title}
        mediaType={'movie'}
      />
    </div>
  );
}

export default MoviesCatagoripage;