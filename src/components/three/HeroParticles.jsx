// HeroParticles.jsx — Subtle R3F particle background for hero section
import { Canvas } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import { Suspense } from "react";

function ParticleScene() {
    return (
        <>
            <ambientLight intensity={0.15} />
            <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.4}>
                <Sparkles
                    count={80}
                    scale={14}
                    size={1.8}
                    speed={0.3}
                    opacity={0.35}
                    color="#e50914"
                />
            </Float>
            <Float speed={0.25} rotationIntensity={0.04} floatIntensity={0.25}>
                <Sparkles
                    count={50}
                    scale={16}
                    size={1.2}
                    speed={0.15}
                    opacity={0.2}
                    color="#ffffff"
                />
            </Float>
        </>
    );
}

export default function HeroParticles() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 55 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
                dpr={[1, 1.5]}
            >
                <Suspense fallback={null}>
                    <ParticleScene />
                </Suspense>
            </Canvas>
        </div>
    );
}
