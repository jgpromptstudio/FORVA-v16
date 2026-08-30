import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuidanceCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function GuidanceCard({ title, children, className }: GuidanceCardProps) {
  return (
    <div className={cn('rounded-xl border border-primary/15 bg-primary/5 p-4', className)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
          <Info className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <div className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
