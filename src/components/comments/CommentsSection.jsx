// CommentsSection.jsx — Theme-aware comments
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageCircle, Send, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Badge } from "../ui/Badge";
import { Separator } from "../ui/Separator";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function CommentsSection({ movieId }) {
    const [allComments, setAllComments] = useLocalStorage("leetmovie-comments", {});
    const [newComment, setNewComment] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const comments = allComments[movieId] || [];

    const addComment = () => {
        if (!newComment.trim()) return;
        const comment = { id: Date.now(), text: newComment.trim(), author: "You", timestamp: new Date().toISOString(), likes: 0, dislikes: 0, userVote: null };
        setAllComments((prev) => ({ ...prev, [movieId]: [comment, ...(prev[movieId] || [])] }));
        setNewComment("");
    };

    const handleVote = (commentId, type) => {
        setAllComments((prev) => ({
            ...prev,
            [movieId]: (prev[movieId] || []).map((c) => {
                if (c.id !== commentId) return c;
                const wasVoted = c.userVote === type;
                return {
                    ...c,
                    likes: type === "like" ? (wasVoted ? c.likes - 1 : c.likes + 1) : c.userVote === "like" ? c.likes - 1 : c.likes,
                    dislikes: type === "dislike" ? (wasVoted ? c.dislikes - 1 : c.dislikes + 1) : c.userVote === "dislike" ? c.dislikes - 1 : c.dislikes,
                    userVote: wasVoted ? null : type,
                };
            }),
        }));
    };

    const sorted = [...comments].sort((a, b) => sortBy === "top" ? (b.likes - b.dislikes) - (a.likes - a.dislikes) : new Date(b.timestamp) - new Date(a.timestamp));

    const formatTime = (iso) => {
        const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return new Date(iso).toLocaleDateString();
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-display">
                    <MessageCircle className="h-5 w-5" /> Comments
                    {comments.length > 0 && <Badge variant="secondary" className="ml-1 text-[10px]">{comments.length}</Badge>}
                </h3>
                {comments.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => setSortBy(sortBy === "newest" ? "top" : "newest")} className="text-muted-foreground text-xs">
                        <ArrowUpDown className="h-3.5 w-3.5 mr-1" /> {sortBy === "newest" ? "Newest" : "Top"}
                    </Button>
                )}
            </div>

            <div className="mb-6">
                <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-sm font-bold">Y</span>
                    </div>
                    <div className="flex-1">
                        <Textarea placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="mb-2 min-h-[72px]"
                            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addComment(); }} />
                        <div className="flex justify-between items-center">
                            <p className="text-muted-foreground text-[11px]">Ctrl+Enter to submit</p>
                            <Button onClick={addComment} disabled={!newComment.trim()} size="sm" className="gap-1.5"><Send className="h-3.5 w-3.5" /> Post</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="mb-6" />

            {comments.length === 0 ? (
                <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">No comments yet. Be the first!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {sorted.map((c) => (
                            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    <span className="text-muted-foreground text-sm font-bold">{c.author[0]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-foreground text-sm font-medium">{c.author}</span>
                                        <span className="text-muted-foreground text-[11px]">{formatTime(c.timestamp)}</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">{c.text}</p>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleVote(c.id, "like")} className={`flex items-center gap-1 text-xs transition-colors cursor-pointer ${c.userVote === "like" ? "text-blue-500 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"}`}>
                                            <ThumbsUp className="h-3.5 w-3.5" /> {c.likes > 0 && c.likes}
                                        </button>
                                        <button onClick={() => handleVote(c.id, "dislike")} className={`flex items-center gap-1 text-xs transition-colors cursor-pointer ${c.userVote === "dislike" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                                            <ThumbsDown className="h-3.5 w-3.5" /> {c.dislikes > 0 && c.dislikes}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
}
