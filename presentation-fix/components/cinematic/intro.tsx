"use client";

import { useMemo } from "react";

export function CinematicIntro({ progress }: { progress: number }) {
  // Calculate phase directly from progress - no state needed
  const phase = useMemo(() => {
    if (progress < 0.15) return 0;
    if (progress < 0.4) return 1;
    if (progress < 0.65) return 2;
    if (progress < 0.88) return 3;
    return 4;
  }, [progress]);

  // Camera drift
  const driftX = Math.sin(progress * Math.PI * 2) * 10;
  const driftY = Math.cos(progress * Math.PI) * 5;

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Deep space background with slow drift */}
      <div
        className="absolute inset-[-50px] transition-transform duration-[2000ms] ease-out"
        style={{
          transform: `translate(${driftX}px, ${driftY}px) scale(${
            1 + progress * 0.1
          })`,
          background:
            "radial-gradient(ellipse at 50% 30%, #12121f 0%, #0a0a12 40%, #050508 100%)",
        }}
      />

      {/* Atmospheric particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${10 + ((i * 1.5) % 80)}%`,
              bottom: `${-5 + ((progress * 150 + i * 12) % 110)}%`,
              background:
                i % 3 === 0
                  ? "rgba(139, 0, 0, 0.4)"
                  : "rgba(255, 255, 255, 0.15)",
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Phase 0: Black with fade in - studio card */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-1000"
        style={{
          opacity: phase === 0 ? 1 : 0,
          transform: `scale(${phase === 0 ? 1 : 1.1})`,
        }}
      >
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto mb-6" />
            <div className="text-foreground/20 text-[10px] tracking-[1em] uppercase mb-2">
              Developed & Presented By
            </div>
            <div
              className="text-foreground/50 text-2xl tracking-[0.4em] uppercase"
              style={{ fontVariant: "small-caps" }}
            >
              Lorenzo "Studios"
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto mt-6" />
          </div>
        </div>
      </div>

      {/* Phase 1: Main title - dramatic reveal */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-[1500ms] ease-out"
        style={{
          opacity: phase === 1 || phase === 2 ? 1 : 0,
          transform: `translateY(${phase >= 1 && phase <= 2 ? 0 : 40}px)`,
        }}
      >
        <div className="text-center relative">
          {/* Decorative lines */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent to-primary/50"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transition: "opacity 1s ease-out 0.5s",
            }}
          />

          <div
            className="text-foreground/30 text-xs tracking-[0.8em] uppercase mb-8"
            style={{
              animation: phase >= 1 ? "fadeIn 1s ease-out 0.3s both" : "none",
            }}
          >
            Semester One
          </div>

          <h1
            className="text-[6rem] md:text-[10rem] font-bold leading-none tracking-wider"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 100px rgba(139, 0, 0, 0.3)",
              animation: phase >= 1 ? "fadeIn 1.5s ease-out both" : "none",
            }}
          >
            ALGEBRA
          </h1>

          <div className="relative mt-4">
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto" />
            <div
              className="text-primary text-3xl md:text-5xl tracking-[0.3em] mt-4 font-bold"
              style={{
                animation:
                  phase >= 1 ? "fadeIn 1.5s ease-out 0.5s both" : "none",
              }}
            >
              THE SAGA
            </div>
          </div>

          {/* Decorative line bottom */}
          <div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transition: "opacity 1s ease-out 0.8s",
            }}
          />
        </div>
      </div>

      {/* Phase 3: Chapter card */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-1000"
        style={{
          opacity: phase === 3 ? 1 : 0,
          transform: `scale(${phase === 3 ? 1 : 0.95})`,
        }}
      >
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-accent/50" />
            <div className="text-accent text-sm tracking-[0.6em] uppercase">
              Chapter I
            </div>
            <div className="w-12 h-px bg-accent/50" />
          </div>
          <h2
            className="text-4xl md:text-6xl font-bold text-foreground tracking-wide"
            style={{ textShadow: "0 0 60px rgba(251, 191, 36, 0.2)" }}
          >
            THE BEGINNING
          </h2>
          <p className="text-foreground/40 text-sm tracking-wider max-w-md mx-auto">
            Where legends are forged and equations are conquered
          </p>
        </div>
      </div>

      {/* Phase 4: Fade out */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none"
        style={{ opacity: phase === 4 ? 1 : 0 }}
      />

      {/* Subtle red glow at edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-1/2 h-1/2 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(139, 0, 0, 0.3) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at bottom right, rgba(139, 0, 0, 0.3) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Heavy vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_transparent_30%,_black_90%)] pointer-events-none" />
    </div>
  );
}
