// RatingStars.jsx — Theme-aware star rating
import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Badge } from "../ui/Badge";

export default function RatingStars({ movieId, averageRating }) {
    const [ratings, setRatings] = useLocalStorage("leetmovie-ratings", {});
    const [hoverRating, setHoverRating] = useState(0);
    const userRating = ratings[movieId] || 0;
    const displayRating = hoverRating || userRating;

    const handleRate = (value) => {
        setRatings((prev) => ({ ...prev, [movieId]: prev[movieId] === value ? 0 : value }));
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <Badge variant="gold" className="flex items-center gap-1.5 px-3 py-1">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    <span className="font-bold text-sm">{averageRating?.toFixed(1)}</span>
                </Badge>
                <span className="text-muted-foreground text-sm">Average Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-sm mr-1">Your Rating:</span>
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((v) => (
                        <motion.button key={v} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleRate(v)} onMouseEnter={() => setHoverRating(v)} onMouseLeave={() => setHoverRating(0)}
                            className="cursor-pointer p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded" aria-label={`Rate ${v}`}>
                            <Star className={`h-5 w-5 transition-all duration-150 ${v <= displayRating ? "fill-gold text-gold" : "fill-transparent text-border hover:text-muted-foreground"}`} />
                        </motion.button>
                    ))}
                </div>
                {userRating > 0 && (
                    <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-gold text-sm font-medium ml-2">{userRating}/5</motion.span>
                )}
            </div>
        </div>
    );
}
