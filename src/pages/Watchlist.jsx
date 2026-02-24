// Watchlist.jsx — Theme-aware watchlist with Container + consistent spacing
import { motion } from "framer-motion";
import { Bookmark, Film } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Separator } from "../components/ui/Separator";
import Container from "../components/layout/Container";
import Navbar from "../components/layout/Navbar";
import PageTransition from "../components/layout/PageTransition";
import MovieCard from "../components/movie/MovieCard";
import TrailerModal from "../components/movie/TrailerModal";
import { useMovies } from "../context/movieContext";
import { useWatchlist } from "../hooks/useWatchlist";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WatchlistPage() {
    const { movies } = useMovies();
    const { watchlist } = useWatchlist();
    const [trailerMovie, setTrailerMovie] = useState(null);
    const navigate = useNavigate();
    const watchlistMovies = movies.filter((m) => watchlist.includes(m.id));

    return (
        <PageTransition>
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                {/* pt-24 clears navbar; pb-16 bottom room */}
                <main className="pt-24 lg:pt-28 pb-16">
                    <Container>
                        <div className="space-y-8">
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <h1 className="text-2xl lg:text-3xl font-black flex items-center gap-3 mb-2 font-display">
                                    <Bookmark className="h-7 w-7 text-primary" /> My Watchlist
                                </h1>
                                <p className="text-muted-foreground text-sm">{watchlistMovies.length} title{watchlistMovies.length !== 1 ? "s" : ""} saved</p>
                            </motion.div>

                            <Separator />

                            {watchlistMovies.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6">
                                    {watchlistMovies.map((movie, i) => <MovieCard key={movie.id} movie={movie} index={i} onPlayTrailer={setTrailerMovie} />)}
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6 animate-float">
                                        <Film className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2 font-display">Your watchlist is empty</h3>
                                    <p className="text-muted-foreground text-sm mb-6">Start adding movies and series to watch later</p>
                                    <Button onClick={() => navigate("/")} className="gap-2">Browse Movies</Button>
                                </motion.div>
                            )}
                        </div>
                    </Container>
                </main>
                <TrailerModal movie={trailerMovie} isOpen={!!trailerMovie} onClose={() => setTrailerMovie(null)} />
            </div>
        </PageTransition>
    );
}
