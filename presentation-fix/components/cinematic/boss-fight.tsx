"use client";

import { useEffect, useState, useRef } from "react";

const ATTACKS = [
  { name: "SUBSTITUTION STRIKE", damage: 2847, type: "CRITICAL", color: "#ef4444" },
  { name: "ELIMINATION BLAST", damage: 4203, type: "SUPER", color: "#8b5cf6" },
  { name: "GRAPH THEORY SLASH", damage: 1654, type: "NORMAL", color: "#f5f5f5" },
  { name: "LINEAR DEVASTATION", damage: 6156, type: "ULTIMATE", color: "#fbbf24" },
  { name: "SLOPE INTERCEPT", damage: 3892, type: "CRITICAL", color: "#ef4444" },
  { name: "FINAL CALCULATION", damage: 9999, type: "FINISHER", color: "#ff0080" },
];

interface PaintSplatter {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

interface DamageNumber {
  id: number;
  value: number;
  x: number;
  y: number;
  type: string;
  color: string;
}

export function BossFight({ progress }: { progress: number }) {
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth] = useState(85);
  const [currentAttack, setCurrentAttack] = useState(-1);
  const [comboCount, setComboCount] = useState(0);
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState("");
  const [showQTE, setShowQTE] = useState(false);
  const [qteSuccess, setQteSuccess] = useState(false);
  const [playerPos, setPlayerPos] = useState({ attacking: false });
  const [bossPos, setBossPos] = useState({ hit: false, stagger: false });
  const [paintSplatters, setPaintSplatters] = useState<PaintSplatter[]>([]);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [slowMo, setSlowMo] = useState(false);
  const lastAttackRef = useRef(-1);

