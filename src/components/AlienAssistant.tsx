import { cn } from '@/lib/utils';

interface AlienAssistantProps {
  variant?: 'teal' | 'gold' | 'emerald' | 'silver';
  size?: number;
  className?: string;
  floating?: boolean;
}

const variantColors: Record<string, { body: string; glow: string; accent: string }> = {
  teal: { body: 'hsl(174 72% 38%)', glow: 'hsl(174 72% 38% / 0.4)', accent: 'hsl(160 58% 48%)' },
  gold: { body: 'hsl(39 88% 62%)', glow: 'hsl(39 88% 62% / 0.4)', accent: 'hsl(39 80% 50%)' },
  emerald: { body: 'hsl(160 58% 48%)', glow: 'hsl(160 58% 48% / 0.4)', accent: 'hsl(174 72% 38%)' },
  silver: { body: 'hsl(190 15% 76%)', glow: 'hsl(190 15% 76% / 0.3)', accent: 'hsl(174 72% 38%)' },
};

export function AlienAssistant({
  variant = 'teal',
  size = 48,
  className,
  floating = true,
}: AlienAssistantProps) {
  const colors = variantColors[variant];

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', floating && 'animate-float-gentle', className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <radialGradient id={`alien-body-${variant}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={colors.body} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.body} stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id={`alien-glow-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow halo */}
        <circle cx="50" cy="50" r="48" fill={`url(#alien-glow-${variant})`} />

        {/* Antenna */}
        <line x1="50" y1="15" x2="50" y2="8" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="6" r="3" fill={colors.accent} className="animate-pulse-soft" />

        {/* Head/body - rounded teardrop */}
        <ellipse cx="50" cy="52" rx="28" ry="32" fill={`url(#alien-body-${variant})`} />

        {/* Belly highlight */}
        <ellipse cx="50" cy="58" rx="18" ry="20" fill={colors.body} fillOpacity="0.3" />

        {/* Eyes - large, friendly */}
        <ellipse cx="40" cy="46" rx="7" ry="9" fill="white" fillOpacity="0.95" />
        <ellipse cx="60" cy="46" rx="7" ry="9" fill="white" fillOpacity="0.95" />
        <circle cx="41" cy="47" r="3.5" fill="hsl(202 56% 7%)" />
        <circle cx="61" cy="47" r="3.5" fill="hsl(202 56% 7%)" />
        <circle cx="42" cy="45" r="1.2" fill="white" />
        <circle cx="62" cy="45" r="1.2" fill="white" />

        {/* Smile - gentle curve */}
        <path d="M42 58 Q50 64 58 58" stroke="hsl(202 56% 7%)" strokeWidth="2" strokeLinecap="round" fill="none" fillOpacity="0.6" />

        {/* Small arms */}
        <ellipse cx="22" cy="55" rx="5" ry="8" fill={colors.body} fillOpacity="0.7" transform="rotate(-20 22 55)" />
        <ellipse cx="78" cy="55" rx="5" ry="8" fill={colors.body} fillOpacity="0.7" transform="rotate(20 78 55)" />
      </svg>
    </div>
  );
}
