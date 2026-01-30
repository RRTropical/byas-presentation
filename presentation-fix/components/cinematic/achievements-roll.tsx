"use client";

import { useMemo } from "react";

const ACHIEVEMENTS = [
  { name: "First Blood", desc: "Complete your first equation", rarity: "COMMON", icon: "I" },
  { name: "Quick Learner", desc: "Master 3 skills in one week", rarity: "RARE", icon: "II" },
  { name: "Equation Slayer", desc: "Solve 100 equations", rarity: "EPIC", icon: "III" },
  { name: "Graph Master", desc: "Perfect score on graphing test", rarity: "LEGENDARY", icon: "IV" },
  { name: "Untouchable", desc: "Complete exam with no mistakes", rarity: "LEGENDARY", icon: "V" },
  { name: "The Saga Complete", desc: "Finish Algebra I Semester", rarity: "MYTHIC", icon: "VI" },
];

export function AchievementsRoll({ progress }: { progress: number }) {
  // Calculate visible count directly from progress
  const visibleCount = useMemo(() => {
    const thresholds = [0.12, 0.25, 0.37, 0.50, 0.62, 0.87];
    let count = 0;
    for (const t of thresholds) {
      if (progress >= t) count++;
    }
    return Math.min(count, ACHIEVEMENTS.length);
  }, [progress]);

  const selectedIndex = Math.max(0, Math.min(visibleCount - 1, ACHIEVEMENTS.length - 1));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "COMMON":
        return "border-foreground/30 text-foreground/60";
      case "RARE":
        return "border-blue-500 text-blue-400";
      case "EPIC":
        return "border-purple-500 text-purple-400";
      case "LEGENDARY":
        return "border-accent text-accent";
      case "MYTHIC":
        return "border-red-500 text-red-400";
      default:
        return "border-foreground/30";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "COMMON":
        return "bg-foreground/5";
      case "RARE":
        return "bg-blue-500/10";
      case "EPIC":
        return "bg-purple-500/10";
      case "LEGENDARY":
        return "bg-accent/10";
      case "MYTHIC":
        return "bg-gradient-to-br from-red-500/20 via-purple-500/20 to-accent/20";
      default:
        return "bg-foreground/5";
    }
  };

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a15] to-black">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='%23fff' fillOpacity='0.1'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header - z-index 20 */}
      <div className="absolute top-[8%] left-0 right-0 text-center z-20">
        <div className="text-foreground/40 text-xs tracking-[0.5em] uppercase mb-1">
          Journey Complete
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-wider">
          ACHIEVEMENTS UNLOCKED
        </h1>
        <div className="mt-2 text-foreground/50 text-sm">
          {visibleCount} / {ACHIEVEMENTS.length} Unlocked
        </div>
      </div>

      {/* Cards - z-index 10 */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex gap-3 px-6">
          {ACHIEVEMENTS.map((achievement, i) => {
            const isVisible = i < visibleCount;
            const isSelected = i === selectedIndex && isVisible;
            const offset = i - selectedIndex;

            return (
              <div
                key={achievement.name}
                className={`relative w-32 transition-all duration-500 ${getRarityBg(achievement.rarity)}`}
                style={{
                  transform: `
                    translateY(${isSelected ? -15 : 0}px) 
                    rotate(${offset * 2}deg)
                    scale(${isSelected ? 1.08 : 0.92})
                  `,
                  opacity: isVisible ? 1 : 0.15,
                  transitionDelay: `${i * 60}ms`,
                  zIndex: isSelected ? 15 : 10 - Math.abs(offset),
                }}
              >
                <div
                  className={`rounded-lg border-2 p-3 ${getRarityColor(achievement.rarity)} ${
                    isSelected ? "shadow-xl" : ""
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? `0 15px 30px -8px ${
                          achievement.rarity === "LEGENDARY"
                            ? "rgba(251,191,36,0.3)"
                            : achievement.rarity === "MYTHIC"
                              ? "rgba(239,68,68,0.3)"
                              : "rgba(0,0,0,0.5)"
                        }`
                      : "none",
                  }}
                >
                  {isVisible ? (
                    <>
                      {/* Icon */}
                      <div className="text-3xl text-center mb-2 font-serif">{achievement.icon}</div>

                      {/* Name */}
                      <div className="text-foreground font-bold text-center text-xs mb-0.5">
                        {achievement.name}
                      </div>

                      {/* Description */}
                      <div className="text-foreground/50 text-[10px] text-center mb-2 leading-tight">
                        {achievement.desc}
                      </div>

                      {/* Rarity */}
                      <div
                        className={`text-center text-[9px] tracking-wider py-0.5 rounded ${getRarityColor(achievement.rarity)}`}
                      >
                        {achievement.rarity}
                      </div>

                      {/* Shine for legendary+ */}
                      {(achievement.rarity === "LEGENDARY" || achievement.rarity === "MYTHIC") && (
                        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                            style={{ animation: "shimmer 3s infinite" }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-28 flex items-center justify-center">
                      <div className="text-foreground/20 text-3xl">?</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected achievement details - z-index 20 */}
      {visibleCount > 0 && (
        <div
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center z-20"
          style={{ animation: "fadeIn 0.5s ease-out" }}
        >
          <div className={`text-base font-bold ${getRarityColor(ACHIEVEMENTS[selectedIndex].rarity)}`}>
            {ACHIEVEMENTS[selectedIndex].name}
          </div>
          <div className="text-foreground/50 text-xs mt-0.5">
            {ACHIEVEMENTS[selectedIndex].desc}
          </div>
        </div>
      )}

      {/* Navigation - z-index 20 */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-6 text-foreground/30 text-xs z-20">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border border-foreground/20 flex items-center justify-center text-[10px]">
            {"<"}
          </div>
          <div className="w-5 h-5 rounded border border-foreground/20 flex items-center justify-center text-[10px]">
            {">"}
          </div>
          <span>Browse</span>
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_85%)] pointer-events-none z-[1]" />
    </div>
  );
}
