// MovieDetails.jsx — 12-col grid inside Container, breathable spacing
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ArrowLeft, Play, Plus, Check, Star, Clock, Calendar, Globe, Film, Award, DollarSign, Users } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Separator } from "../components/ui/Separator";
import Container from "../components/layout/Container";
import Navbar from "../components/layout/Navbar";
import PageTransition from "../components/layout/PageTransition";
import MovieCarousel from "../components/movie/MovieCarousel";
import TrailerModal from "../components/movie/TrailerModal";
import RatingStars from "../components/ratings/RatingStars";
import CommentsSection from "../components/comments/CommentsSection";
import { useMovies } from "../context/movieContext";
import { useWatchlist } from "../hooks/useWatchlist";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMovieById, getSimilarMovies, image } = useMovies();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [showTrailer, setShowTrailer] = useState(false);

  const movie = getMovieById(id);
  const similarMovies = movie ? getSimilarMovies(movie.id) : [];
  const inWatchlist = movie ? isInWatchlist(movie.id) : false;

  const titleRef = useRef(null);
  const metaRef = useRef(null);

  useEffect(() => {
    if (!movie) return;
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 24, opacity: 0, duration: 0.6, delay: 0.15, ease: "power3.out" });
      gsap.from(metaRef.current, { y: 14, opacity: 0, duration: 0.45, delay: 0.3, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, [id, movie]);

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 400], [0, 50]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-primary text-5xl font-black mb-3 font-display">404</motion.p>
          <p className="text-muted-foreground text-sm mb-5">Movie not found</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const infoItems = [
    movie.director && { icon: Film, label: "Director", value: movie.director },
    movie.creator && { icon: Film, label: "Creator", value: movie.creator },
    { icon: Clock, label: "Duration", value: movie.duration },
    { icon: Calendar, label: "Release", value: movie.releaseDate },
    { icon: Globe, label: "Language", value: movie.language },
    { icon: Globe, label: "Country", value: movie.country },
    movie.budget && { icon: DollarSign, label: "Budget", value: movie.budget },
    movie.boxOffice && { icon: DollarSign, label: "Box Office", value: movie.boxOffice },
  ].filter(Boolean);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* ===== HERO BACKDROP ===== */}
        <section className="relative h-[45vh] lg:h-[55vh] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <img src={image[movie.imageKey]} alt={movie.title} className="w-full h-[115%] object-cover" />
          </motion.div>
          <div className="absolute inset-0 gradient-cinematic" />
          <div className="absolute inset-0 gradient-hero-left" />

          {/* Back — inside Container for alignment */}
          <div className="absolute top-20 left-0 right-0 z-10">
            <Container>
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Button onClick={() => navigate(-1)} variant="ghost"
                  className="gap-1.5 text-white/70 hover:text-white hover:bg-white/10 text-sm h-9 px-3">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </motion.div>
            </Container>
          </div>

          {/* Hero Title & Meta */}
          <div className="absolute bottom-0 left-0 right-0 pb-8 lg:pb-12">
            <Container>
              <h1 ref={titleRef}
                className="text-white font-display font-black mb-3 max-w-xl leading-[1.1] tracking-[-0.02em] line-clamp-2"
                style={{ fontSize: "clamp(1.25rem, 3vw, 2.25rem)" }}>
                {movie.title}
              </h1>

              <div ref={metaRef}>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-primary/90 border-none text-[10px] text-white px-2 py-0.5">{movie.type === "movie" ? "Movie" : "Series"}</Badge>
                  <Badge variant="gold" className="flex items-center gap-0.5 text-[10px] px-2 py-0.5">
                    <Star className="h-2.5 w-2.5 fill-gold text-gold" />{movie.rating}
                  </Badge>
                  <Badge variant="outline" className="border-white/15 text-white/60 bg-transparent text-[10px]">{movie.year}</Badge>
                  <Badge variant="outline" className="border-white/15 text-white/60 bg-transparent text-[10px]">{movie.duration}</Badge>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => setShowTrailer(true)}
                    className="gap-1.5 bg-white text-black hover:bg-white/90 font-semibold shadow-lg h-9 px-4 text-sm">
                    <Play className="h-4 w-4 fill-current" /> Trailer
                  </Button>
                  <Button onClick={() => toggleWatchlist(movie.id)}
                    className="gap-1.5 bg-white/10 text-white border border-white/15 hover:bg-white/15 h-9 px-4 text-sm">
                    {inWatchlist ? <><Check className="h-4 w-4" /> Listed</> : <><Plus className="h-4 w-4" /> My List</>}
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ===== CONTENT — pt-10 pb-16 gives page-level breathing room ===== */}
        <main className="pt-10 pb-16">
          <Container>
            {/* 12-col grid with gap-10 lg:gap-12 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

              {/* LEFT col — 8/12 — space-y-8 between sections */}
              <div className="lg:col-span-8 space-y-8">

                {/* Story */}
                <motion.section initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                  <h2 className="text-sm font-bold mb-3 font-display text-foreground uppercase tracking-wide">Story</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm max-w-[70ch]">{movie.plot}</p>
                </motion.section>

                <Separator />

                {/* Genres */}
                <motion.section initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                  <h2 className="text-sm font-bold mb-3 font-display text-foreground uppercase tracking-wide">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g) => (
                      <Badge key={g} variant="outline" className="px-3 py-1 text-[11px] cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => navigate(`/search?genre=${g}`)}>
                        {g}
                      </Badge>
                    ))}
                  </div>
                </motion.section>

                <Separator />

                {/* Cast */}
                <motion.section initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                  <h2 className="text-sm font-bold mb-3 font-display text-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" /> Cast
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor) => (
                      <Badge key={actor} variant="secondary" className="px-3 py-1.5 text-[11px]">{actor}</Badge>
                    ))}
                  </div>
                </motion.section>

                <Separator />

                {/* Rating */}
                <motion.section initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                  <h2 className="text-sm font-bold mb-4 font-display text-foreground uppercase tracking-wide">Rating</h2>
                  <RatingStars movieId={movie.id} averageRating={movie.rating} />
                </motion.section>

                <Separator />

                {/* Comments */}
                <motion.section initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                  <CommentsSection movieId={movie.id} />
                </motion.section>
              </div>

              {/* RIGHT col — 4/12 — sticky info card */}
              <aside className="lg:col-span-4">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.35 }}
                  className="rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24 h-fit space-y-3">
                  <h3 className="text-xs font-bold font-display text-foreground uppercase tracking-wider mb-2">Details</h3>

                  {infoItems.map(({ icon: Icon, label, value }, i) => (
                    <div key={`${label}-${i}`}>
                      {i > 0 && <Separator className="my-2.5" />}
                      <div className="flex items-start gap-3">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-muted-foreground text-[10px] uppercase tracking-wider leading-none mb-1">{label}</p>
                          <p className="text-foreground text-sm leading-snug">{value}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {movie.awards && movie.awards.length > 0 && (
                    <>
                      <Separator className="my-2.5" />
                      <div className="flex items-start gap-3">
                        <Award className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-muted-foreground text-[10px] uppercase tracking-wider leading-none mb-1.5">Awards</p>
                          <div className="flex flex-wrap gap-1.5">
                            {movie.awards.map((a) => <Badge key={a} variant="success" className="text-[9px] px-1.5 py-0.5">{a}</Badge>)}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {movie.seasons && (
                    <>
                      <Separator className="my-2.5" />
                      <div className="space-y-2.5">
                        <div><p className="text-muted-foreground text-[10px] uppercase tracking-wider">Seasons</p><p className="text-foreground text-sm">{movie.seasons}</p></div>
                        <div><p className="text-muted-foreground text-[10px] uppercase tracking-wider">Episodes</p><p className="text-foreground text-sm">{movie.episodes}</p></div>
                        {movie.status && <div><p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-0.5">Status</p><Badge variant="success" className="text-[10px]">{movie.status}</Badge></div>}
                      </div>
                    </>
                  )}
                </motion.div>
              </aside>
            </div>

            {/* Similar Titles */}
            {similarMovies.length > 0 && (
              <div className="mt-16">
                <MovieCarousel title="Similar Titles" movies={similarMovies} onPlayTrailer={() => setShowTrailer(true)} />
              </div>
            )}
          </Container>
        </main>

        <TrailerModal movie={movie} isOpen={showTrailer} onClose={() => setShowTrailer(false)} />
      </div>
    </PageTransition>
  );
}