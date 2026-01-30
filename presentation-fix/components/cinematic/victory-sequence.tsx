"use client";

import { useMemo } from "react";

export function VictorySequence({ progress }: { progress: number }) {
  // Calculate phase directly from progress
  const phase = useMemo(() => {
    if (progress < 0.12) return 0;
    if (progress < 0.35) return 1;
    if (progress < 0.65) return 2;
    return 3;
  }, [progress]);

  // XP counter animation - derive from progress
  const xpCount = useMemo(() => {
    if (progress < 0.12) return 0;
    const targetXP = 15847;
    const xpProgress = Math.min((progress - 0.12) / 0.6, 1);
    const easedProgress = 1 - Math.pow(1 - xpProgress, 3);
    return Math.floor(easedProgress * targetXP);
  }, [progress]);

  const rankRevealed = progress > 0.45;

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Golden rays emanating from center */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute origin-center"
            style={{
              width: "200%",
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.15) 50%, transparent 100%)",
              transform: `rotate(${i * 22.5}deg)`,
              opacity: phase >= 1 ? 0.6 : 0,
              transition: "opacity 1s ease-out",
              transitionDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>

      {/* Particle celebration */}
      {phase >= 2 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(80)].map((_, i) => {
            const colors = [
              "#fbbf24",
              "#ef4444",
              "#3b82f6",
              "#22c55e",
              "#ec4899",
              "#8b5cf6",
            ];
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  width: 4 + Math.random() * 8,
                  height: 4 + Math.random() * 8,
                  left: `${Math.random() * 100}%`,
                  top: -20,
                  background: colors[i % colors.length],
                  borderRadius: Math.random() > 0.5 ? "50%" : "0",
                  animation: `confettiFall ${
                    2.5 + Math.random() * 2
                  }s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Phase 0: Slow-mo boss defeat */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-1000"
        style={{ opacity: phase === 0 ? 1 : 0 }}
      >
        <div className="text-center">
          <div
            className="text-7xl md:text-9xl font-black text-foreground/10"
            style={{
              animation: phase === 0 ? "pulse 1s ease-in-out" : "none",
              textShadow: "0 0 100px rgba(239, 68, 68, 0.3)",
            }}
          >
            DEFEATED
          </div>
        </div>
      </div>

      {/* Phase 1-2: Victory splash */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700"
        style={{
          opacity: phase >= 1 && phase <= 2 ? 1 : 0,
          transform: `scale(${phase >= 1 ? 1 : 0.8})`,
        }}
      >
        <div className="text-center">
          {/* Enemy vanquished label */}
          <div
            className="text-accent/60 text-sm tracking-[0.6em] uppercase mb-6"
            style={{
              animation: phase >= 1 ? "fadeIn 0.5s ease-out both" : "none",
            }}
          >
            Enemy Vanquished - Test Graded
          </div>

          {/* VICTORY text with glow */}
          <h1
            className="text-7xl md:text-[9rem] font-black text-foreground leading-none"
            style={{
              textShadow:
                "0 0 80px rgba(251, 191, 36, 0.5), 0 0 120px rgba(251, 191, 36, 0.3)",
              animation: phase >= 1 ? "fadeIn 1s ease-out both" : "none",
            }}
          >
            VICTORY
          </h1>

          {/* Stats row */}
          <div
            className="mt-10 flex items-center justify-center gap-10"
            style={{
              animation: phase >= 1 ? "fadeIn 1s ease-out 0.3s both" : "none",
            }}
          >
            <div className="text-center">
              <div className="text-foreground/30 text-xs tracking-wider mb-1">
                TIME
              </div>
              <div className="text-foreground/80 text-2xl font-mono">
                04:32.47
              </div>
            </div>

            <div className="w-px h-12 bg-foreground/20" />

            <div className="text-center relative">
              <div className="text-foreground/30 text-xs tracking-wider mb-1">
                RANK
              </div>
              <div
                className="text-5xl font-black transition-all duration-500"
                style={{
                  color: rankRevealed ? "#fbbf24" : "transparent",
                  textShadow: rankRevealed
                    ? "0 0 40px rgba(251, 191, 36, 0.8)"
                    : "none",
                  transform: rankRevealed ? "scale(1)" : "scale(2)",
                }}
              >
                S
              </div>
              {!rankRevealed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground/80 rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="w-px h-12 bg-foreground/20" />

            <div className="text-center">
              <div className="text-foreground/30 text-xs tracking-wider mb-1">
                MAX COMBO
              </div>
              <div className="text-foreground/80 text-2xl">YES</div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2-3: XP and rewards */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: `translateY(${phase >= 2 ? 0 : 30}px)`,
        }}
      >
        <div className="text-center mt-56">
          {/* XP Counter */}
          <div className="mb-10">
            <div className="text-foreground/30 text-xs tracking-[0.4em] mb-2">
              EXPERIENCE GAINED
            </div>
            <div
              className="text-5xl md:text-6xl font-black text-accent"
              style={{
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 0 40px rgba(251, 191, 36, 0.5)",
              }}
            >
              +{xpCount.toLocaleString()} XP
            </div>
          </div>

          {/* Reward cards */}
          <div className="flex items-center justify-center gap-4">
            {[
              {
                icon: "A+",
                label: "GRADE",
                color: "text-green-400",
                bg: "bg-green-500/10",
                border: "border-green-500/30",
              },
              {
                icon: "★",
                label: "NEW SKILL",
                color: "text-accent",
                bg: "bg-accent/10",
                border: "border-accent/30",
              },
              {
                icon: "◆",
                label: "BONUS",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/30",
              },
            ].map((reward, i) => (
              <div
                key={reward.label}
                className={`w-24 h-28 rounded-lg border ${reward.border} ${reward.bg} flex flex-col items-center justify-center transition-all duration-500`}
                style={{
                  opacity: phase >= 2 ? 1 : 0,
                  transform: `translateY(${phase >= 2 ? 40 : 60}px)`,
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                <span className={`text-4xl ${reward.color}`}>
                  {reward.icon}
                </span>
                <span className="text-foreground/40 text-[9px] mt-2 tracking-wider">
                  {reward.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continue prompt */}
      {phase >= 3 && (
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          <div
            className="flex items-center gap-3 text-foreground/40"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          >
            <div className="w-10 h-10 rounded border border-foreground/20 bg-foreground/5 flex items-center justify-center text-sm">
              A
            </div>
            <span className="tracking-[0.3em] text-sm">CONTINUE</span>
          </div>
        </div>
      )}

      {/* Golden vignette */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(251, 191, 36, 0.05) 50%, rgba(0, 0, 0, 0.8) 100%)",
          opacity: phase >= 1 ? 1 : 0,
        }}
      />
    </div>
  );
}
