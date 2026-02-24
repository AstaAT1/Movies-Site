// MovieCard.jsx — Consistent card with rating INSIDE poster. No floating elements.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Plus, Check, Star } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";
import { useMovies } from "../../context/movieContext";
import { useWatchlist } from "../../hooks/useWatchlist";

export default function MovieCard({ movie, index = 0, onPlayTrailer }) {
    const navigate = useNavigate();
    const { image } = useMovies();
    const { isInWatchlist, toggleWatchlist } = useWatchlist();
    const [imageLoaded, setImageLoaded] = useState(false);
    const inWatchlist = isInWatchlist(movie.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative flex-shrink-0 w-[150px] sm:w-[160px] md:w-[170px] lg:w-[180px] cursor-pointer snap-start"
            onClick={() => navigate(`/movie/${movie.id}`)}
        >
            {/* Poster — relative container keeps ALL badges inside */}
            <motion.div
                whileHover={{ scale: 1.04, zIndex: 20 }}
                transition={{ type: "spring", damping: 24, stiffness: 300 }}
                className="relative rounded-lg overflow-hidden shadow-sm group-hover:shadow-lg dark:group-hover:shadow-primary/8"
            >
                {/* Skeleton */}
                {!imageLoaded && <div className="absolute inset-0 animate-shimmer rounded-lg" />}

                {/* Image */}
                <img
                    src={image[movie.imageKey]}
                    alt={movie.title}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full aspect-[2/3] object-cover transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                        } group-hover:brightness-[0.3] group-hover:scale-[1.03]`}
                />

                {/* Rating Badge — INSIDE poster, top-right, never floating outside */}
                <div className="absolute top-2 right-2 z-10">
                    <span className="flex items-center gap-0.5 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                        <Star className="h-2.5 w-2.5 fill-gold text-gold" />
                        <span className="text-[10px] font-bold text-white leading-none">{movie.rating}</span>
                    </span>
                </div>

                {/* Hover ring */}
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent group-hover:ring-white/10 transition-all pointer-events-none" />

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="relative z-10">
                        <h3 className="text-white font-semibold text-xs mb-1 line-clamp-2 leading-snug font-display">
                            {movie.title}
                        </h3>
                        <p className="text-white/50 text-[10px] mb-2.5">
                            {movie.year} · {movie.duration}
                        </p>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <Tooltip content="Trailer">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); onPlayTrailer?.(movie); }}
                                    className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-sm"
                                    aria-label="Play trailer"
                                >
                                    <Play className="h-3 w-3 ml-px" />
                                </motion.button>
                            </Tooltip>

                            <Tooltip content={inWatchlist ? "Remove" : "Add"}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie.id); }}
                                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${inWatchlist
                                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                            : "border-white/20 text-white hover:border-white/40"
                                        }`}
                                    aria-label={inWatchlist ? "Remove" : "Add"}
                                >
                                    {inWatchlist ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                </motion.button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Title + Year below poster — mt-2 creates clear separation from poster */}
            <div className="mt-2 space-y-0.5 px-0.5">
                <h3 className="text-foreground text-xs font-medium truncate group-hover:text-primary transition-colors font-display">
                    {movie.title}
                </h3>
                <p className="text-muted-foreground text-[10px]">{movie.year}</p>
            </div>
        </motion.div>
    );
}
