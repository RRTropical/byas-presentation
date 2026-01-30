"use client";

import { useMemo } from "react";

const SKILLS = [
  { name: "Linear Equations", level: "MASTERED", xp: 2500, icon: "f(x)" },
  { name: "Graphing", level: "MASTERED", xp: 2200, icon: "xy" },
  { name: "Slope-Intercept", level: "MASTERED", xp: 2800, icon: "m" },
  { name: "Systems of Equations", level: "ADVANCED", xp: 1900, icon: "sys" },
  { name: "Substitution", level: "MASTERED", xp: 2400, icon: "sub" },
  { name: "Elimination", level: "MASTERED", xp: 2600, icon: "elim" },
];

export function GameplaySkills({ progress }: { progress: number }) {
  // Calculate everything from progress directly - no state flickering
  const showHUD = progress > 0.03;

  const visibleSkills = useMemo(() => {
    const skillThresholds = [0.08, 0.18, 0.28, 0.48, 0.68, 0.88];
    let count = 0;
    for (const threshold of skillThresholds) {
      if (progress >= threshold) count++;
    }
    return count;
  }, [progress]);

  const selectedSkill = visibleSkills > 0 ? visibleSkills - 1 : -1;

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Dark game world background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0a0f0a] via-[#101815] to-[#0a0a10] transition-transform duration-[3000ms]"
        style={{ transform: `scale(${1 + progress * 0.05})` }}
      >
        {/* Subtle grid floor */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: `perspective(500px) rotateX(60deg) translateY(${
              progress * 50
            }px)`,
            transformOrigin: "center bottom",
          }}
        />
      </div>

      {/* Game HUD - Top bar */}
      <div
        className="absolute top-4 left-0 right-0 px-6 transition-all duration-700 z-10"
        style={{
          opacity: showHUD ? 1 : 0,
          transform: `translateY(${showHUD ? 0 : -30}px)`,
        }}
      >
        <div className="flex justify-between items-start max-w-5xl mx-auto">
          {/* Player info - left */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border-2 border-accent/60 bg-accent/10 flex items-center justify-center">
              <span className="text-accent text-xl font-bold">L</span>
            </div>
            <div>
              <div className="text-foreground text-sm font-bold">LORENZO</div>
              <div className="text-foreground/40 text-xs">LVL 14 WARRIOR</div>
              {/* XP Bar */}
              <div className="w-28 h-1.5 bg-foreground/10 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000"
                  style={{ width: `${70 + progress * 30}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quest indicator - right */}
          <div className="text-right">
            <div className="text-foreground/40 text-[10px] tracking-wider">
              CURRENT QUEST
            </div>
            <div className="text-accent text-xs">Master All Algebra Skills</div>
            <div className="text-foreground/30 text-[10px] mt-0.5">
              {visibleSkills}/{SKILLS.length} Complete
            </div>
          </div>
        </div>
      </div>

      {/* Skills menu - centered */}
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div
          className="w-full max-w-3xl px-6 transition-all duration-700"
          style={{
            opacity: showHUD ? 1 : 0,
            transform: `scale(${showHUD ? 1 : 0.95}) translateY(${
              showHUD ? 0 : 20
            }px)`,
          }}
        >
          {/* Menu header */}
          <div className="flex items-center justify-between mb-4 border-b border-foreground/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="text-foreground text-lg font-bold tracking-wide">
                SKILLS ACQUIRED
              </div>
              <div className="px-2 py-0.5 bg-primary/20 border border-primary/40 text-primary text-[10px] rounded">
                SEMESTER 1
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/40 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {visibleSkills} / {SKILLS.length} Mastered
            </div>
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-3 gap-3">
            {SKILLS.map((skill, i) => {
              const isVisible = i < visibleSkills;
              const isSelected = i === selectedSkill;

              return (
                <div
                  key={skill.name}
                  className="relative bg-foreground/5 border border-foreground/10 p-3 rounded transition-all duration-500"
                  style={{
                    opacity: isVisible ? 1 : 0.2,
                    transform: `translateY(${isVisible ? 0 : 15}px) scale(${
                      isSelected ? 1.02 : 1
                    })`,
                    transitionDelay: `${i * 80}ms`,
                    borderColor: isSelected
                      ? "rgba(251, 191, 36, 0.5)"
                      : undefined,
                    backgroundColor: isSelected
                      ? "rgba(251, 191, 36, 0.05)"
                      : undefined,
                  }}
                >
                  {/* Skill icon */}
                  <div className="w-10 h-10 rounded bg-primary/20 border border-primary/30 flex items-center justify-center mb-2">
                    <span className="text-primary text-sm font-mono">
                      {skill.icon}
                    </span>
                  </div>

                  <div className="text-foreground text-sm font-medium">
                    {skill.name}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        skill.level === "MASTERED"
                          ? "bg-accent/20 text-accent"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {skill.level}
                    </span>
                    <span className="text-foreground/30 text-[10px]">
                      {skill.xp} XP
                    </span>
                  </div>

                  {/* Selection cursor indicator */}
                  {isSelected && isVisible && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Controller prompt - bottom */}
          <div className="mt-6 flex items-center justify-center gap-6 text-foreground/30 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded border border-foreground/20 flex items-center justify-center text-[10px]">
                A
              </div>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded border border-foreground/20 flex items-center justify-center text-[10px]">
                B
              </div>
              <span>Back</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded border border-foreground/20 flex items-center justify-center text-[10px]">
                Y
              </div>
              <span>Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement popup - properly positioned */}
      {visibleSkills === SKILLS.length && (
        <div
          className="absolute top-16 right-6 bg-black/90 border border-accent/60 px-4 py-3 rounded z-20"
          style={{
            animation: "slideInRight 0.5s ease-out",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-lg">*</span>
            </div>
            <div>
              <div className="text-accent text-[10px] tracking-wider">
                ACHIEVEMENT UNLOCKED
              </div>
              <div className="text-foreground text-sm font-bold">
                Skill Master
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_85%)] pointer-events-none" />
    </div>
  );
}
