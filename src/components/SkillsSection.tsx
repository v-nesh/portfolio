import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const frontendSkills = [
  { name: "React", value: 0.95, angle: 0 },
  { name: "TypeScript", value: 0.9, angle: 60 },
  { name: "JavaScript", value: 0.95, angle: 120 },
  { name: "CSS/Tailwind", value: 0.88, angle: 180 },
  { name: "Framer Motion", value: 0.82, angle: 240 },
  { name: "UI Systems", value: 0.85, angle: 300 },
];

const backendSkills = [
  { name: "Node.js", value: 0.78 },
  { name: "WebSockets", value: 0.82 },
  { name: "REST APIs", value: 0.85 },
  { name: "PostgreSQL", value: 0.72 },
  { name: "Firebase", value: 0.70 },
  { name: "Docker", value: 0.65 },
];

const RadarChart = ({ skills, size = 260 }: { skills: typeof frontendSkills; size?: number }) => {
  const center = size / 2;
  const maxR = center - 40;

  const points = skills.map((s) => {
    const rad = (s.angle * Math.PI) / 180;
    const r = maxR * s.value;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative w-full max-w-[220px] sm:max-w-[260px] mx-auto">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle key={i} cx={center} cy={center} r={maxR * scale}
            fill="none" stroke="hsl(var(--primary))" strokeOpacity={0.1} strokeWidth={1} />
        ))}
        {skills.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          return (
            <line key={i} x1={center} y1={center}
              x2={center + maxR * Math.cos(rad)} y2={center + maxR * Math.sin(rad)}
              stroke="hsl(var(--primary))" strokeOpacity={0.08} strokeWidth={1} />
          );
        })}
        <polygon points={polygonPoints}
          fill="hsl(var(--primary))" fillOpacity={0.1}
          stroke="hsl(var(--primary))" strokeOpacity={0.6} strokeWidth={1.5} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="hsl(var(--primary))" />
        ))}
        {skills.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          const labelR = maxR + 25;
          return (
            <text key={i} x={center + labelR * Math.cos(rad)} y={center + labelR * Math.sin(rad)}
              textAnchor="middle" dominantBaseline="middle"
              className="fill-muted-foreground font-mono" fontSize={9}>
              {s.name}
            </text>
          );
        })}
      </svg>
      <div className="absolute inset-0 animate-sonar-sweep origin-center pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
          style={{ background: 'linear-gradient(90deg, hsl(var(--sonar-green) / 0.3), transparent)' }} />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const frontendRef = useRef(null);
  const backendRef = useRef(null);
  const frontendInView = useInView(frontendRef, { once: true, margin: "-100px" });
  const backendInView = useInView(backendRef, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="relative py-32 px-6 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={frontendInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
          ref={frontendRef}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary/60 mb-3">// SYSTEMS CHECK</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Technical <span className="text-gradient-primary">Sonar</span>
          </h2>
        </motion.div>

        {/* === FRONTEND SONAR === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={frontendInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-panel p-8 mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="font-mono text-sm tracking-[0.2em] text-primary">FRONTEND — PRIMARY SYSTEMS</h3>
            <div className="flex-1 h-px bg-primary/10" />
            <span className="font-mono text-[10px] text-muted-foreground">SECTOR A</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <RadarChart skills={frontendSkills} />
            </div>

            <div className="space-y-4">
              {frontendSkills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={frontendInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                >
                  <div className="flex justify-between mb-1.5">
                    <span className="font-mono text-xs tracking-wider text-foreground">{skill.name}</span>
                    <span className="font-mono text-xs text-primary/60">{Math.round(skill.value * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={frontendInView ? { width: `${skill.value * 100}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* === BACKEND SONAR — Different style === */}
        <div ref={backendRef}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={backendInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative border border-destructive/20 rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(135deg, hsl(var(--background)), hsl(0 0% 8%))`,
            }}
          >
            {/* Scanline overlay */}
            <div className="absolute inset-0 scanline pointer-events-none opacity-40" />

            {/* Red accent bar top */}
            <div className="h-px w-full" style={{
              background: 'linear-gradient(90deg, transparent, hsl(0 72% 50% / 0.4), transparent)'
            }} />

            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <h3 className="font-mono text-sm tracking-[0.2em] text-destructive/80">BACKEND — ENGINE ROOM</h3>
                <div className="flex-1 h-px bg-destructive/10" />
                <span className="font-mono text-[10px] text-destructive/40">SECTOR B</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {backendSkills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={backendInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                    className="relative group"
                  >
                    <div className="border border-border/30 rounded-lg p-5 hover:border-destructive/30 transition-colors duration-300"
                      style={{ background: 'hsl(var(--depth-1))' }}>
                      {/* Skill name & level */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs tracking-wider text-foreground">{skill.name}</span>
                        <span className="font-mono text-lg font-bold text-destructive/80">{Math.round(skill.value * 100)}</span>
                      </div>

                      {/* Circular gauge */}
                      <div className="flex justify-center">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="32" fill="none"
                            stroke="hsl(var(--border))" strokeOpacity="0.3" strokeWidth="3" />
                          <motion.circle cx="40" cy="40" r="32" fill="none"
                            stroke="hsl(0 72% 50%)" strokeOpacity="0.6" strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                            animate={backendInView ? {
                              strokeDashoffset: 2 * Math.PI * 32 * (1 - skill.value)
                            } : {}}
                            transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                            transform="rotate(-90 40 40)"
                          />
                          <text x="40" y="42" textAnchor="middle" dominantBaseline="middle"
                            className="font-mono fill-muted-foreground" fontSize="9">
                            {Math.round(skill.value * 100)}%
                          </text>
                        </svg>
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        <div className={`w-1 h-1 rounded-full ${skill.value >= 0.8 ? 'bg-sonar' : skill.value >= 0.7 ? 'bg-primary' : 'bg-destructive/60'}`} />
                        <span className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground/60">
                          {skill.value >= 0.8 ? 'OPERATIONAL' : skill.value >= 0.7 ? 'NOMINAL' : 'DEVELOPING'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom status bar */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-destructive/10">
                <span className="font-mono text-[9px] text-destructive/30 tracking-[0.2em]">ENGINE STATUS: ALL SYSTEMS GO</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sonar animate-pulse" />
                  <span className="font-mono text-[9px] text-muted-foreground/40">ONLINE</span>
                </div>
              </div>
            </div>

            {/* Red accent bar bottom */}
            <div className="h-px w-full" style={{
              background: 'linear-gradient(90deg, transparent, hsl(0 72% 50% / 0.4), transparent)'
            }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
