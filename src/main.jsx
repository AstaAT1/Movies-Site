// main.jsx — App entry with Lenis smooth scrolling
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MovieProvider from "./context/movieContext";
import App from "./App";
import "./index.css";

// Lenis smooth scrolling setup
async function initLenis() {
  try {
    const { default: Lenis } = await import("lenis");
    const { default: gsap } = await import("gsap");

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    // Sync Lenis with GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } catch (e) {
    // Lenis is optional; won't break the app if unavailable
    console.info("Lenis smooth scroll not loaded:", e.message);
  }
}

initLenis();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MovieProvider>
        <App />
      </MovieProvider>
    </BrowserRouter>
  </React.StrictMode>
);
