import CardGridMovie from "@/components/cardGrideMovie"

function Moviespage() {

  return (
    <div className="bg-black mt-15">
      <CardGridMovie 
        category={'popular'}
        title={'Film Populer'}
        mediaType={'movie'}
      />
    </div>
  )
}

export default Moviespage;