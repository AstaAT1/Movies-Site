import { useParams, useNavigate } from "react-router-dom";
import { useMovies } from "../context/movieContext";
import { FaStar, FaPlay, FaPlus , FaArrowLeft } from "../constant/icons";

function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { movies, image } = useMovies()

  const movie = movies.find((m) => m.id == parseInt(id));

  if (!movie) {
    return (
           <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-700 text-5xl font-bold">Error 404 </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="relative h-screen">
        
        <img
          src={image[movie.imageKey]}
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />
        
        <div className="absolute top-0 left-0 w-full h-full ">
          <button
            onClick={() => navigate("/")}
            className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg"
          >
            <FaArrowLeft className="text-sm"/> Back
          </button>

          <div className="absolute bottom-20 left-20 max-w-2xl">
            <h1 className="text-6xl font-bold mb-4">{movie.title}</h1>
            <div className="flex gap-4 mb-6">
              <span className="px-4 py-1 bg-red-600 rounded">{movie.type === "movie" ? "Film" : "Série"}</span>
              <span className="px-2 py-1 bg-gray-700 rounded flex gap-2 ">  <FaStar className="text-yellow-400 text-xl" /> {movie.rating}</span>
              <span className="px-4 py-1 bg-gray-700 rounded">{movie.year}</span>
              <span className="px-4 py-1 bg-gray-700 rounded">{movie.ageRating}</span>
            </div>
            <p className="text-lg text-gray-300 mb-6">{movie.description}</p>
            <div className="flex gap-4">
              <button className="px-8 py-3 flex cursor-pointer justify-center items-center gap-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200">
               <FaPlay/>  Watch Now
              </button>
              <button className="px-8 py-3 flex items-center gap-2 bg-gray-700 rounded-lg">
               <FaPlus/> Add To My List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-20 py-12">
        <div className="grid grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="col-span-2">
            <h2 className="text-3xl font-bold mb-4">Summary</h2>
            <p className="text-gray-300 text-lg mb-8">{movie.plot}</p>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Type</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-800 rounded-full">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Actors</h3>
              <p className="text-gray-300">{movie.cast.join(", ")}</p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Informations</h3>
              
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Director</p>
                <p className="text-white">{movie.director || movie.creator}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="text-white">{movie.duration}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm">Language</p>
                <p className="text-white">{movie.language}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm">Country</p>
                <p className="text-white">{movie.country}</p>
              </div>

              {movie.budget && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Budget</p>
                  <p className="text-white">{movie.budget}</p>
                </div>
              )}

              {movie.boxOffice && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Box Office</p>
                  <p className="text-white">{movie.boxOffice}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-gray-400 text-sm">Rewards</p>
                {movie.awards.map((award, index) => (
                  <p key={index} className="text-white text-sm"> {award}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;