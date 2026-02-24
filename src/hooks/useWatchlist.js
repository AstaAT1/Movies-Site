import { useLocalStorage } from "./useLocalStorage";
import { useCallback } from "react";

export function useWatchlist() {
    const [watchlist, setWatchlist] = useLocalStorage("leetmovie-watchlist", []);

    const addToWatchlist = useCallback(
        (movieId) => {
            setWatchlist((prev) => {
                if (prev.includes(movieId)) return prev;
                return [...prev, movieId];
            });
        },
        [setWatchlist]
    );

    const removeFromWatchlist = useCallback(
        (movieId) => {
            setWatchlist((prev) => prev.filter((id) => id !== movieId));
        },
        [setWatchlist]
    );

    const toggleWatchlist = useCallback(
        (movieId) => {
            setWatchlist((prev) => {
                if (prev.includes(movieId)) {
                    return prev.filter((id) => id !== movieId);
                }
                return [...prev, movieId];
            });
        },
        [setWatchlist]
    );

    const isInWatchlist = useCallback(
        (movieId) => watchlist.includes(movieId),
        [watchlist]
    );

    return { watchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist, isInWatchlist };
}
