import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SectionDividerProps {
  variant?: "sonar" | "bubbles" | "depth" | "signal" | "comms";
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
          animate={inView ? { left: ["-10%", "110%"] } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (variant === "comms") {
    return (
      <div ref={ref} className="relative h-56 flex items-center justify-center overflow-hidden">
        {/* Background encrypted data streams */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`stream-${i}`}
            className="absolute font-mono text-[7px] text-primary/10 whitespace-nowrap select-none"
            style={{ top: `${15 + i * 14}%`, left: 0 }}
            initial={{ x: i % 2 === 0 ? '-100%' : '100%' }}
            animate={inView ? { x: i % 2 === 0 ? '100%' : '-100%' } : {}}
            transition={{ duration: 8 + i * 2, ease: 'linear', repeat: Infinity }}
          >
            {Array.from({ length: 60 }).map((_, j) =>
              String.fromCharCode(48 + ((i * 7 + j * 3) % 74))
            ).join(' ')}
          </motion.div>
        ))}

        {/* Central connection line */}
        <motion.div
          className="absolute h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent 10%, hsl(var(--primary) / 0.15) 30%, hsl(var(--primary) / 0.4) 50%, hsl(var(--primary) / 0.15) 70%, transparent 90%)' }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Left antenna node */}
        <motion.div
          className="absolute left-[20%] flex flex-col items-center gap-1"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-3 h-3 rounded-full border border-primary/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
          </div>
          <div className="font-mono text-[7px] text-primary/30 tracking-[0.2em]">TX</div>
          {/* Ping rings from left node */}
          {[0, 1, 2].map((r) => (
            <motion.div
              key={`lping-${r}`}
              className="absolute rounded-full border border-primary/15"
              style={{ width: 10, height: 10 }}
              initial={{ scale: 0.5, opacity: 0.6 }}
              animate={inView ? { scale: [0.5, 3 + r], opacity: [0.5, 0] } : {}}
              transition={{ duration: 2, delay: 0.5 + r * 0.4, repeat: Infinity, repeatDelay: 1 }}
            />
          ))}
        </motion.div>

        {/* Right antenna node */}
        <motion.div
          className="absolute right-[20%] flex flex-col items-center gap-1"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-3 h-3 rounded-full border border-primary/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-sonar/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="font-mono text-[7px] text-primary/30 tracking-[0.2em]">RX</div>
          {/* Ping rings from right node */}
          {[0, 1, 2].map((r) => (
            <motion.div
              key={`rping-${r}`}
              className="absolute rounded-full border border-sonar/15"
              style={{ width: 10, height: 10 }}
              initial={{ scale: 0.5, opacity: 0.5 }}
              animate={inView ? { scale: [0.5, 3 + r], opacity: [0.4, 0] } : {}}
              transition={{ duration: 2, delay: 0.8 + r * 0.4, repeat: Infinity, repeatDelay: 1 }}
            />
          ))}
        </motion.div>

        {/* Signal pulse traveling between nodes */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            background: 'hsl(var(--primary))',
            boxShadow: '0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.3)',
          }}
          initial={{ left: '20%', opacity: 0 }}
          animate={inView ? {
            left: ['20%', '80%', '20%'],
            opacity: [0, 1, 1, 0],
          } : {}}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
        />

        {/* Frequency wave bars — center */}
        <motion.div
          className="absolute flex items-center gap-[2px]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const h = 4 + Math.abs(Math.sin(i * 0.6)) * 16;
            return (
              <motion.div
                key={`bar-${i}`}
                className="w-[1.5px] rounded-full bg-primary/30"
                initial={{ height: 2 }}
                animate={inView ? { height: [2, h, 2] } : {}}
                transition={{
                  duration: 1.2 + Math.random() * 0.5,
                  delay: 0.8 + i * 0.04,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            );
          })}
        </motion.div>

        {/* Status text */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            initial={{ backgroundColor: 'hsl(var(--primary) / 0.3)' }}
            animate={inView ? {
              backgroundColor: ['hsl(var(--primary) / 0.3)', 'hsl(160 90% 45% / 0.8)'],
            } : {}}
            transition={{ delay: 2, duration: 0.5 }}
          />
          <motion.span
            className="font-mono text-[9px] tracking-[0.3em] text-primary/30"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            COMMS LINK ESTABLISHED — CHANNEL SECURE ✓
          </motion.span>
        </div>

        {/* Top status label */}
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.25em] text-primary/20"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          ▼ OPENING SECURE CHANNEL ▼
        </motion.div>
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
