// MovieCarousel.jsx — Horizontal carousel with consistent spacing
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ title, movies, onPlayTrailer }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 4);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener("scroll", checkScroll, { passive: true });
        return () => el?.removeEventListener("scroll", checkScroll);
    }, []);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.clientWidth * 0.65;
        scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section className="space-y-3">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="flex items-center justify-between"
            >
                <h2 className="text-base lg:text-lg font-bold text-foreground font-display">{title}</h2>
            </motion.div>

            {/* Carousel Track */}
            <div className="relative group/carousel -mx-4 md:-mx-6">
                {/* Arrows */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-1 top-[40%] -translate-y-1/2 z-20 w-9 h-9 rounded-full glass flex items-center justify-center text-foreground hover:bg-accent transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer shadow-sm"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
                {canScrollRight && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-1 top-[40%] -translate-y-1/2 z-20 w-9 h-9 rounded-full glass flex items-center justify-center text-foreground hover:bg-accent transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer shadow-sm"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}

                {/* Edge Fades */}
                {canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                )}
                {canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                )}

                {/* Scroll Row: gap-4 gives breathing room between cards, pb-2 prevents cut-off */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-2 snap-x snap-mandatory"
                >
                    {movies.map((movie, i) => (
                        <MovieCard key={movie.id} movie={movie} index={i} onPlayTrailer={onPlayTrailer} />
                    ))}
                </div>
            </div>
        </section>
    );
}
