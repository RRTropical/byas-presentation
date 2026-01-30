"use client";

import { useMemo } from "react";

export function BossApproach({ progress }: { progress: number }) {
  // Calculate everything from progress - no state
  const shakePoints = [0.2, 0.35, 0.5, 0.65, 0.8, 0.95];
  const isShaking = shakePoints.some((p) => Math.abs(progress - p) < 0.04);
  const shakeIntensity = isShaking ? 6 + progress * 8 : 0;

  // Stable random offset based on progress range
  const shakeOffset = useMemo(
    () => ({
      x: Math.sin(progress * 100) * 0.5,
      y: Math.cos(progress * 100) * 0.5,
    }),
    [Math.floor(progress * 25)]
  ); // Update ~25 times per second when shaking

  const phase = useMemo(() => {
    if (progress < 0.2) return 0;
    if (progress < 0.45) return 1;
    if (progress < 0.7) return 2;
    return 3;
  }, [progress]);

  return (
    <div
      className="relative h-full w-full bg-black overflow-hidden"
      style={{
        transform:
          shakeIntensity > 0
            ? `translate(${shakeOffset.x * shakeIntensity}px, ${
                shakeOffset.y * shakeIntensity
              }px)`
            : "none",
        transition: shakeIntensity > 0 ? "none" : "transform 0.1s ease-out",
      }}
    >
      {/* Deep red atmospheric background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, rgba(127, 29, 29, ${
            0.2 + progress * 0.3
          }) 0%, rgba(10, 5, 8, 1) 60%, black 100%)`,
        }}
      />

      {/* Fog layers moving */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[300%] h-24 opacity-20"
            style={{
              top: `${20 + i * 15}%`,
              left: `${-200 + progress * 100 + i * 30}%`,
              background: `linear-gradient(90deg, transparent, rgba(139, 0, 0, 0.3), transparent)`,
              transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`,
              filter: "blur(20px)",
            }}
          />
        ))}
      </div>

      {/* Ground rumble particles */}
      {shakeIntensity > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-32 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-foreground/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: 0,
                animation: `floatUp ${
                  0.5 + Math.random() * 0.5
                }s ease-out forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Phase 0-1: Warning text */}
      <div
        className="absolute top-[10%] left-0 right-0 transition-all duration-500"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: `translateY(${phase >= 1 ? 0 : -20}px)`,
        }}
      >
        <div className="flex flex-col items-center">
          {/* Warning bars */}
          <div className="w-full h-12 relative overflow-hidden">
            <div
              className="absolute inset-0 flex"
              style={{ animation: "marquee 2s linear infinite" }}
            >
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-8 bg-red-900/40 h-full shrink-0"
                >
                  <span className="text-red-500 text-xl">!</span>
                  <span className="text-red-400 text-sm tracking-[0.4em] font-bold whitespace-nowrap">
                    WARNING - BOSS APPROACHING
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="text-red-400/60 text-xs tracking-[0.5em] mt-4 uppercase"
            style={{ animation: "pulse 1s ease-in-out infinite" }}
          >
            Prepare for Battle
          </div>
        </div>
      </div>

      {/* Boss silhouette rising from below */}
      <div
        className="absolute left-1/2 transition-all duration-[2000ms] ease-out"
        style={{
          bottom: `${-40 + progress * 60}%`,
          transform: `translateX(-50%) scale(${0.6 + progress * 0.6})`,
        }}
      >
        {/* Massive red aura */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            width: 500,
            height: 600,
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse at center, rgba(127, 29, 29, 0.5) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />

        {/* Boss form */}
        <div className="relative">
          {/* Main body */}
          <div
            className="w-48 h-72 bg-black relative"
            style={{
              clipPath:
                "polygon(50% 0%, 90% 15%, 100% 50%, 90% 100%, 10% 100%, 0% 50%, 10% 15%)",
              boxShadow: "0 0 100px rgba(127, 29, 29, 0.5)",
            }}
          >
            {/* Inner glow lines */}
            <div
              className="absolute inset-4 border border-red-900/30"
              style={{
                clipPath:
                  "polygon(50% 0%, 90% 15%, 100% 50%, 90% 100%, 10% 100%, 0% 50%, 10% 15%)",
              }}
            />

            {/* Eyes - glow intensifies with progress */}
            <div
              className="absolute top-[15%] left-1/2 -translate-x-1/2 flex gap-8 transition-opacity duration-500"
              style={{ opacity: phase >= 2 ? 1 : 0 }}
            >
              <div
                className="w-4 h-2 bg-red-500 rounded-full"
                style={{
                  boxShadow: `0 0 ${
                    20 + progress * 30
                  }px rgba(239, 68, 68, 0.8), 0 0 ${
                    40 + progress * 40
                  }px rgba(239, 68, 68, 0.4)`,
                }}
              />
              <div
                className="w-4 h-2 bg-red-500 rounded-full"
                style={{
                  boxShadow: `0 0 ${
                    20 + progress * 30
                  }px rgba(239, 68, 68, 0.8), 0 0 ${
                    40 + progress * 40
                  }px rgba(239, 68, 68, 0.4)`,
                }}
              />
            </div>

            {/* Symbol on chest */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-900/50 text-6xl font-black"
              style={{
                opacity: phase >= 2 ? 0.5 : 0,
                transition: "opacity 1s",
              }}
            >
              X
            </div>
          </div>

          {/* Boss name plate */}
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap transition-all duration-700"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: `translateX(-50%) translateY(${
                phase >= 2 ? 0 : 20
              }px)`,
            }}
          >
            <div className="text-red-500/60 text-[10px] tracking-[0.5em] uppercase">
              Boss
            </div>
            <div className="text-red-400 text-xs tracking-[0.3em]">
              THE FINAL EXAM
            </div>
          </div>
        </div>
      </div>

      {/* Full boss name reveal */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-1000"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: `scale(${phase >= 3 ? 1 : 0.9})`,
        }}
      >
        <div className="text-center">
          <div className="text-red-500/50 text-xs tracking-[0.8em] uppercase mb-4">
            Face Your Destiny
          </div>
          <h1
            className="text-5xl md:text-8xl font-black text-foreground tracking-wide"
            style={{
              textShadow:
                "0 0 80px rgba(239, 68, 68, 0.5), 0 4px 0 rgba(139, 0, 0, 0.8)",
            }}
          >
            THE FINAL EXAM
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-500/50" />
            <span className="text-red-400 text-xl tracking-[0.4em]">
              MR BYAS
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-red-500/50" />
          </div>

          {/* Health bar preview */}
          <div className="mt-10 w-80 md:w-96 mx-auto">
            <div className="h-5 bg-black/50 rounded overflow-hidden border border-red-900/40">
              <div
                className="h-full relative overflow-hidden"
                style={{
                  width: "100%",
                  background:
                    "linear-gradient(90deg, #7f1d1d 0%, #dc2626 50%, #ef4444 100%)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle prompt */}
      <div
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 transition-all duration-500"
        style={{ opacity: phase >= 3 ? 1 : 0 }}
      >
        <div
          className="flex items-center gap-3 text-foreground/40"
          style={{ animation: "pulse 1.5s ease-in-out infinite" }}
        >
          <div className="w-10 h-10 rounded border border-foreground/30 bg-black/30 flex items-center justify-center font-bold">
            A
          </div>
          <span className="tracking-[0.3em] text-sm">BEGIN BATTLE</span>
        </div>
      </div>

      {/* Heavy red vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(80,0,0,0.3)_60%,_black_100%)] pointer-events-none" />
    </div>
  );
}
