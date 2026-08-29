import { cn } from '@/lib/utils';

interface MoneyBundleProps {
  size?: number;
  className?: string;
}

export function MoneyBundle({ size = 32, className }: MoneyBundleProps) {
  return (
    <div className={cn('inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id="money-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(39 88% 62%)" />
            <stop offset="100%" stopColor="hsl(39 80% 48%)" />
          </linearGradient>
        </defs>
        {/* Stack of bills */}
        <rect x="10" y="28" width="44" height="22" rx="2" fill="hsl(39 60% 40%)" fillOpacity="0.4" />
        <rect x="10" y="24" width="44" height="22" rx="2" fill="hsl(39 70% 45%)" fillOpacity="0.5" />
        <rect x="10" y="20" width="44" height="22" rx="2" fill="url(#money-grad)" />
        {/* Dollar sign */}
        <text x="32" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(39 30% 20%)" fontFamily="sans-serif">$</text>
        {/* Band */}
        <rect x="10" y="26" width="44" height="4" fill="hsl(39 30% 20%)" fillOpacity="0.3" />
        {/* Sparkle */}
        <circle cx="50" cy="14" r="2" fill="hsl(39 88% 70%)" className="animate-pulse-soft" />
        <circle cx="14" cy="12" r="1.5" fill="hsl(39 88% 70%)" className="animate-pulse-soft" />
      </svg>
    </div>
  );
}
