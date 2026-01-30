"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CinematicIntro } from "@/components/cinematic/intro";
import { OriginCutscene } from "@/components/cinematic/origin-cutscene";
import { GameplaySkills } from "@/components/cinematic/gameplay-skills";
import { BossApproach } from "@/components/cinematic/boss-approach";
import { BossFight } from "@/components/cinematic/boss-fight";
import { VictorySequence } from "@/components/cinematic/victory-sequence";
import { AchievementsRoll } from "@/components/cinematic/achievements-roll";
import { FinalCinematic } from "@/components/cinematic/final-cinematic";
import { GameCursor } from "@/components/game-cursor";

const SCENES = [
  { id: "intro", duration: 14000 },
  { id: "origin", duration: 18000 },
  { id: "skills", duration: 22000 },
  { id: "boss-approach", duration: 12000 },
  { id: "boss-fight", duration: 32000 },
  { id: "victory", duration: 16000 },
  { id: "achievements", duration: 24000 },
  { id: "final", duration: 20000 },
];

// Cursor positions and actions for each scene - synchronized with visual elements
const CURSOR_SCRIPTS: Record<
  string,
  Array<{ time: number; x: number; y: number; click?: boolean; hold?: boolean }>
> = {
  intro: [
    { time: 0, x: 50, y: 60 },
    { time: 0.2, x: 50, y: 55 },
    { time: 0.5, x: 50, y: 50 },
    { time: 0.8, x: 52, y: 52 },
  ],
  origin: [
    { time: 0, x: 50, y: 70 },
    { time: 0.15, x: 50, y: 65 },
    { time: 0.35, x: 52, y: 60 },
    { time: 0.55, x: 50, y: 55 },
    { time: 0.75, x: 48, y: 52 },
    { time: 0.95, x: 50, y: 50 },
  ],
  skills: [
    // Row 1: Linear Equations (left), Graphing (center), Slope-Intercept (right)
    { time: 0, x: 30, y: 42 },
    { time: 0.08, x: 30, y: 48, click: true },
    { time: 0.12, x: 50, y: 42 },
    { time: 0.18, x: 50, y: 48, click: true },
    { time: 0.22, x: 70, y: 42 },
    { time: 0.28, x: 70, y: 48, click: true },
    // Row 2: Systems (left), Substitution (center), Elimination (right)
    { time: 0.4, x: 30, y: 58 },
    { time: 0.48, x: 30, y: 64, click: true },
    { time: 0.6, x: 50, y: 58 },
    { time: 0.68, x: 50, y: 64, click: true },
    { time: 0.8, x: 70, y: 58 },
    { time: 0.88, x: 70, y: 64, click: true },
    { time: 0.95, x: 50, y: 55 },
  ],
  "boss-approach": [
    { time: 0, x: 50, y: 80 },
    { time: 0.25, x: 50, y: 75 },
    { time: 0.5, x: 50, y: 70, click: true },
    { time: 0.75, x: 50, y: 65 },
    { time: 0.95, x: 50, y: 60, click: true },
  ],
  "boss-fight": [
    { time: 0, x: 35, y: 55 },
    { time: 0.1, x: 65, y: 45, click: true },
    { time: 0.2, x: 68, y: 42, click: true },
    { time: 0.3, x: 70, y: 38, click: true },
    { time: 0.4, x: 66, y: 44, click: true },
    { time: 0.5, x: 72, y: 40, click: true },
    { time: 0.6, x: 68, y: 42, click: true },
    { time: 0.7, x: 50, y: 50 },
    { time: 0.8, x: 50, y: 50, hold: true },
    { time: 0.95, x: 50, y: 50 },
  ],
  victory: [
    { time: 0, x: 50, y: 60 },
    { time: 0.3, x: 50, y: 55 },
    { time: 0.6, x: 52, y: 53 },
    { time: 0.9, x: 50, y: 50 },
  ],
  achievements: [
    { time: 0, x: 25, y: 50 },
    { time: 0.12, x: 30, y: 50, click: true },
    { time: 0.25, x: 40, y: 50 },
    { time: 0.37, x: 45, y: 50, click: true },
    { time: 0.5, x: 55, y: 50 },
    { time: 0.62, x: 60, y: 50, click: true },
    { time: 0.75, x: 70, y: 50 },
    { time: 0.87, x: 75, y: 50, click: true },
    { time: 0.95, x: 50, y: 50 },
  ],
  final: [
    { time: 0, x: 50, y: 55 },
    { time: 0.3, x: 50, y: 52 },
    { time: 0.6, x: 48, y: 50 },
    { time: 0.9, x: 50, y: 50 },
  ],
};