  useEffect(() => {
    const newBossHealth = Math.max(0, 100 - progress * 110);
    setBossHealth(newBossHealth);

    // Attack timing - synced with cursor clicks at 0.1, 0.2, 0.3, 0.4, 0.5, 0.6
    const attackThresholds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
    let attackIndex = -1;
    for (let i = 0; i < attackThresholds.length; i++) {
      if (progress >= attackThresholds[i]) {
        attackIndex = i;
      }
    }

    if (attackIndex >= 0 && attackIndex < ATTACKS.length && attackIndex !== lastAttackRef.current) {
      lastAttackRef.current = attackIndex;
      setCurrentAttack(attackIndex);
      const attack = ATTACKS[attackIndex];

      // Trigger attack
      setPlayerPos({ attacking: true });
      setShake(attack.type === "ULTIMATE" || attack.type === "FINISHER" ? 12 : 6);
      setFlash(
        attack.type === "ULTIMATE"
          ? "yellow"
          : attack.type === "FINISHER"
            ? "pink"
            : "white"
      );

      // Slow mo for big hits
      if (attack.type === "ULTIMATE" || attack.type === "FINISHER") {
        setSlowMo(true);
        setTimeout(() => setSlowMo(false), 800);
      }

      // Boss hit reaction
      setTimeout(() => {
        setBossPos({
          hit: true,
          stagger:
            attack.type === "SUPER" ||
            attack.type === "ULTIMATE" ||
            attack.type === "FINISHER",
        });

        // Damage number
        setDamageNumbers((prev) => [
          ...prev,
          {
            id: Date.now(),
            value: attack.damage,
            x: 55 + Math.random() * 15,
            y: 25 + Math.random() * 15,
            type: attack.type,
            color: attack.color,
          },
        ]);

        // Paint splatter
        const colors = ["#dc2626", "#2563eb", "#16a34a", "#eab308", "#ec4899", "#8b5cf6"];
        setPaintSplatters((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: 50 + Math.random() * 30,
            y: 20 + Math.random() * 35,
            color: colors[Math.floor(Math.random() * colors.length)],
            size:
              attack.type === "ULTIMATE" || attack.type === "FINISHER"
                ? 200
                : 100 + Math.random() * 60,
            rotation: Math.random() * 360,
          },
        ]);

        setComboCount((c) => c + 1);
      }, 200);

      // Reset
      setTimeout(() => {
        setPlayerPos({ attacking: false });
        setBossPos({ hit: false, stagger: false });
        setShake(0);
        setFlash("");
      }, 500);

      // Clean old damage numbers
      setTimeout(() => {
        setDamageNumbers((prev) => prev.slice(-2));
      }, 2000);
    }

    // QTE near end
    if (progress > 0.78 && progress < 0.88 && !qteSuccess) {
      setShowQTE(true);
    } else if (progress >= 0.88 && showQTE) {
      setShowQTE(false);
      setQteSuccess(true);
    }
  }, [progress, qteSuccess, showQTE]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0508 0%, #150810 50%, #0a0508 100%)",
        transform:
          shake
            ? `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)`
            : "none",
        transition: slowMo ? "all 0.6s ease-out" : "all 0.05s",
      }}
    >
      {/* Arena floor */}
      <div className="absolute inset-0">
        <div
          className="absolute bottom-0 left-0 right-0 h-[50%]"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(139, 0, 0, 0.05) 100%)",
            transform: "perspective(800px) rotateX(60deg)",
            transformOrigin: "bottom",
          }}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(139, 0, 0, 0.3) 1px, transparent 1px),
                linear-gradient(rgba(139, 0, 0, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>
      </div>

      {/* Atmospheric fog */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/5 blur-2xl"
            style={{
              width: 150 + Math.random() * 150,
              height: 150 + Math.random() * 150,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${12 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Paint splatters - z-index 5 */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        {paintSplatters.map((splatter) => (
          <div
            key={splatter.id}
            className="absolute"
            style={{
              left: `${splatter.x}%`,
              top: `${splatter.y}%`,
              width: splatter.size,
              height: splatter.size,
              background: `radial-gradient(ellipse at center, ${splatter.color}50 0%, ${splatter.color}30 30%, transparent 70%)`,
              transform: `translate(-50%, -50%) rotate(${splatter.rotation}deg)`,
              animation: "splatterIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          />
        ))}
      </div>

      {/* Flash overlay - z-index 30 */}
      {flash && (
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background:
              flash === "yellow"
                ? "rgba(251, 191, 36, 0.3)"
                : flash === "pink"
                  ? "rgba(255, 0, 128, 0.3)"
                  : "rgba(255, 255, 255, 0.2)",
            animation: "flash 0.2s ease-out forwards",
          }}
        />
      )}

      {/* BOSS - z-index 10 */}
      <div
        className="absolute z-10 transition-all"
        style={{
          right: "20%",
          bottom: "28%",
          transform: `translateX(50%) ${bossPos.hit ? "translateX(20px)" : ""} ${bossPos.stagger ? "rotate(-5deg)" : ""}`,
          transition: slowMo ? "all 0.4s ease-out" : "all 0.15s ease-out",
        }}
      >
        {/* Boss glow */}
        <div
          className="absolute -z-10 blur-3xl rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 0, 0, 0.4) 0%, transparent 70%)",
            width: 250,
            height: 250,
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
          }}
        />

        {/* Boss body */}
        <div className="relative">
          <div
            className="w-28 h-40"
            style={{
              filter: bossPos.hit ? "brightness(2)" : "brightness(1)",
              transition: "filter 0.1s",
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-red-900 to-red-950"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 90%, 50% 100%, 0% 90%, 0% 25%)",
              }}
            />
            {/* Eyes */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex gap-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            </div>
            {/* Symbol */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500/40 text-3xl font-bold">
              X
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER - z-index 10 */}
      <div
        className="absolute z-10 transition-all"
        style={{
          left: "22%",
          bottom: "28%",
          transform: `translateX(-50%) ${playerPos.attacking ? "translateX(60px) scale(1.05)" : ""}`,
          transition: slowMo ? "all 0.3s ease-out" : "all 0.12s ease-out",
        }}
      >
        {/* Player glow */}
        <div
          className="absolute -z-10 blur-2xl rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)",
            width: 120,
            height: 120,
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
          }}
        />

        {/* Player body */}
        <div className="relative">
          <div
            className="w-14 h-28"
            style={{
              filter: playerPos.attacking ? "brightness(1.3)" : "brightness(1)",
            }}
          >
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-b from-foreground/90 to-foreground/70 rounded-t-lg" />
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-8 h-8 bg-foreground/90 rounded-full" />
          </div>

          {/* Weapon trail */}
          {playerPos.attacking && (
            <div
              className="absolute top-0 -right-12 w-20 h-1.5 bg-gradient-to-r from-accent via-accent to-transparent rounded-full"
              style={{
                transform: "rotate(-15deg)",
                animation: "attackSlide 0.2s ease-out",
              }}
            />
          )}
        </div>
      </div>

      {/* Damage numbers - z-index 20 */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {damageNumbers.map((dmg) => (
          <div
            key={dmg.id}
            className="absolute"
            style={{
              left: `${dmg.x}%`,
              top: `${dmg.y}%`,
              animation: "damageFloat 1.5s ease-out forwards",
            }}
          >
            <div
              className="text-4xl md:text-6xl font-black"
              style={{
                color: dmg.color,
                textShadow: `0 0 25px ${dmg.color}, 0 3px 0 rgba(0,0,0,0.5)`,
              }}
            >
              {dmg.value.toLocaleString()}
            </div>
            {dmg.type !== "NORMAL" && (
              <div
                className="text-xs tracking-[0.3em] text-center -mt-1"
                style={{ color: dmg.color }}
              >
                {dmg.type}!
              </div>
            )}
          </div>
        ))}
      </div>

      {/* === HUD - z-index 40 === */}

      {/* Boss health bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[60%] max-w-md z-40">
        <div className="flex items-center justify-between mb-1">
          <span className="text-red-400/80 text-[10px] tracking-[0.3em] font-bold">THE FINAL EXAM</span>
          <span className="text-foreground/40 text-[10px] font-mono">{Math.round(bossHealth)}%</span>
        </div>
        <div className="h-3 bg-black/50 rounded overflow-hidden border border-red-900/30 relative">
          <div
            className="h-full relative overflow-hidden transition-all duration-300"
            style={{
              width: `${bossHealth}%`,
              background: "linear-gradient(90deg, #7f1d1d 0%, #dc2626 50%, #ef4444 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>

      {/* Player HUD - bottom left */}
      <div className="absolute bottom-4 left-4 z-40">
        <div className="flex items-end gap-3">
          <div className="w-12 h-12 rounded border-2 border-accent/50 bg-black/50 flex items-center justify-center">
            <span className="text-accent text-xl font-bold">L</span>
          </div>
          <div className="space-y-0.5">
            <div className="text-foreground/80 text-xs font-bold tracking-wider">LORENZO</div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${playerHealth}%` }} />
              </div>
              <span className="text-green-400/60 text-[10px]">{playerHealth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Combo counter - top right */}
      <div className="absolute top-4 right-4 text-right z-40">
        <div className="text-foreground/30 text-[10px] tracking-[0.3em]">COMBO</div>
        <div
          className="text-4xl font-black text-accent transition-transform duration-150"
          style={{
            transform: currentAttack >= 0 && playerPos.attacking ? "scale(1.2)" : "scale(1)",
            textShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
          }}
        >
          {comboCount}
        </div>
      </div>

      {/* Attack name - z-index 35 */}
      {currentAttack >= 0 && playerPos.attacking && (
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 text-center z-[35]"
          style={{ animation: "attackSlide 0.3s ease-out" }}
        >
          <div
            className="text-2xl md:text-4xl font-black tracking-wider"
            style={{
              color: ATTACKS[currentAttack].color,
              textShadow: `0 0 30px ${ATTACKS[currentAttack].color}`,
            }}
          >
            {ATTACKS[currentAttack].name}
          </div>
        </div>
      )}

      {/* QTE Prompt - z-index 50 */}
      {showQTE && !qteSuccess && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="text-center" style={{ animation: "pulse 0.5s ease-in-out infinite" }}>
            <div className="text-foreground/60 text-lg tracking-[0.5em] mb-4">FINISH HIM</div>
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-accent bg-black/80 flex items-center justify-center mx-auto">
                <span className="text-accent text-5xl font-black">X</span>
              </div>
              <svg
                className="absolute inset-0 w-24 h-24 mx-auto"
                style={{ animation: "spin 1.2s linear infinite" }}
              >
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.3)"
                  strokeWidth="3"
                  strokeDasharray="276"
                  strokeDashoffset="0"
                  style={{ animation: "shrink 1.2s linear infinite" }}
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* QTE Success - z-index 50 */}
      {qteSuccess && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="text-center">
            <div
              className="text-5xl md:text-7xl font-black text-accent"
              style={{ textShadow: "0 0 50px rgba(251, 191, 36, 0.8)" }}
            >
              PERFECT!
            </div>
            <div className="text-foreground/50 text-lg mt-2 tracking-wider">+10,000 BONUS</div>
          </div>
        </div>
      )}

      {/* Controller buttons - bottom right */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 z-40">
        {["X", "Y", "B", "A"].map((btn, i) => (
          <div
            key={btn}
            className="w-6 h-6 rounded border border-foreground/20 bg-black/30 flex items-center justify-center text-foreground/30 text-[10px]"
            style={{
              borderColor: currentAttack >= 0 && i === currentAttack % 4 ? "rgba(251, 191, 36, 0.5)" : undefined,
              color: currentAttack >= 0 && i === currentAttack % 4 ? "rgba(251, 191, 36, 0.8)" : undefined,
            }}
          >
            {btn}
          </div>
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)] pointer-events-none z-[1]" />
    </div>
  );
}
