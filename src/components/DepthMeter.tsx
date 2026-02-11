import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DepthMeter = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / totalHeight, 1);
      setScrollProgress(progress);
      setDepth(Math.round(progress * 3200));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const depthMarkers = [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-1"
    >
      {/* Depth label */}
      <div className="font-mono text-[9px] tracking-[0.2em] text-primary/50 mb-2">DEPTH</div>

      {/* Meter track */}
      <div className="relative w-6 h-64">
        {/* Track background */}
        <div className="absolute inset-x-0 inset-y-0 w-px left-1/2 -translate-x-1/2 bg-border/40" />

        {/* Depth markers */}
        {depthMarkers.map((m, i) => {
          const y = (i / (depthMarkers.length - 1)) * 100;
          return (
            <div
              key={m}
              className="absolute left-0 right-0 flex items-center"
              style={{ top: `${y}%` }}
            >
              <div className="w-2 h-px bg-primary/30" />
              <span className="font-mono text-[7px] text-muted-foreground/50 ml-1 leading-none">
                {m}
              </span>
            </div>
          );
        })}

        {/* Active fill */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px top-0 bg-primary/60 transition-all duration-150"
          style={{ height: `${scrollProgress * 100}%` }}
        />

        {/* Current depth indicator */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 -ml-px"
          style={{ top: `${scrollProgress * 100}%` }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/80 shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-sonar-pulse" />
        </motion.div>
      </div>

      {/* Digital readout */}
      <div className="mt-3 glass-panel px-2 py-1.5 text-center">
        <div className="font-mono text-[10px] text-primary tabular-nums">
          {depth.toString().padStart(4, "0")}m
        </div>
        <div className="font-mono text-[7px] text-muted-foreground/50 tracking-wider">
          {scrollProgress < 0.2 ? "SURFACE" : scrollProgress < 0.5 ? "MIDWATER" : scrollProgress < 0.8 ? "DEEP SEA" : "ABYSS"}
        </div>
      </div>

      {/* Pressure warning */}
      {scrollProgress > 0.7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-2 font-mono text-[7px] text-destructive tracking-wider"
        >
          ⚠ HIGH PSI
        </motion.div>
      )}
    </motion.div>
  );
};

export default DepthMeter;
