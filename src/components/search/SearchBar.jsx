// SearchBar.jsx — Theme-aware live search with keyboard navigation
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star } from "lucide-react";
import { Input } from "../ui/Input";
import { useMovies } from "../../context/movieContext";
import { useDebounce } from "../../hooks/useDebounce";

export default function SearchBar({ className = "", onNavigate }) {
    const { movies, image } = useMovies();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debouncedQuery = useDebounce(query, 300);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const suggestions = debouncedQuery.trim()
        ? movies.filter((m) => m.title.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0, 5)
        : [];
    const showSuggestions = isFocused && suggestions.length > 0;

    useEffect(() => {
        const handleClickOutside = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsFocused(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => { setActiveIndex(-1); }, [debouncedQuery]);

    const handleSubmit = useCallback((e) => {
        e?.preventDefault();
        if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setIsFocused(false); setQuery(""); onNavigate?.(); }
    }, [query, navigate, onNavigate]);

    const handleSelect = useCallback((movie) => {
        navigate(`/movie/${movie.id}`); setQuery(""); setIsFocused(false); onNavigate?.();
    }, [navigate, onNavigate]);

    const handleKeyDown = useCallback((e) => {
        if (!showSuggestions) return;
        switch (e.key) {
            case "ArrowDown": e.preventDefault(); setActiveIndex((p) => p < suggestions.length - 1 ? p + 1 : p); break;
            case "ArrowUp": e.preventDefault(); setActiveIndex((p) => p > 0 ? p - 1 : -1); break;
            case "Enter": e.preventDefault(); activeIndex >= 0 ? handleSelect(suggestions[activeIndex]) : handleSubmit(e); break;
            case "Escape": setIsFocused(false); break;
        }
    }, [showSuggestions, activeIndex, suggestions, handleSelect, handleSubmit]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input ref={inputRef} placeholder="Search movies & series..." value={query}
                    onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsFocused(true)} onKeyDown={handleKeyDown}
                    className="pl-10 pr-10" aria-label="Search" role="combobox" aria-expanded={showSuggestions} />
                {query && (
                    <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" aria-label="Clear">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </form>

            <AnimatePresence>
                {showSuggestions && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-popover shadow-lg z-50 overflow-hidden" role="listbox">
                        {suggestions.map((movie, idx) => (
                            <motion.button key={movie.id} onClick={() => handleSelect(movie)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left cursor-pointer ${idx === activeIndex ? "bg-accent" : "hover:bg-accent/50"}`}
                                role="option" aria-selected={idx === activeIndex}>
                                <img src={image[movie.imageKey]} alt={movie.title} className="w-9 h-13 object-cover rounded-md flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground text-sm font-medium truncate">{movie.title}</p>
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                        <span>{movie.year}</span>
                                        <span className="opacity-30">•</span>
                                        <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-gold text-gold" />{movie.rating}</span>
                                        <span className="opacity-30">•</span>
                                        <span>{movie.type === "movie" ? "Movie" : "Series"}</span>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                        <button onClick={handleSubmit} className="w-full px-4 py-2.5 text-sm text-primary hover:bg-accent/50 transition-colors text-center border-t border-border cursor-pointer">
                            View all results for "{debouncedQuery}"
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
