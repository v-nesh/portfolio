import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[700px] md:h-[700px]">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-primary/[0.07]"
              style={{
                transform: `scale(${0.3 + i * 0.25})`,
              }}
            />
          ))}
          <div className="absolute inset-0 animate-sonar-sweep origin-center">
            <div
              className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--primary) / 0.4), transparent)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary/70 mb-4 uppercase">
            // System Online — Awaiting Command
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-foreground">VIGNESH </span>
          <span className="text-gradient-primary">B</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="w-8 h-px bg-primary/40" />
          <p className="font-mono text-sm tracking-[0.15em] text-muted-foreground">
            Web Developer <span className="text-primary">|</span> React Specialist
          </p>
          <span className="w-8 h-px bg-primary/40" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-lg mx-auto text-muted-foreground text-sm leading-relaxed mb-12"
        >
          Navigating complex frontends with precision. 3+ years charting courses through
          React ecosystems, building performant interfaces that run deep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              const el = document.getElementById("projects");
              if (el) {
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="glass-panel-strong px-8 py-3 font-mono text-xs tracking-[0.15em] text-primary hover:bg-primary/10 transition-colors duration-300 cursor-pointer"
          >
            VIEW MISSIONS
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("contact");
              if (el) {
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="px-8 py-3 font-mono text-xs tracking-[0.15em] text-muted-foreground border border-border/50 rounded-lg hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-pointer"
          >
            TRANSMIT
          </button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-primary/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
