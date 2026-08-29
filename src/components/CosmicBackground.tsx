import { useMemo } from 'react';

export function CosmicBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  const shootingStars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: Math.random() * 50,
      left: Math.random() * 80 + 20,
      delay: Math.random() * 12 + i * 4,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-cosmic">
      {/* Nebula clouds */}
      <div
        className="absolute -top-1/4 left-1/4 h-[600px] w-[600px] rounded-full opacity-20 blur-[120px] animate-drift-slow"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full opacity-15 blur-[100px] animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.3), transparent 70%)',
          animationDelay: '5s',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-10 blur-[80px] animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, hsl(var(--gold) / 0.3), transparent 70%)',
          animationDelay: '10s',
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `pulse-soft ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute h-[2px] w-[80px] rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), white)',
            animation: `shooting-star 8s ease-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Orbital lines */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" preserveAspectRatio="none">
        <defs>
          <pattern id="orbit-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#orbit-pattern)" />
      </svg>
    </div>
  );
}
