import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Compass, Anchor, Navigation } from "lucide-react";

const missionLog = [
  {
    year: "2025 — PRESENT",
    title: "Frontend Engineer",
    org: "Aeolus Aero Tech.",
    desc: "Developed interactive map visualizations and data-driven interfaces using React, TypeScript and OpenLayers.",
    icon: Navigation,
  },
  {
    year: "2023 — 2025",
    title: "Frontend Developer",
    org: "TechSwing Solutions.",
    desc: "Leading React architecture for real-time monitoring dashboards. Building performant WebSocket-driven UIs.",
    icon: Compass,
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32 px-6">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary/60 mb-3">// PERSONNEL FILE</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Mission <span className="text-gradient-primary">Log</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            3+ years navigating the depths of frontend development. Specialized in React-based systems,
            real-time interfaces, and complex UI architecture. Every project is a mission executed with precision.
          </p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />

          <div className="space-y-12">
            {missionLog.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="relative pl-16 md:pl-20"
              >
                <div className="absolute left-[18px] md:left-[26px] top-1 w-3 h-3 rounded-full border-2 border-primary bg-background" />

                <div className="glass-panel p-6 hud-corner">
                  <p className="font-mono text-xs text-primary/70 tracking-wider mb-2">{entry.year}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <entry.icon size={14} className="text-primary" />
                    <h3 className="font-semibold text-foreground">{entry.title}</h3>
                  </div>
                  <p className="text-sm text-primary/50 font-mono mb-2">{entry.org}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{entry.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
