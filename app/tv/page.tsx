import CardGrideMovie from "@/components/cardGrideMovie"

function Moviespage() {

  return (
    <div className="bg-black">
      <CardGrideMovie
        category={'popular'}
        title={'TV Series Populer'}
        mediaType={'tv'}
      />
    </div>
  )
}

export default Moviespage;
