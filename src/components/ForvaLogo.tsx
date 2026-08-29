import { cn } from '@/lib/utils';

const LOGO_URL =
  'https://bvfkgxkubflgejuzorie.supabase.co/storage/v1/object/public/public-assets/forva-logo.png';

interface ForvaLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

export function ForvaLogo({
  size = 36,
  showWordmark = true,
  className,
  wordmarkClassName,
}: ForvaLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img
        src={LOGO_URL}
        alt="FORVA logo"
        width={size}
        height={size}
        className="shrink-0"
        style={{ height: size, width: 'auto' }}
      />
      {showWordmark && (
        <span
          className={cn(
            'font-display font-bold tracking-tight text-white',
            wordmarkClassName
          )}
        >
          FORVA
        </span>
      )}
    </span>
  );
}

export { LOGO_URL };
