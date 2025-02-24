import CardGridMovie from "@/components/cardGrideMovie"

function Moviespage() {

  return (
    <div className="bg-black">
      <CardGridMovie 
        category={'popular'}
        title={'Film Populer'}
        mediaType={'movie'}
      />
    </div>
  )
}

export default Moviespage;