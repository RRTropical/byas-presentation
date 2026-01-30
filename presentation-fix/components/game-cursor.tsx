"use client";

interface GameCursorProps {
  x: number;
  y: number;
  clicking: boolean;
  holding: boolean;
  visible: boolean;
}

export function GameCursor({ x, y, clicking, holding, visible }: GameCursorProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[100]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${clicking ? 0.8 : holding ? 1.2 : 1})`,
        transition: "left 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.15s ease-out",
      }}
    >
      {/* Cursor glow */}
      <div
        className="absolute inset-0 -z-10 transition-all duration-150"
        style={{
          width: clicking || holding ? 60 : 40,
          height: clicking || holding ? 60 : 40,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: clicking
            ? "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)"
            : holding
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Main cursor - PlayStation style circle */}
      <div className="relative">
        {/* Outer ring */}
        <div
          className="w-8 h-8 rounded-full border-2 transition-all duration-100"
          style={{
            borderColor: clicking
              ? "rgba(251, 191, 36, 0.9)"
              : holding
                ? "rgba(239, 68, 68, 0.9)"
                : "rgba(255, 255, 255, 0.7)",
            backgroundColor: clicking
              ? "rgba(251, 191, 36, 0.2)"
              : holding
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(255, 255, 255, 0.05)",
            boxShadow: clicking
              ? "0 0 20px rgba(251, 191, 36, 0.5), inset 0 0 10px rgba(251, 191, 36, 0.3)"
              : holding
                ? "0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 10px rgba(239, 68, 68, 0.3)"
                : "0 0 10px rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Inner dot */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-100"
            style={{
              width: clicking ? 10 : holding ? 14 : 6,
              height: clicking ? 10 : holding ? 14 : 6,
              backgroundColor: clicking
                ? "rgba(251, 191, 36, 1)"
                : holding
                  ? "rgba(239, 68, 68, 1)"
                  : "rgba(255, 255, 255, 0.9)",
            }}
          />
        </div>

        {/* Click ripple effect */}
        {clicking && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-accent"
            style={{
              animation: "clickRipple 0.4s ease-out forwards",
            }}
          />
        )}

        {/* Hold indicator - rotating ring */}
        {holding && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-dashed border-red-400/60"
            style={{
              animation: "spin 1s linear infinite",
            }}
          />
        )}
      </div>

      {/* Action label */}
      {(clicking || holding) && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] tracking-wider whitespace-nowrap transition-opacity duration-150"
          style={{
            color: clicking ? "rgba(251, 191, 36, 0.8)" : "rgba(239, 68, 68, 0.8)",
          }}
        >
          {holding ? "HOLD" : "CLICK"}
        </div>
      )}
    </div>
  );
}
