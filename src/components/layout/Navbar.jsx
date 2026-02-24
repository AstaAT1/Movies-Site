// Navbar.jsx — Theme-aware premium navbar with adaptive text colors
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, Sun, Moon, Bookmark } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "../ui/Sheet";
import { Separator } from "../ui/Separator";
import { useMovies } from "../../context/movieContext";

const navLinks = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/?type=movie" },
    { label: "TV Shows", path: "/?type=series" },
    { label: "Watchlist", path: "/watchlist" },
];

export default function Navbar() {
    const { isDark, toggleTheme, image } = useMovies();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    // Adaptive text: over dark hero = white, scrolled = theme-appropriate
    const textClass = scrolled ? "text-foreground" : "text-white";
    const mutedTextClass = scrolled ? "text-muted-foreground" : "text-white/70";

    return (
        <>
            <motion.header
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${scrolled
                    ? "glass-strong shadow-md"
                    : "bg-gradient-to-b from-black/50 to-transparent"
                    }`}
            >
                <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <motion.button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 cursor-pointer select-none"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <span
                                className="text-xl font-black tracking-tight font-display"
                            >
                                <span className="text-gradient">LEET</span>
                                <span className={textClass}>MOVIE</span>
                            </span>
                        </motion.button>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                            {navLinks.map((link) => {
                                const isActive =
                                    link.path === "/"
                                        ? location.pathname === "/" && !location.search
                                        : location.pathname + location.search === link.path;
                                return (
                                    <motion.button
                                        key={link.label}
                                        onClick={() => navigate(link.path)}
                                        className={`relative px-4 py-2 text-[13px] font-medium rounded-lg transition-colors cursor-pointer ${isActive ? textClass : `${mutedTextClass} hover:${textClass}`
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-indicator"
                                                className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full"
                                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1.5">
                            {/* Desktop Search */}
                            <AnimatePresence>
                                {searchOpen && (
                                    <motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 240, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        onSubmit={handleSearch}
                                        className="hidden lg:flex overflow-hidden"
                                    >
                                        <Input
                                            placeholder="Search movies..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-9 text-sm"
                                            autoFocus
                                            onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                                            aria-label="Search movies"
                                        />
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    if (searchOpen && searchQuery.trim()) {
                                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                                        setSearchOpen(false);
                                        setSearchQuery("");
                                    } else {
                                        setSearchOpen(!searchOpen);
                                    }
                                }}
                                className={`hidden lg:flex h-9 w-9 ${mutedTextClass} hover:${textClass}`}
                                aria-label="Toggle search"
                            >
                                <Search className="h-[18px] w-[18px]" />
                            </Button>

                            {/* Theme Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className={`h-9 w-9 ${mutedTextClass} hover:${textClass}`}
                                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                <AnimatePresence mode="wait">
                                    {isDark ? (
                                        <motion.div key="sun" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.2 }}>
                                            <Sun className="h-[18px] w-[18px] text-amber-400" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="moon" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.2 }}>
                                            <Moon className="h-[18px] w-[18px] text-blue-500" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>

                            {/* Watchlist */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/watchlist")}
                                className={`hidden lg:flex h-9 w-9 ${mutedTextClass} hover:${textClass}`}
                                aria-label="Watchlist"
                            >
                                <Bookmark className="h-[18px] w-[18px]" />
                            </Button>

                            {/* Profile Avatar */}
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                className="hidden lg:block cursor-pointer ml-1"
                                aria-label="Profile"
                            >
                                <img
                                    src={image.profile}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full ring-2 ring-white/10 hover:ring-primary/50 transition-all object-cover"
                                />
                            </motion.button>

                            {/* Mobile Menu */}
                            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                                <SheetTrigger className="lg:hidden" aria-label="Open menu">
                                    <Menu className={`h-5 w-5 ${textClass}`} />
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <SheetHeader>
                                        <SheetTitle>
                                            <span className="text-gradient font-display">LEET</span>
                                            <span className="font-display">MOVIE</span>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <Separator className="my-4" />

                                    {/* Mobile Search */}
                                    <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="mb-4">
                                        <Input placeholder="Search movies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search" />
                                    </form>

                                    <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
                                        {navLinks.map((link) => (
                                            <button
                                                key={link.label}
                                                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-left cursor-pointer text-sm font-medium"
                                            >
                                                {link.label}
                                            </button>
                                        ))}
                                    </nav>

                                    <Separator className="my-4" />
                                    <div className="flex items-center gap-3 px-4">
                                        <img src={image.profile} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
                                        <div>
                                            <p className="text-foreground font-medium text-sm">User Profile</p>
                                            <p className="text-muted-foreground text-xs">Free Plan</p>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </motion.header>
        </>
    );
}
