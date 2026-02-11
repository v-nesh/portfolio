import { useState, useEffect, useMemo } from "react";

const ScrollSubmarineEffects = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalHeight = typeof document !== "undefined"
    ? document.documentElement.scrollHeight - window.innerHeight
    : 1;
  const progress = Math.min(scrollY / (totalHeight || 1), 1);

  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      baseY: Math.random() * 100,
      size: 1 + Math.random() * 2,
      speed: 0.3 + Math.random() * 0.7,
    })), []);

  const rayOpacity = Math.max(0, 0.06 - progress * 0.08);
  const pressureOverlay = progress * 0.15;

  // Torpedo fires between 25%-40% scroll
  const torpedoProgress = progress >= 0.25 && progress <= 0.45
    ? (progress - 0.25) / 0.2
    : -1;

  // Periscope vignette appears between 50%-65% scroll
  const periscopeActive = progress >= 0.50 && progress <= 0.70;
  const periscopeIntensity = periscopeActive
    ? Math.min((progress - 0.50) / 0.05, 1) * Math.min((0.70 - progress) / 0.05, 1)
    : 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Drifting deep-sea particles with parallax */}
      {particles.map((p) => {
        const offsetY = (scrollY * p.speed * 0.05) % 100;
        return (
          <div
            key={p.id}
            className="absolute rounded-full bg-primary/15"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${(p.baseY + offsetY) % 100}%`,
              transition: "top 0.1s linear",
            }}
          />
        );
      })}

      {/* Light rays from surface */}
      {rayOpacity > 0.005 && (
        <div className="absolute inset-0 overflow-hidden">
          {[15, 35, 60, 80].map((x, i) => (
            <div
              key={`ray-${i}`}
              className="absolute top-0"
              style={{
                left: `${x}%`,
                width: "2px",
                height: "60%",
                background: `linear-gradient(180deg, hsl(var(--primary) / ${rayOpacity}), transparent)`,
                transform: `rotate(${-5 + i * 3}deg) translateY(${-scrollY * 0.1}px)`,
                transformOrigin: "top center",
              }}
            />
          ))}
        </div>
      )}

      {/* Water pressure darkening overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, hsl(var(--background) / ${pressureOverlay}) 100%)`,
        }}
      />

      {/* Horizontal sonar scan line */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          top: `${(scrollY * 0.15) % 100}%`,
          background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.08), transparent)`,
          boxShadow: `0 0 15px hsl(var(--primary) / 0.05)`,
        }}
      />

      {/* === TORPEDO LAUNCH EFFECT === */}
      {torpedoProgress >= 0 && torpedoProgress <= 1 && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Torpedo trail */}
          <div
            className="absolute h-[2px]"
            style={{
              left: "0%",
              top: "45%",
              width: `${torpedoProgress * 110}%`,
              background: `linear-gradient(90deg, transparent 0%, transparent 60%, hsl(var(--primary) / 0.6) 85%, hsl(var(--accent)) 100%)`,
              transition: "width 0.05s linear",
            }}
          />
          {/* Torpedo head glow */}
          <div
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${torpedoProgress * 105}%`,
              top: "calc(45% - 5px)",
              background: `radial-gradient(circle, hsl(var(--accent)), transparent)`,
              boxShadow: `0 0 20px hsl(var(--accent) / 0.8), 0 0 40px hsl(var(--primary) / 0.4)`,
            }}
          />
          {/* Bubble wake behind torpedo */}
          {Array.from({ length: 8 }).map((_, i) => {
            const bx = torpedoProgress * 100 - i * 6;
            if (bx < 0) return null;
            return (
              <div
                key={`wake-${i}`}
                className="absolute rounded-full bg-primary/20"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  left: `${bx}%`,
                  top: `${44 + (Math.sin(i * 1.5) * 2)}%`,
                  opacity: 0.3 - i * 0.03,
                }}
              />
            );
          })}

          {/* Second torpedo (lower) */}
          <div
            className="absolute h-[2px]"
            style={{
              left: "0%",
              top: "55%",
              width: `${Math.max(0, torpedoProgress - 0.15) * 130}%`,
              background: `linear-gradient(90deg, transparent 0%, transparent 60%, hsl(var(--primary) / 0.4) 85%, hsl(var(--sonar-green)) 100%)`,
              transition: "width 0.05s linear",
            }}
          />
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.max(0, torpedoProgress - 0.15) * 125}%`,
              top: "calc(55% - 3px)",
              background: `radial-gradient(circle, hsl(var(--sonar-green)), transparent)`,
              boxShadow: `0 0 15px hsl(var(--sonar-green) / 0.6)`,
              opacity: torpedoProgress > 0.15 ? 1 : 0,
            }}
          />

          {/* "TORPEDO AWAY" flash text */}
          {torpedoProgress > 0.02 && torpedoProgress < 0.35 && (
            <div
              className="absolute left-6 font-mono text-[10px] tracking-[0.3em] text-destructive/70"
              style={{ top: "40%" }}
            >
              ▶ TORPEDO LAUNCHED
            </div>
          )}
        </div>
      )}

      {/* === PERISCOPE VIEW OVERLAY === */}
      {periscopeIntensity > 0 && (
        <div className="hidden md:block absolute inset-0" style={{ opacity: periscopeIntensity }}>
          {/* Circular vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, transparent 25%, hsl(var(--background) / 0.4) 45%, hsl(var(--background) / 0.85) 60%)`,
            }}
          />
          {/* Crosshair lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px" style={{
            background: `linear-gradient(90deg, transparent 20%, hsl(var(--primary) / 0.15) 35%, hsl(var(--primary) / 0.3) 48%, transparent 50%, hsl(var(--primary) / 0.3) 52%, hsl(var(--primary) / 0.15) 65%, transparent 80%)`
          }} />
          <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{
            background: `linear-gradient(180deg, transparent 20%, hsl(var(--primary) / 0.15) 35%, hsl(var(--primary) / 0.3) 48%, transparent 50%, hsl(var(--primary) / 0.3) 52%, hsl(var(--primary) / 0.15) 65%, transparent 80%)`
          }} />
          {/* Range rings */}
          {[12, 20, 30].map((r) => (
            <div
              key={`scope-ring-${r}`}
              className="absolute rounded-full border border-primary/10"
              style={{
                width: `${r}%`,
                height: `${r}%`,
                top: `${50 - r / 2}%`,
                left: `${50 - r / 2}%`,
              }}
            />
          ))}
          {/* Bearing markers */}
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 font-mono text-[8px] text-primary/40 tracking-[0.3em]">
            000°
          </div>
          <div className="absolute bottom-[38%] left-1/2 -translate-x-1/2 font-mono text-[8px] text-primary/40 tracking-[0.3em]">
            180°
          </div>
          <div className="absolute top-1/2 left-[36%] -translate-y-1/2 font-mono text-[8px] text-primary/40 tracking-[0.3em]">
            270°
          </div>
          <div className="absolute top-1/2 right-[36%] -translate-y-1/2 font-mono text-[8px] text-primary/40 tracking-[0.3em]">
            090°
          </div>
          {/* HUD label */}
          <div className="absolute bottom-[32%] left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.25em] text-primary/30">
            ATTACK PERISCOPE — MARK
          </div>
        </div>
      )}

      {/* Depth zone ambient color shifts */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: progress > 0.6
            ? `radial-gradient(ellipse at 50% 80%, hsl(var(--accent) / 0.03), transparent 60%)`
            : "none",
          opacity: progress > 0.6 ? (progress - 0.6) * 2.5 : 0,
        }}
      />
    </div>
  );
};

export default ScrollSubmarineEffects;
