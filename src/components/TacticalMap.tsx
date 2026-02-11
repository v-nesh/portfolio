import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const TacticalMap = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 1.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [inView]);

  const mapSize = 420;
  const center = mapSize / 2;
  const maxR = center - 30;

  // Simulated submarine route waypoints
  const waypoints = [
    { x: 0.2, y: 0.3 },
    { x: 0.35, y: 0.45 },
    { x: 0.5, y: 0.4 },
    { x: 0.65, y: 0.55 },
    { x: 0.78, y: 0.48 },
    { x: 0.85, y: 0.6 },
  ];

  // Blip targets (sonar contacts)
  const contacts = [
    { x: 0.3, y: 0.25, label: "SB-04", type: "friendly" },
    { x: 0.7, y: 0.35, label: "UK-17", type: "unknown" },
    { x: 0.55, y: 0.7, label: "CT-09", type: "friendly" },
    { x: 0.15, y: 0.65, label: "SG-22", type: "unknown" },
  ];

  const routePath = waypoints
    .map((wp, i) => `${i === 0 ? "M" : "L"}${wp.x * mapSize},${wp.y * mapSize}`)
    .join(" ");

  const sweepRad = (sweepAngle * Math.PI) / 180;

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-5xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary/60 mb-3">
            // TACTICAL OVERVIEW
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Navigation <span className="text-gradient-primary">Chart</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="glass-panel-strong p-6 md:p-8 hud-corner relative">
            {/* Status bar top */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-flicker" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-primary/60">
                  SONAR ACTIVE
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50">
                DEPTH: 240m | HEADING: 047°
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Main map SVG */}
              <svg
                width={mapSize}
                height={mapSize}
                className="overflow-visible shrink-0 max-w-full"
                viewBox={`0 0 ${mapSize} ${mapSize}`}
              >
                {/* Background grid */}
                {Array.from({ length: 11 }).map((_, i) => {
                  const pos = (i / 10) * mapSize;
                  return (
                    <g key={`grid-${i}`}>
                      <line
                        x1={pos} y1={0} x2={pos} y2={mapSize}
                        stroke="hsl(var(--primary))" strokeOpacity={0.06} strokeWidth={0.5}
                      />
                      <line
                        x1={0} y1={pos} x2={mapSize} y2={pos}
                        stroke="hsl(var(--primary))" strokeOpacity={0.06} strokeWidth={0.5}
                      />
                    </g>
                  );
                })}

                {/* Coordinate labels */}
                {["A", "B", "C", "D", "E"].map((letter, i) => (
                  <text
                    key={letter}
                    x={8}
                    y={40 + i * (mapSize / 5)}
                    className="fill-primary/20 font-mono"
                    fontSize={8}
                  >
                    {letter}
                  </text>
                ))}
                {[1, 2, 3, 4, 5].map((num, i) => (
                  <text
                    key={num}
                    x={40 + i * (mapSize / 5)}
                    y={mapSize - 8}
                    className="fill-primary/20 font-mono"
                    fontSize={8}
                    textAnchor="middle"
                  >
                    {num}
                  </text>
                ))}

                {/* Radar circles from center */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                  <circle
                    key={`radar-${i}`}
                    cx={center}
                    cy={center}
                    r={maxR * scale}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeOpacity={0.07}
                    strokeWidth={0.5}
                    strokeDasharray="3 6"
                  />
                ))}

                {/* Sweep cone */}
                {inView && (
                  <g>
                    <defs>
                      <radialGradient id="sweepGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <path
                      d={`M${center},${center} L${center + maxR * Math.cos(sweepRad)},${center + maxR * Math.sin(sweepRad)} A${maxR},${maxR} 0 0,0 ${center + maxR * Math.cos(sweepRad - 0.5)},${center + maxR * Math.sin(sweepRad - 0.5)} Z`}
                      fill="url(#sweepGrad)"
                    />
                    <line
                      x1={center}
                      y1={center}
                      x2={center + maxR * Math.cos(sweepRad)}
                      y2={center + maxR * Math.sin(sweepRad)}
                      stroke="hsl(var(--primary))"
                      strokeOpacity={0.4}
                      strokeWidth={1}
                    />
                  </g>
                )}

                {/* Route path */}
                <motion.path
                  d={routePath}
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
                />

                {/* Route waypoints */}
                {waypoints.map((wp, i) => (
                  <motion.g
                    key={`wp-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.3 }}
                  >
                    <circle
                      cx={wp.x * mapSize}
                      cy={wp.y * mapSize}
                      r={3}
                      fill="hsl(var(--accent))"
                      fillOpacity={0.8}
                    />
                    <circle
                      cx={wp.x * mapSize}
                      cy={wp.y * mapSize}
                      r={6}
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeOpacity={0.3}
                      strokeWidth={0.5}
                    />
                  </motion.g>
                ))}

                {/* Sonar contacts */}
                {contacts.map((c, i) => (
                  <motion.g
                    key={`contact-${i}`}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.5 + i * 0.2 }}
                  >
                    {/* Ping ring */}
                    <circle
                      cx={c.x * mapSize}
                      cy={c.y * mapSize}
                      r={10}
                      fill="none"
                      stroke={c.type === "friendly" ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                      strokeOpacity={0.3}
                      strokeWidth={0.5}
                      className="animate-sonar-pulse"
                      style={{ transformOrigin: `${c.x * mapSize}px ${c.y * mapSize}px`, animationDuration: "3s" }}
                    />
                    {/* Contact dot */}
                    <circle
                      cx={c.x * mapSize}
                      cy={c.y * mapSize}
                      r={2.5}
                      fill={c.type === "friendly" ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                      className="animate-flicker"
                    />
                    {/* Label */}
                    <text
                      x={c.x * mapSize + 10}
                      y={c.y * mapSize - 6}
                      className="font-mono"
                      fontSize={7}
                      fill={c.type === "friendly" ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                      fillOpacity={0.7}
                    >
                      {c.label}
                    </text>
                  </motion.g>
                ))}

                {/* Center crosshair (own position) */}
                <line x1={center - 8} y1={center} x2={center + 8} y2={center} stroke="hsl(var(--primary))" strokeOpacity={0.5} strokeWidth={0.8} />
                <line x1={center} y1={center - 8} x2={center} y2={center + 8} stroke="hsl(var(--primary))" strokeOpacity={0.5} strokeWidth={0.8} />
                <circle cx={center} cy={center} r={4} fill="none" stroke="hsl(var(--primary))" strokeOpacity={0.4} strokeWidth={0.8} />

                {/* Border frame */}
                <rect x={0} y={0} width={mapSize} height={mapSize} fill="none" stroke="hsl(var(--primary))" strokeOpacity={0.15} strokeWidth={1} />
                {/* Corner brackets */}
                {[[0, 0], [mapSize, 0], [0, mapSize], [mapSize, mapSize]].map(([cx, cy], i) => (
                  <g key={`corner-${i}`}>
                    <line
                      x1={cx} y1={cy}
                      x2={cx + (cx === 0 ? 15 : -15)} y2={cy}
                      stroke="hsl(var(--primary))" strokeOpacity={0.4} strokeWidth={1}
                    />
                    <line
                      x1={cx} y1={cy}
                      x2={cx} y2={cy + (cy === 0 ? 15 : -15)}
                      stroke="hsl(var(--primary))" strokeOpacity={0.4} strokeWidth={1}
                    />
                  </g>
                ))}
              </svg>

              {/* Side panel - stats */}
              <div className="space-y-4 w-full md:w-48 shrink-0">
                {[
                  { label: "CONTACTS", value: "4 ACTIVE" },
                  { label: "RANGE", value: "12.4 NM" },
                  { label: "SPEED", value: "8.2 KTS" },
                  { label: "BEARING", value: "047° NNE" },
                  { label: "WATER TEMP", value: "4.2°C" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="border-l-2 border-primary/20 pl-3"
                  >
                    <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50">{stat.label}</p>
                    <p className="font-mono text-xs text-primary/80 tracking-wider">{stat.value}</p>
                  </motion.div>
                ))}

                {/* Legend */}
                <div className="pt-3 border-t border-border/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-mono text-[9px] text-muted-foreground/60">FRIENDLY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="font-mono text-[9px] text-muted-foreground/60">UNIDENTIFIED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-px bg-accent" />
                    <span className="font-mono text-[9px] text-muted-foreground/60">ROUTE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TacticalMap;
