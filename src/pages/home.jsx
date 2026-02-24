// home.jsx — Premium home with Container + space-y-10 between rows
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { Play, Plus, Check, TrendingUp, Star, Clapperboard, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import Container from "../components/layout/Container";
import Navbar from "../components/layout/Navbar";
import PageTransition from "../components/layout/PageTransition";
import MovieCarousel from "../components/movie/MovieCarousel";
import TrailerModal from "../components/movie/TrailerModal";
import { useMovies } from "../context/movieContext";
import { useWatchlist } from "../hooks/useWatchlist";

const HeroParticles = lazy(() => import("../components/three/HeroParticles"));

export default function Home() {
  const navigate = useNavigate();
  const { movies, image, trending, topRated, newReleases, moviesByGenre } = useMovies();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [trailerMovie, setTrailerMovie] = useState(null);
  const heroMovie = trending[0];

  const heroTitleRef = useRef(null);
  const heroDescRef = useRef(null);
  const heroButtonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(heroTitleRef.current, { y: 30, opacity: 0, duration: 0.7, delay: 0.2 })
        .from(heroDescRef.current, { y: 18, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(heroButtonsRef.current, { y: 12, opacity: 0, duration: 0.4 }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 600], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  const inWatchlist = heroMovie ? isInWatchlist(heroMovie.id) : false;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* ===== HERO ===== */}
        {heroMovie && (
          <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
            <motion.div className="absolute inset-0" style={{ y: heroImageY }}>
              <img src={image[heroMovie.imageKey]} alt={heroMovie.title} className="w-full h-[115%] object-cover" />
            </motion.div>

            <Suspense fallback={null}>
              <HeroParticles />
            </Suspense>

            <div className="absolute inset-0 gradient-cinematic" />
            <div className="absolute inset-0 gradient-hero-left" />

            {/* Hero Content — inside Container for alignment */}
            <motion.div
              style={{ opacity: heroOpacity }}
              className="absolute bottom-0 left-0 right-0 pb-14 lg:pb-20"
            >
              <Container>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="mb-3"
                >
                  <Badge className="px-2.5 py-1 text-[10px] bg-primary/20 border border-primary/30 text-red-200 backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </motion.div>

                <h1
                  ref={heroTitleRef}
                  className="text-white font-display font-black mb-4 max-w-xl leading-[1.08] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)" }}
                >
                  {heroMovie.title}
                </h1>

                <div ref={heroDescRef}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="gold" className="flex items-center gap-1 text-[10px]">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      {heroMovie.rating}
                    </Badge>
                    <Badge variant="outline" className="border-white/15 text-white/60 bg-transparent text-[10px]">{heroMovie.year}</Badge>
                    <Badge variant="outline" className="border-white/15 text-white/60 bg-transparent text-[10px]">{heroMovie.duration}</Badge>
                    {heroMovie.ageRating && <Badge variant="outline" className="border-white/15 text-white/60 bg-transparent text-[10px]">{heroMovie.ageRating}</Badge>}
                  </div>
                  <p className="text-white/55 text-sm max-w-lg mb-6 line-clamp-2 leading-relaxed">
                    {heroMovie.description}
                  </p>
                </div>

                <div ref={heroButtonsRef} className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setTrailerMovie(heroMovie)}
                    className="gap-2 bg-white text-black hover:bg-white/90 font-semibold shadow-lg h-10 px-5 text-sm"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Play Trailer
                  </Button>
                  <Button
                    onClick={() => toggleWatchlist(heroMovie.id)}
                    className="gap-2 bg-white/10 text-white border border-white/15 hover:bg-white/15 backdrop-blur-sm h-10 px-5 text-sm"
                  >
                    {inWatchlist ? <><Check className="h-4 w-4" /> In List</> : <><Plus className="h-4 w-4" /> My List</>}
                  </Button>
                  <Button
                    onClick={() => navigate(`/movie/${heroMovie.id}`)}
                    className="gap-2 bg-transparent text-white border border-white/15 hover:bg-white/10 h-10 px-5 text-sm"
                  >
                    <Clapperboard className="h-4 w-4" /> Details
                  </Button>
                </div>
              </Container>
            </motion.div>
          </section>
        )}

        {/* ===== CONTENT ROWS — space-y-10 gives premium breathing room ===== */}
        <main className="relative z-10 pt-10 lg:pt-14 pb-16">
          <Container>
            <div className="space-y-10 lg:space-y-14">
              <MovieCarousel
                title={<span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Trending Now</span>}
                movies={trending}
                onPlayTrailer={setTrailerMovie}
              />
              <MovieCarousel
                title={<span className="flex items-center gap-2"><Star className="h-4 w-4 text-gold" /> Top Rated</span>}
                movies={topRated}
                onPlayTrailer={setTrailerMovie}
              />
              <MovieCarousel title="New Releases" movies={newReleases} onPlayTrailer={setTrailerMovie} />
              {Object.entries(moviesByGenre)
                .filter(([_, ms]) => ms.length >= 2)
                .slice(0, 3)
                .map(([genre, genreMovies]) => (
                  <MovieCarousel key={genre} title={genre} movies={genreMovies} onPlayTrailer={setTrailerMovie} />
                ))}
            </div>
          </Container>
        </main>

        {/* Footer */}
        <footer className="py-10">
          <Container>
            <div className="separator-gradient w-full mb-8" />
            <div className="text-center">
              <p className="text-lg font-black mb-1.5 font-display">
                <span className="text-gradient">LEET</span><span className="text-foreground">MOVIE</span>
              </p>
              <p className="text-muted-foreground text-xs mb-2">Your premium destination for movies & series.</p>
              <p className="text-muted-foreground/40 text-[10px]">© {new Date().getFullYear()} LEETMOVIE</p>
            </div>
          </Container>
        </footer>

        <TrailerModal movie={trailerMovie} isOpen={!!trailerMovie} onClose={() => setTrailerMovie(null)} />
      </div>
    </PageTransition>
  );
}