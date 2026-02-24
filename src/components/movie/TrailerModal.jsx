// TrailerModal.jsx — Theme-aware trailer player modal
import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

function getYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

export default function TrailerModal({ movie, isOpen, onClose }) {
    const closeRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Tab" && closeRef.current) { e.preventDefault(); closeRef.current.focus(); }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
            setTimeout(() => closeRef.current?.focus(), 100);
        }
        return () => { document.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = ""; };
    }, [isOpen, handleKeyDown]);

    const videoId = movie ? getYouTubeId(movie.trailer) : null;

    return (
        <AnimatePresence>
            {isOpen && movie && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Backdrop — always dark */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/85 backdrop-blur-lg"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 16 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 16 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="relative z-10 w-full max-w-4xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <h3 className="text-white font-bold text-base truncate font-display">
                                    {movie.title}
                                </h3>
                                <Badge variant="secondary" className="shrink-0 text-[10px]">Trailer</Badge>
                            </div>
                            <Button
                                ref={closeRef}
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white/60 hover:text-white shrink-0 h-9 w-9"
                                aria-label="Close trailer"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Video */}
                        <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl aspect-video ring-1 ring-white/5">
                            {videoId ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                    title={`${movie.title} Trailer`}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-white/50 text-base">Trailer not available</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-white/50 text-sm">
                            <span>{movie.year}</span>
                            <span className="text-white/15">•</span>
                            <span>{movie.duration}</span>
                            <span className="text-white/15">•</span>
                            <span>{movie.genre?.join(", ")}</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
