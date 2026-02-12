const SonarBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/10 animate-sonar-pulse"
            style={{ animationDelay: `${i * 1}s` }}
          />
        ))}
      </div>

      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20 animate-depth-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}

      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`bubble-col-${i}`}
          className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary/10 animate-bubble-rise"
          style={{
            left: `${15 + i * 14}%`,
            animationDelay: `${i * 1.8}s`,
            animationDuration: `${8 + i * 2}s`,
          }}
        />
      ))}

      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 translate-x-1/2 translate-y-1/2">
        {[0, 1].map((i) => (
          <div
            key={`sonar2-${i}`}
            className="absolute inset-0 rounded-full border border-accent/[0.06] animate-sonar-pulse"
            style={{ animationDelay: `${i * 1.5 + 0.5}s` }}
          />
        ))}
      </div>
      <div className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, hsl(var(--background)) 70%)`
        }}
      />
    </div>
  );
};

export default SonarBackground;
