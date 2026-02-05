import { createContext, useContext } from "react";
import movies from "../data/Movie";
import image from "../constant/image";

// Create Context
export const MovieContext = createContext();

// Provider
export const MovieProvider = ({ children }) => {
  return (
    <MovieContext.Provider value={{ movies, image }}>
      {children}
    </MovieContext.Provider>
  );
};

// Hook
export const useMovies = () => {
  return useContext(MovieContext);
};

export default MovieProvider;