export default function CinematicPresentation() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [letterboxProgress, setLetterboxProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 80 });
  const [cursorClicking, setCursorClicking] = useState(false);
  const [cursorHolding, setCursorHolding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startCinematic = useCallback(() => {
    setShowStartScreen(false);
    setTimeout(() => {
      setIsPlaying(true);
      let lb = 0;
      const lbInterval = setInterval(() => {
        lb += 0.015;
        setLetterboxProgress(Math.min(lb, 1));
        if (lb >= 1) clearInterval(lbInterval);
      }, 16);
    }, 800);
  }, []);

  // Skip to next scene
  const skipToNext = useCallback(() => {
    if (currentScene < SCENES.length - 1) {
      setCurrentScene((prev) => prev + 1);
      setSceneProgress(0);
    }
  }, [currentScene]);

  // Scene progression - using requestAnimationFrame for smoother updates
  useEffect(() => {
    if (!isPlaying || showStartScreen) return;

    const duration = SCENES[currentScene].duration;
    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(elapsed / duration, 1);

      setSceneProgress(newProgress);

      if (elapsed >= duration) {
        if (currentScene < SCENES.length - 1) {
          setCurrentScene((prev) => prev + 1);
          setSceneProgress(0);
        } else {
          setIsPlaying(false);
        }
      } else {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [currentScene, isPlaying, showStartScreen]);

  // Cursor animation - let CSS transitions handle smoothness
  useEffect(() => {
    if (!isPlaying) return;

    const sceneId = SCENES[currentScene].id;
    const script = CURSOR_SCRIPTS[sceneId] || [];

    if (script.length === 0) {
      setCursorPos({ x: 50, y: 50 });
      return;
    }

    // Find current position based on progress
    let targetPos = script[0];
    for (let i = 0; i < script.length; i++) {
      if (script[i].time <= sceneProgress) {
        targetPos = script[i];
      }
    }

    // Just set the target - CSS transition handles the smooth movement
    setCursorPos({ x: targetPos.x, y: targetPos.y });

    // Check for click actions
    const clickAction = script.find(
      (s) => s.click && Math.abs(s.time - sceneProgress) < 0.02
    );
    const holdAction = script.find((s) => s.hold && sceneProgress >= s.time);

    if (clickAction && !cursorClicking) {
      setCursorClicking(true);
      setTimeout(() => setCursorClicking(false), 150);
    }
    setCursorHolding(!!holdAction);
  }, [currentScene, sceneProgress, isPlaying, cursorClicking]);

  const advanceProgress = useCallback(() => {
    if (isPlaying && sceneProgress < 1) {
      setSceneProgress((prev) => prev + 0.1);
    }
  }, [isPlaying, sceneProgress]);

  const rewindProgress = useCallback(() => {
    if (isPlaying && sceneProgress > 0) {
      setSceneProgress((prev) => prev - 0.1);
    }
  }, [isPlaying, sceneProgress]);

  const goToNextScene = useCallback(() => {
    if (currentScene < SCENES.length - 1) {
      setCurrentScene((prev) => prev + 1);
      setSceneProgress(0);
    }
  }, [currentScene]);

  const goToPrevScene = useCallback(() => {
    if (currentScene > 0) {
      setCurrentScene((prev) => prev - 1);
      setSceneProgress(0);
    }
  }, [currentScene]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showStartScreen && (e.code === "Space" || e.code === "Enter")) {
        startCinematic();
      } else if (e.code === "Space" || e.code === "ArrowRight") {
        skipToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showStartScreen, startCinematic, skipToNext]);

  const renderScene = () => {
    const props = { progress: sceneProgress };
    switch (SCENES[currentScene].id) {
      case "intro":
        return <CinematicIntro {...props} />;
      case "origin":
        return <OriginCutscene {...props} />;
      case "skills":
        return <GameplaySkills {...props} />;
      case "boss-approach":
        return <BossApproach {...props} />;
      case "boss-fight":
        return <BossFight {...props} />;
      case "victory":
        return <VictorySequence {...props} />;
      case "achievements":
        return <AchievementsRoll {...props} />;
      case "final":
        return <FinalCinematic {...props} />;
      default:
        return null;
    }
  };

  // Start screen
  if (showStartScreen) {
    return (
      <div
        className="relative h-screen w-screen bg-black overflow-hidden cursor-none"
        onClick={startCinematic}
      >
        {/* Deep background with subtle movement */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a12] to-black">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.15) 0%, transparent 50%)`,
              animation: "pulse 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Floating embers */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                left: `${Math.random() * 100}%`,
                bottom: `-5%`,
                background: `rgba(${200 + Math.random() * 55}, ${
                  Math.random() * 100
                }, 0, ${0.3 + Math.random() * 0.4})`,
                animation: `floatUp ${
                  10 + Math.random() * 15
                }s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* God of War style runic circle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div
            className="w-[600px] h-[600px] border border-primary/30 rounded-full"
            style={{ animation: "spin 80s linear infinite" }}
          >
            <div
              className="absolute inset-8 border border-primary/20 rounded-full"
              style={{ animation: "spin 60s linear infinite reverse" }}
            />
            <div
              className="absolute inset-16 border border-primary/10 rounded-full"
              style={{ animation: "spin 40s linear infinite" }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="text-center space-y-6">
            <p
              className="text-foreground/30 text-xs tracking-[1em] uppercase"
              style={{ animation: "fadeIn 2s ease-out" }}
            >
              A Mathematical Odyssey
            </p>

            <div style={{ animation: "fadeIn 2s ease-out 0.3s both" }}>
              <h1
                className="text-7xl md:text-[9rem] font-bold tracking-wider leading-none"
                style={{
                  background:
                    "linear-gradient(180deg, #f5f5f5 0%, #a0a0a0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 80px rgba(139, 0, 0, 0.3)",
                }}
              >
                LORENZO
              </h1>
              <h1
                className="text-7xl md:text-[9rem] font-bold tracking-wider -mt-4"
                style={{
                  background:
                    "linear-gradient(180deg, #8B0000 0%, #4a0000 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                COOKS
              </h1>
            </div>

            <div
              className="space-y-2"
              style={{ animation: "fadeIn 2s ease-out 0.6s both" }}
            >
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto" />
              <p className="text-accent/80 text-lg tracking-[0.5em] uppercase">
                Algebra I : I DID IT
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto" />
            </div>

            <div
              className="pt-12"
              style={{ animation: "fadeIn 2s ease-out 1s both" }}
            >
              <div
                className="inline-flex items-center gap-4 text-foreground/40 text-sm tracking-[0.3em]"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              >
                <div className="w-px h-4 bg-foreground/30" />
                CLICK ANYWHERE TO BEGIN
                <div className="w-px h-4 bg-foreground/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none" />

        {/* Start screen cursor animation */}
        <GameCursor
          x={50}
          y={75}
          clicking={false}
          holding={false}
          visible={true}
        />
      </div>
    );
  }

  const letterboxHeight = letterboxProgress * 12;

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen bg-black overflow-hidden cursor-none"
      onClick={skipToNext}
    >
      {/* Cinematic letterbox bars */}
      <div
        className="absolute top-0 left-0 right-0 bg-black z-50 transition-all duration-700 ease-out"
        style={{ height: `${letterboxHeight}%` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 bg-black z-50 transition-all duration-700 ease-out"
        style={{ height: `${letterboxHeight}%` }}
      />

      {/* Scene content */}
      <div
        className="absolute left-0 right-0 overflow-hidden transition-all duration-700"
        style={{
          top: `${letterboxHeight}%`,
          bottom: `${letterboxHeight}%`,
        }}
      >
        {renderScene()}
      </div>

      {/* Game cursor */}
      <GameCursor
        x={cursorPos.x}
        y={cursorPos.y}
        clicking={cursorClicking}
        holding={cursorHolding}
        visible={isPlaying}
      />

      {/* Progress dots */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex gap-2 z-50 transition-all duration-500"
        style={{ bottom: `${Math.max(1, letterboxHeight / 2)}%` }}
      >
        {SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            className="relative h-1 w-6 bg-foreground/10 rounded-full overflow-hidden"
          >
            <div
              className="absolute inset-y-0 left-0 bg-primary/80 rounded-full transition-all duration-100"
              style={{
                width:
                  idx < currentScene
                    ? "100%"
                    : idx === currentScene
                    ? `${sceneProgress * 100}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Skip hint */}
      <div
        className="absolute right-6 text-foreground/20 text-[10px] tracking-[0.2em] z-50"
        style={{ bottom: `${Math.max(1, letterboxHeight / 2)}%` }}
      >
        CLICK TO SKIP
      </div>
    </div>
  );
}
