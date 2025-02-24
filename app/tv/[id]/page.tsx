// app/tv/[id]/page.tsx
import CardGridMovie from "@/components/cardGrideMovie";

type TVCategory = {
  [key: string]: {
    title: string;
    endpoint: string;
  }
};

const TV_CATEGORIES: TVCategory = {
  'airing-today': {
    title: 'Tayang Hari Ini',
    endpoint: 'airing_today'
  },
  'on-the-air': {
    title: 'Sedang Tayang di TV',
    endpoint: 'on_the_air'
  },
  'top-rated': {
    title: 'TV Series Top Rating',
    endpoint: 'top_rated'
  }
};

async function TVCategoryPage({params} : {params: Promise<{id: string}>}) {
  const id = (await params).id
  const category = TV_CATEGORIES[id];
  
  if (!category) {
    return <div className="text-center py-10">Kategori tidak ditemukan</div>;
  }

  return (
    <div className="bg-black">
      <CardGridMovie
        category={category.endpoint}
        title={category.title}
        mediaType={'tv'}
      />
    </div>
  );
}

export default TVCategoryPage;