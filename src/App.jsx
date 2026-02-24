// App.jsx — Routing with lazy loading and page transitions
import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const Home = lazy(() => import("./pages/home"));
const MovieDetails = lazy(() => import("./components/MovieDetails"));
const SearchPage = lazy(() => import("./pages/Search"));
const WatchlistPage = lazy(() => import("./pages/Watchlist"));
const Error = lazy(() => import("./pages/error"));

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;