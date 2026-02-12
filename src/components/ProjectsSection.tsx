import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Radar, Map, LayoutDashboard } from "lucide-react";

const projects = [
  {
    title: "Submarine Combat System",
    desc: "Real-time submarine combat system with interactive sonar visualization, radar, WebSocket-driven position updates, and immersive underwater map interface.",
    tech: ["React", "WebSockets", "Canvas API", "Turf.js", "Three.js"],
    icon: Radar,
    featured: true,
  },
  {
    title: "Navigation Chart",
    desc: "Architected a real-time geospatial application featuring live unit tracking, dynamic data visualization, and seamless interactive user controls.",
    tech: ["React", "TypeScript", "D3.js", "REST APIs", "OpenLayers"],
    icon: Map,
  },
  {
    title: "Digital Revenue Collection System",
    desc: "Developed a comprehensive digital platform to streamline revenue collection processes, enhancing efficiency and transparency.",
    tech: ["React", "WebSockets", "Redux", "Tailwind"],
    icon: LayoutDashboard,
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="container mx-auto max-w-5xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary/60 mb-3">// MISSION ARCHIVE</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Completed <span className="text-gradient-primary">Operations</span>
          </h2>
        </motion.div>

        <div className="grid gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className={`group glass-panel p-6 md:p-8 hud-corner transition-all duration-500 hover:border-primary/30 hover:bg-card/60 ${project.featured ? "md:col-span-2 border-primary/20" : ""
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <project.icon size={22} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                    {project.featured && (
                      <span className="font-mono text-[10px] tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                        FLAGSHIP
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] tracking-wider text-primary/70 border border-primary/20 px-2.5 py-1 rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {/* <div className="flex gap-4">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <Github size={16} />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink size={16} />
                    </a>
                  </div> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
