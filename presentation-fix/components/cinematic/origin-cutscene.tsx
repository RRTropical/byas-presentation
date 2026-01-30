"use client";

import { useEffect, useState, useRef, useMemo } from "react";

export function OriginCutscene({ progress }: { progress: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const lastTextIndexRef = useRef(-1);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize narration so it doesn't change on every render
  const narration = useMemo(
    () => [
      "kaboom",
      "In the halls of knowledge, a warrior rises...",
      "Armed with nothing but determination and a mechanical pencil.",
      "They said algebra was impossible.",
      "They were wrong.",
      "His name... is LORENZO.",
    ],
    []
  );

  // Calculate text index from progress
  const textIndex = useMemo(() => {
    const segmentSize = 1 / narration.length;
    return Math.min(Math.floor(progress / segmentSize), narration.length - 1);
  }, [progress, narration.length]);

  // Handle typewriter effect when text changes
  useEffect(() => {
    // Skip if same text
    if (textIndex === lastTextIndexRef.current) return;
    lastTextIndexRef.current = textIndex;

    // Clear any existing typewriter
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }

    const currentText = narration[textIndex];
    let charIdx = 0;
    setDisplayedText("");
    setIsTyping(true);

    typewriterRef.current = setInterval(() => {
      charIdx++;
      if (charIdx <= currentText.length) {
        setDisplayedText(currentText.slice(0, charIdx));
      } else {
        setIsTyping(false);
        if (typewriterRef.current) {
          clearInterval(typewriterRef.current);
          typewriterRef.current = null;
        }
      }
    }, 40);

    return () => {
      if (typewriterRef.current) {
        clearInterval(typewriterRef.current);
        typewriterRef.current = null;
      }
    };
  }, [textIndex, narration]);

  // Cinematic camera movement
  const panX = Math.sin(progress * Math.PI * 1.5) * 15;
  const panY = Math.cos(progress * Math.PI * 0.8) * 8;
  const zoom = 1 + progress * 0.15;

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Parallax background layers */}
      <div
        className="absolute inset-[-100px] transition-transform duration-[1500ms] ease-out"
        style={{
          transform: `translate(${panX * 0.5}px, ${
            panY * 0.5
          }px) scale(${zoom})`,
        }}
      >
        {/* Far background - misty */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#080810]" />

        {/* Abstract architectural shapes suggesting school */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="60"
            x2="45"
            y2="35"
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-foreground"
          />
          <line
            x1="100"
            y1="60"
            x2="55"
            y2="35"
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-foreground"
          />
          <line
            x1="45"
            y1="35"
            x2="55"
            y2="35"
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-foreground"
          />
          <line
            x1="30"
            y1="100"
            x2="45"
            y2="35"
            stroke="currentColor"
            strokeWidth="0.15"
            className="text-foreground"
          />
          <line
            x1="70"
            y1="100"
            x2="55"
            y2="35"
            stroke="currentColor"
            strokeWidth="0.15"
            className="text-foreground"
          />
        </svg>
      </div>

      {/* Mid layer - floating symbols */}
      <div
        className="absolute inset-0 transition-transform duration-[1200ms] ease-out"
        style={{ transform: `translate(${panX}px, ${panY}px)` }}
      >
        {["x", "y", "=", "+", "2", "x²", "y=mx+b", "Σ"].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-primary/8 font-mono"
            style={{
              fontSize: 20 + i * 8,
              left: `${10 + i * 11}%`,
              top: `${15 + Math.sin(i * 2) * 25}%`,
              transform: `translateY(${
                Math.sin(progress * Math.PI * 3 + i) * 15
              }px) rotate(${i * 5 - 15}deg)`,
              transition: "transform 2s ease-out",
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Light rays from center */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[200%] h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-center"
            style={{
              transform: `rotate(${i * 22.5 + progress * 20}deg)`,
              opacity: 0.3 + Math.sin(progress * Math.PI + i) * 0.2,
            }}
          />
        ))}
      </div>

      {/* Character silhouette - dramatic entrance */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-all duration-[2000ms] ease-out"
        style={{
          bottom: `${15 + progress * 10}%`,
          transform: `translateX(-50%) scale(${0.6 + progress * 0.5})`,
          opacity: progress > 0.1 ? 1 : 0,
        }}
      >
        {/* Dramatic backlight glow */}
        <div
          className="absolute inset-0 -z-10 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(139, 0, 0, 0.5) 0%, transparent 60%)",
            width: 300,
            height: 400,
            transform: "translate(-50%, -30%)",
            left: "50%",
          }}
        />

        {/* Silhouette */}
        <div className="relative">
          {/* Body */}
          <div
            className="w-20 h-44 bg-black relative"
            style={{
              clipPath:
                "polygon(35% 0%, 65% 0%, 75% 15%, 80% 40%, 85% 100%, 15% 100%, 20% 40%, 25% 15%)",
            }}
          >
            {/* Inner detail line */}
            <div
              className="absolute inset-2 border border-foreground/10"
              style={{
                clipPath:
                  "polygon(35% 0%, 65% 0%, 75% 15%, 80% 40%, 85% 100%, 15% 100%, 20% 40%, 25% 15%)",
              }}
            />
          </div>
          {/* Head */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-black rounded-full" />

          {/* Subtle rim light */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(139, 0, 0, 0.3) 45%, rgba(139, 0, 0, 0.3) 55%, transparent 100%)",
              filter: "blur(4px)",
            }}
          />
        </div>
      </div>

      {/* Narration text - cinematic subtitle style */}
      <div className="absolute inset-x-0 bottom-[22%] flex justify-center pointer-events-none">
        <div className="max-w-3xl px-8">
          <div className="relative">
            {/* Text background bar */}
            <div
              className="absolute inset-0 -inset-x-4 bg-black/80 rounded"
              style={{
                opacity: displayedText.length > 0 ? 1 : 0,
                transition: "opacity 0.3s ease-out",
              }}
            />

            <p
              className="relative text-xl md:text-3xl text-foreground/95 text-center leading-relaxed py-3 font-medium min-h-[3.5rem]"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              {displayedText}
              <span
                className="inline-block w-0.5 h-6 bg-foreground/60 ml-1 align-middle"
                style={{
                  opacity: isTyping ? 1 : 0,
                  animation: isTyping
                    ? "none"
                    : "pulse 1s ease-in-out infinite",
                }}
              />
            </p>
          </div>
        </div>
      </div>

      {/* Music/mood indicator */}
      <div
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 transition-opacity duration-500"
        style={{ opacity: progress > 0.05 && progress < 0.95 ? 1 : 0 }}
      >
        <div className="flex items-center gap-2 px-4 py-1.5 bg-black/60 rounded-sm">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-foreground/40 rounded-full"
                style={{
                  height: 8 + Math.sin(progress * 20 + i * 2) * 6,
                  transition: "height 0.15s ease-out",
                }}
              />
            ))}
          </div>
          <span className="text-foreground/40 text-[10px] tracking-[0.2em] uppercase">
            STRAIGHT PEAK PLAYING
          </span>
        </div>
      </div>

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_transparent_40%,_black_100%)] pointer-events-none" />
    </div>
  );
}
