// movieContext.jsx — Provider with WORKING theme toggle + movie data
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import movies from "../data/Movie";
import image from "../constant/image";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // Theme — reads from localStorage with system preference fallback
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("leetmovie-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Sync dark class on <html> + persist
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("leetmovie-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Categorize movies
  const trending = useMemo(
    () => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 8),
    []
  );
  const topRated = useMemo(
    () => [...movies].filter((m) => m.rating >= 8.5),
    []
  );
  const newReleases = useMemo(
    () => [...movies].sort((a, b) => b.year - a.year).slice(0, 8),
    []
  );
  const moviesByGenre = useMemo(() => {
    const map = {};
    movies.forEach((m) =>
      m.genre.forEach((g) => {
        if (!map[g]) map[g] = [];
        if (!map[g].find((x) => x.id === m.id)) map[g].push(m);
      })
    );
    return map;
  }, []);

  const getMovieById = (id) => movies.find((m) => m.id === parseInt(id));

  const getSimilarMovies = (movieId) => {
    const movie = getMovieById(movieId);
    if (!movie) return [];
    return movies
      .filter((m) => m.id !== movie.id && m.genre.some((g) => movie.genre.includes(g)))
      .slice(0, 6);
  };

  const searchMovies = (query, filters = {}) => {
    let results = [...movies];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q)) ||
          m.cast?.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (filters.type) results = results.filter((m) => m.type === filters.type);
    if (filters.year) results = results.filter((m) => m.year === parseInt(filters.year));
    if (filters.rating) results = results.filter((m) => m.rating >= parseFloat(filters.rating));
    if (filters.genre)
      results = results.filter((m) =>
        m.genre.some((g) => g.toLowerCase() === filters.genre.toLowerCase())
      );
    return results;
  };

  const allGenres = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => m.genre.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, []);

  const allYears = useMemo(() => {
    return Array.from(new Set(movies.map((m) => m.year))).sort((a, b) => b - a);
  }, []);

  return (
    <MovieContext.Provider
      value={{
        movies, image, isDark, toggleTheme,
        trending, topRated, newReleases, moviesByGenre,
        getMovieById, getSimilarMovies, searchMovies,
        allGenres, allYears,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error("useMovies must be used within MovieProvider");
  return ctx;
};

export default MovieProvider;
