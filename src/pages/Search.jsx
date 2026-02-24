// Search.jsx — Theme-aware search page with Container + consistent spacing
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, SlidersHorizontal, X, Film, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Separator } from "../components/ui/Separator";
import Container from "../components/layout/Container";
import Navbar from "../components/layout/Navbar";
import PageTransition from "../components/layout/PageTransition";
import MovieCard from "../components/movie/MovieCard";
import TrailerModal from "../components/movie/TrailerModal";
import { useMovies } from "../context/movieContext";
import { useDebounce } from "../hooks/useDebounce";

const selectClass = "w-full h-9 rounded-lg bg-background border border-input text-foreground text-sm px-3 focus:ring-2 focus:ring-ring/40 focus:border-ring/50 focus:outline-none transition-colors appearance-none cursor-pointer";

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { searchMovies, allGenres, allYears } = useMovies();
    const [trailerMovie, setTrailerMovie] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const query = searchParams.get("q") || "";
    const typeFilter = searchParams.get("type") || "";
    const yearFilter = searchParams.get("year") || "";
    const ratingFilter = searchParams.get("rating") || "";
    const genreFilter = searchParams.get("genre") || "";

    const [inputValue, setInputValue] = useState(query);
    const debouncedInput = useDebounce(inputValue, 300);

    useEffect(() => {
        if (debouncedInput !== query) {
            const params = new URLSearchParams(searchParams);
            debouncedInput ? params.set("q", debouncedInput) : params.delete("q");
            setSearchParams(params, { replace: true });
        }
    }, [debouncedInput]);

    useEffect(() => { setInputValue(query); }, [query]);

    const results = useMemo(() => searchMovies(query, { type: typeFilter, year: yearFilter, rating: ratingFilter, genre: genreFilter }), [query, typeFilter, yearFilter, ratingFilter, genreFilter]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        value ? params.set(key, value) : params.delete(key);
        setSearchParams(params, { replace: true });
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        setSearchParams(params, { replace: true });
    };

    const hasFilters = typeFilter || yearFilter || ratingFilter || genreFilter;

    return (
        <PageTransition>
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                {/* pt-24 clears sticky navbar; pb-16 bottom breathing room */}
                <main className="pt-24 lg:pt-28 pb-16">
                    <Container>
                        <div className="space-y-8">
                            {/* Header + Search */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <h1 className="text-2xl lg:text-3xl font-black mb-6 font-display">
                                    {query ? <>Results for <span className="text-gradient">"{query}"</span></> : "Browse All"}
                                </h1>

                                <div className="flex gap-3 mb-4">
                                    <div className="relative flex-1 max-w-lg">
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search movies & series..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="pl-10" aria-label="Search" />
                                    </div>
                                    <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2">
                                        <SlidersHorizontal className="h-4 w-4" /> Filters
                                        {hasFilters && <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] ml-0.5">!</Badge>}
                                    </Button>
                                </div>

                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                            <div className="rounded-xl border border-border bg-card p-5 mb-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <p className="text-sm font-medium text-foreground font-display">Filters</p>
                                                    {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-primary"><X className="h-3 w-3 mr-1" /> Clear all</Button>}
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    <div><label className="text-[11px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Type</label><select value={typeFilter} onChange={(e) => updateFilter("type", e.target.value)} className={selectClass}><option value="">All</option><option value="movie">Movie</option><option value="series">Series</option></select></div>
                                                    <div><label className="text-[11px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Year</label><select value={yearFilter} onChange={(e) => updateFilter("year", e.target.value)} className={selectClass}><option value="">All Years</option>{allYears.map((y) => <option key={y} value={y}>{y}</option>)}</select></div>
                                                    <div><label className="text-[11px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Min Rating</label><select value={ratingFilter} onChange={(e) => updateFilter("rating", e.target.value)} className={selectClass}><option value="">Any</option>{[9, 8.5, 8, 7.5, 7].map((r) => <option key={r} value={r}>{r}+</option>)}</select></div>
                                                    <div><label className="text-[11px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Genre</label><select value={genreFilter} onChange={(e) => updateFilter("genre", e.target.value)} className={selectClass}><option value="">All Genres</option>{allGenres.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {hasFilters && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {typeFilter && <Badge variant="secondary" className="cursor-pointer hover:bg-accent gap-1" onClick={() => updateFilter("type", "")}><Film className="h-3 w-3" />{typeFilter}<X className="h-3 w-3 ml-1" /></Badge>}
                                        {yearFilter && <Badge variant="secondary" className="cursor-pointer hover:bg-accent gap-1" onClick={() => updateFilter("year", "")}>{yearFilter}<X className="h-3 w-3 ml-1" /></Badge>}
                                        {ratingFilter && <Badge variant="secondary" className="cursor-pointer hover:bg-accent gap-1" onClick={() => updateFilter("rating", "")}><Star className="h-3 w-3" />{ratingFilter}+<X className="h-3 w-3 ml-1" /></Badge>}
                                        {genreFilter && <Badge variant="secondary" className="cursor-pointer hover:bg-accent gap-1" onClick={() => updateFilter("genre", "")}>{genreFilter}<X className="h-3 w-3 ml-1" /></Badge>}
                                    </div>
                                )}

                                <p className="text-muted-foreground text-sm">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
                            </motion.div>

                            <Separator />

                            {/* Results Grid — gap-5 between cards */}
                            {results.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6">
                                    {results.map((movie, i) => <MovieCard key={movie.id} movie={movie} index={i} onPlayTrailer={setTrailerMovie} />)}
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                                        <SearchIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2 font-display">No results found</h3>
                                    <p className="text-muted-foreground text-sm mb-6">Try different keywords or adjust the filters</p>
                                    <Button variant="outline" onClick={() => { setInputValue(""); clearFilters(); }}>Clear Search</Button>
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
