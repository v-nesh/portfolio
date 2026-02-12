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

  const torpedoProgress = progress >= 0.25 && progress <= 0.45
    ? (progress - 0.25) / 0.2
    : -1;
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
          {(() => {
            const tx = torpedoProgress * 110;
            const torpY = 45;
            return (
              <>
                {/* Propeller exhaust plume — multi-layered wake */}
                <div
                  className="absolute"
                  style={{
                    left: `${Math.max(0, tx - 18)}%`,
                    top: `${torpY - 1.2}%`,
                    width: '18%',
                    height: '2.4%',
                    background: `linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.06) 20%, hsl(var(--primary) / 0.15) 60%, hsl(var(--accent) / 0.35) 100%)`,
                    filter: 'blur(3px)',
                  }}
                />
                {/* Turbulent water disturbance line */}
                <div
                  className="absolute"
                  style={{
                    left: '0%',
                    top: `${torpY}%`,
                    width: `${Math.max(0, tx - 4)}%`,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent 0%, transparent 50%, hsl(var(--primary) / 0.12) 75%, hsl(var(--primary) / 0.3) 100%)`,
                  }}
                />
                {/* Secondary wider wake shimmer */}
                <div
                  className="absolute"
                  style={{
                    left: `${Math.max(0, tx - 30)}%`,
                    top: `${torpY - 2}%`,
                    width: '30%',
                    height: '4%',
                    background: `radial-gradient(ellipse at 100% 50%, hsl(var(--primary) / 0.05), transparent 70%)`,
                    filter: 'blur(6px)',
                  }}
                />

                {/* Cavitation bubble trail */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const bx = tx - 3 - i * 2.5;
                  if (bx < 0) return null;
                  const size = 2 + (i % 3) * 1.5;
                  const yOff = Math.sin(i * 1.2 + torpedoProgress * 8) * 1.8;
                  const fadeOut = Math.max(0, 1 - i * 0.06);
                  return (
                    <div
                      key={`t1-bubble-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: size,
                        height: size,
                        left: `${bx}%`,
                        top: `${torpY - 0.3 + yOff}%`,
                        opacity: fadeOut * 0.5,
                        background: `radial-gradient(circle, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.1))`,
                        boxShadow: `0 0 ${size}px hsl(var(--primary) / 0.15)`,
                      }}
                    />
                  );
                })}

                {/* SVG Torpedo body */}
                <svg
                  className="absolute"
                  style={{
                    left: `${tx - 3}%`,
                    top: `${torpY - 1.5}%`,
                    width: '50px',
                    height: '24px',
                    filter: `drop-shadow(0 0 8px hsl(var(--accent) / 0.6)) drop-shadow(0 0 20px hsl(var(--primary) / 0.3))`,
                  }}
                  viewBox="0 0 50 24"
                  fill="none"
                >
                  {/* Torpedo body — streamlined shape */}
                  <path
                    d="M4 12 Q4 6, 12 5 L36 5 Q42 5, 44 8 L48 12 L44 16 Q42 19, 36 19 L12 19 Q4 18, 4 12Z"
                    fill="hsl(var(--primary))"
                    fillOpacity="0.7"
                    stroke="hsl(var(--accent))"
                    strokeOpacity="0.8"
                    strokeWidth="0.6"
                  />
                  {/* Warhead nosecone */}
                  <path
                    d="M44 8 Q50 12, 44 16"
                    fill="hsl(var(--accent))"
                    fillOpacity="0.9"
                  />
                  {/* Body highlight streak */}
                  <path
                    d="M14 8 L40 8"
                    stroke="hsl(var(--accent))"
                    strokeOpacity="0.3"
                    strokeWidth="0.5"
                  />
                  {/* Tail fins */}
                  <path d="M6 5 L2 1 L8 4" fill="hsl(var(--primary))" fillOpacity="0.5" />
                  <path d="M6 19 L2 23 L8 20" fill="hsl(var(--primary))" fillOpacity="0.5" />
                  {/* Propeller hub */}
                  <circle cx="4" cy="12" r="2" fill="hsl(var(--primary))" fillOpacity="0.6" />
                  {/* Propeller blades (rotating feel) */}
                  <line x1="4" y1="8" x2="4" y2="4" stroke="hsl(var(--primary))" strokeOpacity="0.4" strokeWidth="0.8" />
                  <line x1="4" y1="16" x2="4" y2="20" stroke="hsl(var(--primary))" strokeOpacity="0.4" strokeWidth="0.8" />
                </svg>

                {/* Nose glow — leading shockwave */}
                <div
                  className="absolute rounded-full"
                  style={{
                    left: `${tx + 0.5}%`,
                    top: `${torpY - 1}%`,
                    width: '12px',
                    height: '12px',
                    background: `radial-gradient(circle, hsl(var(--accent) / 0.9), hsl(var(--accent) / 0.3) 50%, transparent 70%)`,
                    boxShadow: `0 0 15px hsl(var(--accent) / 0.8), 0 0 30px hsl(var(--primary) / 0.4), 0 0 50px hsl(var(--accent) / 0.2)`,
                  }}
                />
              </>
            );
          })()}

          {/* ── TORPEDO 2 (Lower — staggered) ── */}
          {(() => {
            const t2prog = Math.max(0, torpedoProgress - 0.18);
            const tx2 = t2prog * 125;
            const torpY2 = 56;
            if (t2prog <= 0) return null;
            return (
              <>
                {/* Propeller exhaust plume */}
                <div
                  className="absolute"
                  style={{
                    left: `${Math.max(0, tx2 - 15)}%`,
                    top: `${torpY2 - 1}%`,
                    width: '15%',
                    height: '2%',
                    background: `linear-gradient(90deg, transparent 0%, hsl(var(--sonar-green) / 0.06) 20%, hsl(var(--sonar-green) / 0.12) 60%, hsl(var(--sonar-green) / 0.3) 100%)`,
                    filter: 'blur(3px)',
                  }}
                />
                {/* Wake line */}
                <div
                  className="absolute"
                  style={{
                    left: '0%',
                    top: `${torpY2}%`,
                    width: `${Math.max(0, tx2 - 3)}%`,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent 0%, transparent 60%, hsl(var(--sonar-green) / 0.1) 80%, hsl(var(--sonar-green) / 0.25) 100%)`,
                  }}
                />

                {/* Cavitation bubbles */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const bx2 = tx2 - 3 - i * 2.2;
                  if (bx2 < 0) return null;
                  const size = 1.5 + (i % 3) * 1.2;
                  const yOff = Math.sin(i * 1.4 + torpedoProgress * 10) * 1.5;
                  const fadeOut = Math.max(0, 1 - i * 0.08);
                  return (
                    <div
                      key={`t2-bubble-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: size,
                        height: size,
                        left: `${bx2}%`,
                        top: `${torpY2 - 0.2 + yOff}%`,
                        opacity: fadeOut * 0.4,
                        background: `radial-gradient(circle, hsl(var(--sonar-green) / 0.35), hsl(var(--sonar-green) / 0.08))`,
                        boxShadow: `0 0 ${size}px hsl(var(--sonar-green) / 0.12)`,
                      }}
                    />
                  );
                })}

                {/* SVG Torpedo 2 body */}
                <svg
                  className="absolute"
                  style={{
                    left: `${tx2 - 2.5}%`,
                    top: `${torpY2 - 1.2}%`,
                    width: '42px',
                    height: '20px',
                    filter: `drop-shadow(0 0 6px hsl(var(--sonar-green) / 0.5)) drop-shadow(0 0 16px hsl(var(--sonar-green) / 0.25))`,
                  }}
                  viewBox="0 0 50 24"
                  fill="none"
                >
                  <path
                    d="M4 12 Q4 6, 12 5 L36 5 Q42 5, 44 8 L48 12 L44 16 Q42 19, 36 19 L12 19 Q4 18, 4 12Z"
                    fill="hsl(var(--sonar-green))"
                    fillOpacity="0.6"
                    stroke="hsl(var(--sonar-green))"
                    strokeOpacity="0.7"
                    strokeWidth="0.6"
                  />
                  <path d="M44 8 Q50 12, 44 16" fill="hsl(var(--sonar-green))" fillOpacity="0.8" />
                  <path d="M14 8 L40 8" stroke="hsl(var(--sonar-green))" strokeOpacity="0.25" strokeWidth="0.5" />
                  <path d="M6 5 L2 1 L8 4" fill="hsl(var(--sonar-green))" fillOpacity="0.4" />
                  <path d="M6 19 L2 23 L8 20" fill="hsl(var(--sonar-green))" fillOpacity="0.4" />
                  <circle cx="4" cy="12" r="2" fill="hsl(var(--sonar-green))" fillOpacity="0.5" />
                </svg>

                {/* Nose glow */}
                <div
                  className="absolute rounded-full"
                  style={{
                    left: `${tx2 + 0.3}%`,
                    top: `${torpY2 - 0.8}%`,
                    width: '10px',
                    height: '10px',
                    background: `radial-gradient(circle, hsl(var(--sonar-green) / 0.8), hsl(var(--sonar-green) / 0.2) 50%, transparent 70%)`,
                    boxShadow: `0 0 12px hsl(var(--sonar-green) / 0.7), 0 0 25px hsl(var(--sonar-green) / 0.3)`,
                  }}
                />
              </>
            );
          })()}

          {/* HUD warning text */}
          {torpedoProgress > 0.02 && torpedoProgress < 0.4 && (
            <div
              className="absolute left-6 font-mono text-[10px] tracking-[0.3em]"
              style={{
                top: "38%",
                color: `hsl(0 72% 50% / ${0.5 + Math.sin(torpedoProgress * 30) * 0.3})`,
                textShadow: `0 0 8px hsl(0 72% 50% / 0.3)`,
              }}
            >
              ⚠ TORPEDO 1 — LAUNCHED
            </div>
          )}
          {torpedoProgress > 0.20 && torpedoProgress < 0.55 && (
            <div
              className="absolute left-6 font-mono text-[10px] tracking-[0.3em]"
              style={{
                top: "60%",
                color: `hsl(var(--sonar-green) / ${0.4 + Math.sin(torpedoProgress * 25) * 0.3})`,
                textShadow: `0 0 8px hsl(var(--sonar-green) / 0.25)`,
              }}
            >
              ⚠ TORPEDO 2 — LAUNCHED
            </div>
          )}
        </div>
      )}

      {periscopeIntensity > 0 && (
        <div className="hidden md:block absolute inset-0" style={{ opacity: periscopeIntensity }}>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center,
                transparent 22%,
                hsl(var(--primary) / 0.03) 23%,
                transparent 24%,
                transparent 28%,
                hsl(var(--background) / 0.3) 35%,
                hsl(var(--background) / 0.7) 45%,
                hsl(var(--background) / 0.92) 55%,
                hsl(var(--background)) 65%
              )`,
            }}
          />
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: '50vh',
              height: '50vh',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '1px solid hsl(var(--primary) / 0.12)',
              boxShadow: `inset 0 0 40px hsl(var(--primary) / 0.04), 0 0 30px hsl(var(--background) / 0.5)`,
            }}
          />

          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: '48vh',
              height: '48vh',
              transform: `translate(-50%, -50%) rotate(${scrollY * 0.03}deg)`,
              transition: 'transform 0.1s linear',
            }}
          >
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Major bearing ticks every 30° */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10) * Math.PI / 180;
                const isMajor = i % 3 === 0;
                const r1 = isMajor ? 185 : 190;
                const r2 = 197;
                return (
                  <g key={`tick-${i}`}>
                    <line
                      x1={200 + r1 * Math.cos(angle)}
                      y1={200 + r1 * Math.sin(angle)}
                      x2={200 + r2 * Math.cos(angle)}
                      y2={200 + r2 * Math.sin(angle)}
                      stroke="hsl(var(--primary))"
                      strokeOpacity={isMajor ? 0.4 : 0.15}
                      strokeWidth={isMajor ? 1 : 0.5}
                    />
                    {isMajor && (
                      <text
                        x={200 + 175 * Math.cos(angle)}
                        y={200 + 175 * Math.sin(angle)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-mono"
                        fontSize="7"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.35"
                      >
                        {String(i * 10).padStart(3, '0')}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── MIL-DOT RETICLE — precision crosshair ── */}
          {/* Horizontal reticle with stadiametric marks */}
          <div className="absolute top-1/2 left-0 right-0" style={{ height: '1px' }}>
            <div
              style={{
                height: '1px',
                background: `linear-gradient(90deg,
                  transparent 15%,
                  hsl(var(--primary) / 0.08) 25%,
                  hsl(var(--primary) / 0.25) 40%,
                  hsl(var(--primary) / 0.5) 47%,
                  transparent 49.5%,
                  transparent 50.5%,
                  hsl(var(--primary) / 0.5) 53%,
                  hsl(var(--primary) / 0.25) 60%,
                  hsl(var(--primary) / 0.08) 75%,
                  transparent 85%
                )`,
              }}
            />
            {/* Mil-dots on horizontal */}
            {[-8, -6, -4, -2, 2, 4, 6, 8].map((dot) => (
              <div
                key={`hdot-${dot}`}
                className="absolute rounded-full bg-primary/40"
                style={{
                  width: '3px',
                  height: '3px',
                  top: '-1px',
                  left: `${50 + dot * 2.5}%`,
                }}
              />
            ))}
          </div>
          {/* Vertical reticle with stadiametric marks */}
          <div className="absolute left-1/2 top-0 bottom-0" style={{ width: '1px' }}>
            <div
              style={{
                width: '1px',
                height: '100%',
                background: `linear-gradient(180deg,
                  transparent 15%,
                  hsl(var(--primary) / 0.08) 25%,
                  hsl(var(--primary) / 0.25) 40%,
                  hsl(var(--primary) / 0.5) 47%,
                  transparent 49.5%,
                  transparent 50.5%,
                  hsl(var(--primary) / 0.5) 53%,
                  hsl(var(--primary) / 0.25) 60%,
                  hsl(var(--primary) / 0.08) 75%,
                  transparent 85%
                )`,
              }}
            />
            {/* Mil-dots on vertical */}
            {[-8, -6, -4, -2, 2, 4, 6, 8].map((dot) => (
              <div
                key={`vdot-${dot}`}
                className="absolute rounded-full bg-primary/40"
                style={{
                  width: '3px',
                  height: '3px',
                  left: '-1px',
                  top: `${50 + dot * 2.5}%`,
                }}
              />
            ))}
          </div>
          {/* Center diamond reticle */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: '14px',
              height: '14px',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              border: '1px solid hsl(var(--primary) / 0.5)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '50%',
              left: '50%',
              width: '4px',
              height: '4px',
              transform: 'translate(-50%, -50%)',
              background: 'hsl(var(--primary) / 0.7)',
              boxShadow: '0 0 6px hsl(var(--primary) / 0.4)',
            }}
          />

          {/* ── ANIMATED RANGE RINGS — pulsing outward ── */}
          {[10, 16, 24].map((r, i) => (
            <div
              key={`range-ring-${r}`}
              className="absolute rounded-full"
              style={{
                width: `${r}vh`,
                height: `${r}vh`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: `1px solid hsl(var(--primary) / ${0.08 + Math.sin(scrollY * 0.008 + i * 2) * 0.04})`,
              }}
            />
          ))}

          {/* ── SONAR SWEEP LINE — rotating ── */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: '22vh',
              height: '1px',
              transformOrigin: '0% 50%',
              transform: `rotate(${scrollY * 0.15}deg)`,
              background: `linear-gradient(90deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.08), transparent)`,
            }}
          />
          {/* Sweep afterglow cone */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: '22vh',
              height: '8vh',
              transformOrigin: '0% 50%',
              transform: `rotate(${scrollY * 0.15 - 15}deg) translateY(-50%)`,
              background: `linear-gradient(90deg, hsl(var(--primary) / 0.06), transparent 60%)`,
              filter: 'blur(8px)',
            }}
          />

          {/* ── TARGET TRACKING BOX — animated acquisition ── */}
          {(() => {
            const tgtX = 50 + Math.sin(scrollY * 0.005) * 8;
            const tgtY = 50 + Math.cos(scrollY * 0.007) * 5;
            const locked = Math.sin(scrollY * 0.01) > 0.3;
            return (
              <div
                className="absolute"
                style={{
                  left: `${tgtX}%`,
                  top: `${tgtY}%`,
                  width: locked ? '36px' : '44px',
                  height: locked ? '36px' : '44px',
                  transform: 'translate(-50%, -50%)',
                  transition: 'width 0.3s, height 0.3s, border-color 0.3s',
                  border: `1px solid ${locked ? 'hsl(0 72% 50% / 0.7)' : 'hsl(var(--primary) / 0.4)'}`,
                  boxShadow: locked ? '0 0 12px hsl(0 72% 50% / 0.3)' : 'none',
                }}
              >
                {/* Corner brackets */}
                {[
                  { t: -1, l: -1, bt: 'top', bl: 'left' },
                  { t: -1, l: undefined, r: -1, bt: 'top', bl: 'right' },
                  { t: undefined, b: -1, l: -1, bt: 'bottom', bl: 'left' },
                  { t: undefined, b: -1, l: undefined, r: -1, bt: 'bottom', bl: 'right' },
                ].map((corner, ci) => (
                  <div
                    key={`tgt-corner-${ci}`}
                    className="absolute"
                    style={{
                      top: corner.t !== undefined ? corner.t : undefined,
                      bottom: corner.b !== undefined ? corner.b : undefined,
                      left: corner.l !== undefined ? corner.l : undefined,
                      right: corner.r !== undefined ? corner.r : undefined,
                      width: '8px',
                      height: '8px',
                      [`border${corner.bt === 'top' ? 'Top' : 'Bottom'}`]: `2px solid ${locked ? 'hsl(0 72% 50% / 0.8)' : 'hsl(var(--primary) / 0.5)'}`,
                      [`border${corner.bl === 'left' ? 'Left' : 'Right'}`]: `2px solid ${locked ? 'hsl(0 72% 50% / 0.8)' : 'hsl(var(--primary) / 0.5)'}`,
                    }}
                  />
                ))}
                {/* Lock indicator */}
                {locked && (
                  <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-destructive/80"
                    style={{ fontSize: '6px', letterSpacing: '0.2em', textShadow: '0 0 4px hsl(0 72% 50% / 0.4)' }}
                  >
                    TGT LOCK
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── WATER DROPLETS ON LENS ── */}
          {[
            { x: 38, y: 35, s: 6 },
            { x: 62, y: 42, s: 4 },
            { x: 45, y: 58, s: 5 },
            { x: 55, y: 32, s: 3 },
            { x: 35, y: 52, s: 4 },
          ].map((drop, i) => (
            <div
              key={`drop-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${drop.x}%`,
                top: `${drop.y}%`,
                width: `${drop.s}px`,
                height: `${drop.s * 1.3}px`,
                background: `radial-gradient(ellipse at 30% 30%, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.04) 60%, transparent)`,
                border: '0.5px solid hsl(var(--primary) / 0.08)',
              }}
            />
          ))}

          {/* ── CARDINAL BEARING LABELS (static, outside ring) ── */}
          <div className="absolute top-[24%] left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary/50 tracking-[0.3em]">
            N ▲ 000°
          </div>
          <div className="absolute bottom-[24%] left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary/50 tracking-[0.3em]">
            S ▼ 180°
          </div>
          <div className="absolute top-1/2 left-[22%] -translate-y-1/2 font-mono text-[9px] text-primary/50 tracking-[0.3em]">
            W 270°
          </div>
          <div className="absolute top-1/2 right-[22%] -translate-y-1/2 font-mono text-[9px] text-primary/50 tracking-[0.3em]">
            E 090°
          </div>

          {/* ── HUD DATA READOUTS ── */}
          {/* Left panel */}
          <div className="absolute left-[8%] top-[30%] space-y-3">
            {[
              { label: 'BEARING', value: `${String(Math.round((scrollY * 0.03) % 360)).padStart(3, '0')}°` },
              { label: 'RANGE', value: `${(2.4 + Math.sin(scrollY * 0.004) * 1.2).toFixed(1)} NM` },
              { label: 'SPEED', value: `${(12 + Math.sin(scrollY * 0.006) * 4).toFixed(1)} KTS` },
            ].map((data) => (
              <div key={data.label}>
                <div className="font-mono text-[7px] tracking-[0.25em] text-primary/30">{data.label}</div>
                <div className="font-mono text-[10px] tracking-wider text-primary/60 tabular-nums">{data.value}</div>
              </div>
            ))}
          </div>

          {/* Right panel */}
          <div className="absolute right-[8%] top-[30%] space-y-3 text-right">
            {[
              { label: 'SOLUTION', value: Math.sin(scrollY * 0.01) > 0.3 ? 'LOCKED' : 'TRACKING' },
              { label: 'DEPTH', value: `${Math.round(180 + progress * 400)}m` },
              { label: 'TEMP', value: `${(4.2 - progress * 1.5).toFixed(1)}°C` },
            ].map((data) => (
              <div key={data.label}>
                <div className="font-mono text-[7px] tracking-[0.25em] text-primary/30">{data.label}</div>
                <div
                  className="font-mono text-[10px] tracking-wider tabular-nums"
                  style={{
                    color: data.value === 'LOCKED'
                      ? 'hsl(0 72% 50% / 0.7)'
                      : 'hsl(var(--primary) / 0.6)',
                    textShadow: data.value === 'LOCKED' ? '0 0 6px hsl(0 72% 50% / 0.3)' : 'none',
                  }}
                >
                  {data.value}
                </div>
              </div>
            ))}
          </div>

          {/* ── BOTTOM HUD STRIP ── */}
          <div className="absolute bottom-[26%] left-1/2 -translate-x-1/2 flex items-center gap-6">
            <span className="font-mono text-[8px] tracking-[0.2em] text-primary/25">
              MAGNIFICATION: 6×
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-primary/40">
              ─── ATTACK PERISCOPE ───
            </span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-primary/25">
              FOV: 10.4°
            </span>
          </div>

          {/* ── REC INDICATOR — blinking ── */}
          <div className="absolute top-[28%] right-[10%] flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-destructive/80"
              style={{
                animation: 'typing-cursor 1.2s step-end infinite',
                boxShadow: '0 0 6px hsl(0 72% 50% / 0.5)',
              }}
            />
            <span className="font-mono text-[8px] tracking-[0.25em] text-destructive/60">REC</span>
          </div>

          {/* ── SUBTLE SCANLINE OVERLAY ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.015) 2px, hsl(var(--primary) / 0.015) 4px)`,
            }}
          />
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
