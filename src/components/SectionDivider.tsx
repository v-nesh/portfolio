import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SectionDividerProps {
  variant?: "sonar" | "bubbles" | "depth" | "signal";
}

const SectionDivider = ({ variant = "sonar" }: SectionDividerProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-50px" });

  if (variant === "sonar") {
    return (
      <div ref={ref} className="relative h-32 flex items-center justify-center overflow-hidden">
        {/* Sonar wave rings expanding on scroll */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            initial={{ width: 10, height: 10, opacity: 0 }}
            animate={inView ? {
              width: [10, 200 + i * 80],
              height: [10, 200 + i * 80],
              opacity: [0.6, 0],
            } : {}}
            transition={{
              duration: 2,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          />
        ))}
        {/* Center ping dot */}
        <motion.div
          className="w-2 h-2 rounded-full bg-primary"
          initial={{ scale: 0 }}
          animate={inView ? { scale: [0, 1.5, 1], opacity: [0, 1, 0.6] } : {}}
          transition={{ duration: 0.6 }}
        />
        {/* Horizontal sonar line */}
        <motion.div
          className="absolute h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    );
  }

  if (variant === "bubbles") {
    return (
      <div ref={ref} className="relative h-40 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/15 bg-primary/5"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              width: `${6 + (i % 4) * 4}px`,
              height: `${6 + (i % 4) * 4}px`,
            }}
            initial={{ bottom: -20, opacity: 0 }}
            animate={inView ? {
              bottom: ["-10%", `${60 + Math.random() * 40}%`],
              opacity: [0, 0.8, 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 15)],
            } : {}}
            transition={{
              duration: 2.5 + Math.random() * 1.5,
              delay: i * 0.15,
              ease: "easeOut",
            }}
          />
        ))}
        {/* Depth pressure line */}
        <div className="absolute top-1/2 left-0 right-0 flex items-center gap-2 px-8">
          <motion.div
            className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5 }}
          />
          <motion.span
            className="font-mono text-[9px] tracking-[0.3em] text-primary/30 whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            ▼ DESCENDING ▼
          </motion.span>
          <motion.div
            className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5 }}
          />
        </div>
      </div>
    );
  }

  if (variant === "depth") {
    return (
      <div ref={ref} className="relative h-28 flex items-center justify-center overflow-hidden">
        {/* Depth gauge markers */}
        <div className="absolute inset-0 flex items-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={inView ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <div
                className={`w-px ${i % 5 === 0 ? "h-6 bg-primary/30" : "h-3 bg-primary/15"}`}
              />
            </motion.div>
          ))}
        </div>
        {/* Scanning beam */}
        <motion.div
          className="absolute top-0 bottom-0 w-20"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.08), transparent)",
          }}
          initial={{ left: "-10%" }}
          animate={inView ? { left: ["- 10%", "110%"] } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    );
  }

  // signal variant
  return (
    <div ref={ref} className="relative h-24 flex items-center justify-center overflow-hidden">
      <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none">
        <motion.path
          d="M0,24 Q50,4 100,24 Q150,44 200,24 Q250,4 300,24 Q350,44 400,24 Q450,4 500,24 Q550,44 600,24 Q650,4 700,24 Q750,44 800,24 Q850,4 900,24 Q950,44 1000,24"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity={0.2}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      <motion.div
        className="absolute font-mono text-[9px] tracking-[0.3em] text-primary/25"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
      >
        ─── SIGNAL ACQUIRED ───
      </motion.div>
    </div>
  );
};

export default SectionDivider;
