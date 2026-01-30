"use client";

import { useEffect, useState } from "react";

export function FinalCinematic({ progress }: { progress: number }) {
  const [phase, setPhase] = useState(0);
  const [paintSplatters, setPaintSplatters] = useState<
    Array<{ id: number; x: number; y: number; color: string; size: number }>
  >([]);

  useEffect(() => {
    if (progress < 0.2) setPhase(0);
    else if (progress < 0.5) setPhase(1);
    else if (progress < 0.8) setPhase(2);
    else setPhase(3);

    // Add colorful paint splatters progressively
    if (progress > 0.3) {
      const count = Math.floor((progress - 0.3) * 30);
      const colors = [
        "#dc2626",
        "#2563eb",
        "#16a34a",
        "#eab308",
        "#ec4899",
        "#8b5cf6",
        "#06b6d4",
      ];
      const newSplatters = [];
      for (let i = 0; i < count; i++) {
        newSplatters.push({
          id: i,
          x: 5 + Math.random() * 90,
          y: 5 + Math.random() * 90,
          color: colors[i % colors.length],
          size: 80 + Math.random() * 200,
        });
      }
      setPaintSplatters(newSplatters);
    }
  }, [progress]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background transitioning from dark to colorful */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background:
            phase >= 2
              ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
              : "linear-gradient(to bottom, #0a0a10, #000)",
        }}
      />

      {/* Paint splatters covering everything */}
      {paintSplatters.map((splatter) => (
        <div
          key={splatter.id}
          className="absolute pointer-events-none mix-blend-screen"
          style={{
            left: `${splatter.x}%`,
            top: `${splatter.y}%`,
            width: splatter.size,
            height: splatter.size,
            background: `radial-gradient(ellipse at center, ${splatter.color}80 0%, ${splatter.color}40 30%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: "blur(20px)",
          }}
        />
      ))}

      {/* Phase 0-1: Looking forward */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-1000"
        style={{ opacity: phase <= 1 ? 1 : 0 }}
      >
        <div className="text-center space-y-6">
          <div className="text-foreground/40 text-sm tracking-[0.5em] uppercase">
            The Journey Continues
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-wider">
            SEMESTER TWO
          </h1>
          <div className="text-foreground/60 text-xl">
            New challenges await...
          </div>
        </div>
      </div>

      {/* Phase 2: Goals teaser */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-1000"
        style={{
          opacity: phase === 2 ? 1 : 0,
          transform: `scale(${phase === 2 ? 1 : 0.9})`,
        }}
      >
        <div className="text-center space-y-8">
          <div className="text-accent text-sm tracking-[0.5em] uppercase">
            In the DLC: Semester 2
          </div>
          <div className="space-y-4 text-foreground/80 text-2xl">
            <p style={{ animationDelay: "0.2s" }}>Quadratic Equations</p>
            <p style={{ animationDelay: "0.4s" }}>Sequencing</p>
            <p style={{ animationDelay: "0.6s" }}>Advanced Graphing</p>
          </div>
          <div className="text-foreground/40 text-lg mt-8">
            The saga is far from over.
          </div>
        </div>
      </div>

      {/* Phase 3: Credits / Thank you */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-1000"
        style={{
          opacity: phase === 3 ? 1 : 0,
        }}
      >
        <div className="text-center space-y-6">
          <div className="text-foreground/30 text-sm tracking-[0.5em] uppercase">
            Presented By
          </div>
          <h1
            className="text-6xl md:text-8xl font-bold tracking-wider"
            style={{
              background:
                "linear-gradient(135deg, #fff 0%, #fbbf24 50%, #ef4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LORENZO
          </h1>
          <div className="text-foreground/40 text-lg tracking-[0.3em] uppercase">
            Studios
          </div>

          {/* Stats summary */}
          <div className="flex items-center justify-center gap-8 mt-8 text-foreground/60">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">S+</div>
              <div className="text-sm">Final Grade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">47</div>
              <div className="text-sm">Max Combo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">100%</div>
              <div className="text-sm">Complete</div>
            </div>
          </div>

          {/* Technologies Used */}
          <div className="mt-10 pt-8 border-t border-foreground/10">
            <div className="text-foreground/30 text-xs tracking-[0.4em] uppercase mb-4">
              Built With
            </div>
            <div className="flex items-center justify-center gap-6 flex-wrap max-w-lg mx-auto">
              <div className="flex items-center gap-2 text-foreground/50">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.251 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0z" />
                </svg>
                <span className="text-sm font-medium">Next.js</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/50">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278z" />
                </svg>
                <span className="text-sm font-medium">React</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/50">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
                </svg>
                <span className="text-sm font-medium">Tailwind</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/50">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.677.111a6.38 6.38 0 0 1 1.463.37v2.963a5.62 5.62 0 0 0-.706-.343 5.178 5.178 0 0 0-1.82-.347c-.308 0-.557.027-.749.082a1.25 1.25 0 0 0-.435.175c-.114.078-.196.166-.247.266a.776.776 0 0 0-.075.343c0 .147.04.282.118.407.079.125.19.24.331.347.142.107.311.215.507.324.197.108.413.222.649.342a8.129 8.129 0 0 1 1.12.663c.309.218.572.46.788.724.217.265.381.56.495.885.113.324.169.691.169 1.102 0 .612-.091 1.129-.271 1.552a2.76 2.76 0 0 1-.787 1.062 3.28 3.28 0 0 1-1.271.604 6.82 6.82 0 0 1-1.708.194c-.591 0-1.145-.042-1.662-.126a7.435 7.435 0 0 1-1.416-.375V16.52c.273.135.575.263.907.384.333.121.683.22 1.05.3.367.078.742.136 1.126.173.383.037.75.044 1.1.021a2.49 2.49 0 0 0 .499-.087.794.794 0 0 0 .323-.169c.082-.082.146-.183.195-.302a1.16 1.16 0 0 0 .075-.415c0-.176-.048-.332-.144-.467a1.788 1.788 0 0 0-.415-.392 4.98 4.98 0 0 0-.662-.375 15.243 15.243 0 0 0-.881-.415 7.91 7.91 0 0 1-1.012-.6 3.687 3.687 0 0 1-.724-.685 2.646 2.646 0 0 1-.435-.829 3.337 3.337 0 0 1-.144-1.022c0-.536.105-1.004.315-1.405.21-.401.502-.735.877-.999.374-.265.818-.463 1.33-.595a7.03 7.03 0 0 1 1.711-.194zm-7.684.072l2.85 6.927h.034l2.668-6.927h3.05l-4.5 10.5h-2.869l-4.283-10.5z" />
                </svg>
                <span className="text-sm font-medium">TypeScript</span>
              </div>
            </div>
          </div>

          {/* Thank you */}
          <div className="mt-8 text-foreground/30 text-sm tracking-widest">
            KABOOM... KABLOW... KABOOM...
          </div>
        </div>
      </div>

      {/* Floating embers/particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-5%`,
              backgroundColor: ["#fbbf24", "#ef4444", "#ec4899", "#8b5cf6"][
                i % 4
              ],
              animation: `floatUp ${5 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_90%)] pointer-events-none" />
    </div>
  );
}
