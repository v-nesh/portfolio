import { useState, useEffect, useRef, useCallback } from "react";

const SubmarineCrosshair = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [headerHeight, setHeaderHeight] = useState(0);
  const [bearing, setBearing] = useState(0);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });

  // Measure header height dynamically
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header") || document.querySelector("nav");
      if (header) setHeaderHeight(header.getBoundingClientRect().height);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    const tick = () => {
      const t = targetRef.current;
      setPos((prev) => {
        const lx = prev.x + (t.x - prev.x) * 0.3;
        const ly = prev.y + (t.y - prev.y) * 0.3;
        return { x: lx, y: ly };
      });

      // Bearing: screen center = 0°, right = +, left = -
      const centerX = window.innerWidth / 2;
      const raw = ((t.x - centerX) / centerX) * 180;
      setBearing(((raw % 360) + 360) % 360);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  const clampedY = Math.max(pos.y, headerHeight);
  const xPercent = (pos.x / window.innerWidth) * 100;

  return (
    <div className="hidden md:block fixed inset-0 pointer-events-none z-40">
      {/* Horizontal line */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: clampedY - 0.5,
          height: 1,
          background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15) ${xPercent - 35}%, hsl(var(--primary) / 0.4) ${xPercent - 5}%, hsl(var(--primary) / 0.6) ${xPercent}%, hsl(var(--primary) / 0.4) ${xPercent + 5}%, hsl(var(--primary) / 0.15) ${xPercent + 35}%, transparent)`,
        }}
      />

      {/* Vertical line */}
      <div
        className="absolute"
        style={{
          left: pos.x - 0.5,
          top: headerHeight,
          bottom: 0,
          width: 1,
          background: `linear-gradient(180deg, transparent, hsl(var(--primary) / 0.15) 10%, hsl(var(--primary) / 0.4) 40%, hsl(var(--primary) / 0.6) ${((clampedY - headerHeight) / (window.innerHeight - headerHeight)) * 100}%, hsl(var(--primary) / 0.15) 90%, transparent)`,
        }}
      />

      {/* Center reticle */}
      <div
        className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40"
        style={{ left: pos.x, top: clampedY }}
      />
      <div
        className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30"
        style={{ left: pos.x, top: clampedY }}
      />

      {/* Bearing readout near cursor */}
      <div
        className="absolute font-mono text-[9px] text-primary/50 tracking-[0.2em]"
        style={{ left: pos.x + 14, top: clampedY + 10 }}
      >
        {bearing.toFixed(1)}°
      </div>
    </div>
  );
};

export default SubmarineCrosshair;
