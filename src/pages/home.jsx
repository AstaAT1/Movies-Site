// home.jsx
import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/movieContext";
import { FaStar, FaMoon, FaSun } from "../constant/icons";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const { movies, image } = useMovies();
  
  // Dark mode 
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-950 text-white' : 'bg-white text-black'
    }`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <h1 className="text-red-600 text-3xl font-bold">LEETMOVIE</h1>
        </div>
        
        <div className={`flex text-sm gap-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Home</p>
          <p className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>TV Shows</p>
          <p className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Movies</p>
          <p className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>New & Popular</p>
          <p className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>My list</p>
        </div>

        <div className="flex gap-5">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className={`cursor-pointer w-10 h-10 opacity-40 border rounded-full flex justify-center items-center transition-all duration-300 hover:opacity-100 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                : 'bg-gray-300 border-gray-400 hover:bg-gray-400'
            }`}
          >
            {isDark ? (
              <FaSun className="text-yellow-400 text-xl" />
            ) : (
              <FaMoon className="text-gray-800 text-xl" />
            )}
          </button>

          <input 
            type="text" 
            placeholder="Search" 
            className={`text-sm px-6 py-2 rounded-md border focus:outline-none ${
              isDark 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-gray-100 text-black border-gray-300'
            }`}
          />
          <img src={image.profile} alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Movies Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-4 gap-6 mb-12">
          {movies.slice(0, 4).map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <img
                src={image[movie.imageKey]}
                alt={movie.title}
                className="w-full h-90 object-cover rounded-lg shadow-lg"
              />
              <h3 className="mt-2 font-semibold">{movie.title}</h3>
              <p className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaStar className="text-yellow-400 text-sm" /> {movie.rating}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Popular on LeetMovie</h2>
        <div className="grid grid-cols-4 gap-6">
          {movies.slice(4, 8).map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <img
                src={image[movie.imageKey]}
                alt={movie.title}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
              <h3 className="mt-2 font-semibold">{movie.title}</h3>
              <p className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaStar className="text-yellow-400 text-sm" /> {movie.rating}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;