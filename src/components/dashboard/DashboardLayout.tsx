import { type ReactNode, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ForvaLogo } from '@/components/ForvaLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth';
import { checkIsAdmin } from '@/lib/admin';
import { useWorkspace, useCreditAccount } from '@/lib/dashboard/useWorkspace';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Target,
  Users,
  Send,
  MessageSquare,
  CalendarClock,
  UserCog,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
  RefreshCw,
  Menu,
  Gauge,
  Loader2,
  ShieldCheck,
  BriefcaseBusiness,
  Bell,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/find-clients', label: 'Find Clients', icon: Target },
  { to: '/dashboard/prospects', label: 'Prospects', icon: Users },
  { to: '/dashboard/reviews', label: 'Review Queue', icon: UserCog },
  { to: '/dashboard/outreach', label: 'Outreach', icon: Send },
  { to: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
  { to: '/dashboard/followups', label: 'Follow-ups', icon: CalendarClock },
  { to: '/dashboard/deals', label: 'Deals', icon: BriefcaseBusiness },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/billing', label: 'Credits & Billing', icon: CreditCard },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Overview', subtitle: 'Your FORVA acquisition pipeline at a glance' },
  '/dashboard/find-clients': { title: 'Find Clients', subtitle: 'Choose your target and launch a client search' },
  '/dashboard/prospects': { title: 'Prospects', subtitle: 'Businesses FORVA discovered and evaluated' },
  '/dashboard/reviews': { title: 'Review Queue', subtitle: 'Review messages that need your decision before they continue' },
  '/dashboard/outreach': { title: 'Outreach', subtitle: 'Your real outbound message history' },
  '/dashboard/conversations': { title: 'Conversations', subtitle: 'Read prospect replies and your FORVA responses' },
  '/dashboard/followups': { title: 'Follow-ups', subtitle: 'See what is scheduled, sent, stopped, or awaiting review' },
  '/dashboard/deals': { title: 'Deals', subtitle: 'Track real opportunities through Won or Lost' },
  '/dashboard/notifications': { title: 'Notifications', subtitle: 'Important FORVA activity that may need your attention' },
  '/dashboard/billing': { title: 'Credits & Billing', subtitle: 'Plan, credit balance, top-ups, and subscription status' },
  '/dashboard/settings': { title: 'Settings', subtitle: 'Sender identity, writing style, and Auto-Pilot rules' },
  '/dashboard/support': { title: 'Support', subtitle: 'Get help without sharing sensitive information' },
};

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="FORVA dashboard" className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          onClick={onNavigate}
          className={({ isActive }) => cn(
            'flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
            isActive
              ? 'border-primary/30 bg-primary/15 text-primary'
              : 'border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function CreditDisplay() {
  const { workspaceId, loading: wsLoading } = useWorkspace();
  const { data: credit, loading: creditLoading, error: creditError, reason } = useCreditAccount(workspaceId);
  const totalAvailable = credit ? (credit.monthly_remaining ?? 0) + (credit.topup_remaining ?? 0) : null;

  return (
    <div className="mx-3 mb-[calc(1rem+env(safe-area-inset-bottom))] rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-semibold text-muted-foreground">Credits</span></div>
      {wsLoading || creditLoading ? (
        <div className="mt-1.5 flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin text-muted-foreground" /><span className="text-xs text-muted-foreground/70">Loading...</span></div>
      ) : credit && totalAvailable !== null ? (
        <div className="mt-1.5"><p className="text-sm font-bold text-foreground">{totalAvailable.toLocaleString()} available</p>{credit.plan && <p className="text-xs capitalize text-muted-foreground/70">{credit.plan}</p>}</div>
      ) : reason === 'credit_account_not_provisioned' ? (
        <div className="mt-1.5"><p className="text-xs font-medium text-muted-foreground">No active plan yet</p><p className="text-[11px] text-muted-foreground/60">Credits become available after plan activation.</p></div>
      ) : creditError ? (
        <p className="mt-1.5 text-xs text-muted-foreground/70">Credit status unavailable</p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground/70">Credit status unavailable</p>
      )}
    </div>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function DashboardLayout({ children, onRefresh, refreshing }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    checkIsAdmin(user).then((allowed) => { if (active) setIsAdmin(allowed); });
    return () => { active = false; };
  }, [user]);

  const routeInfo = routeTitles[location.pathname] ?? { title: 'Dashboard', subtitle: '' };

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="relative min-h-[100dvh] min-w-0 overflow-x-hidden bg-background text-foreground">
      <a href="#forva-main" className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-transform focus:translate-y-0">Skip to content</a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/10 bg-secondary/30 backdrop-blur-xl md:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5"><ForvaLogo size={28} showWordmark={true} wordmarkClassName="text-base" /></div>
        <div className="min-h-0 flex-1 overflow-y-auto"><SidebarNav /></div>
        {isAdmin && <div className="mx-3 mb-3"><Button variant="outline" size="sm" className="w-full justify-start border-gold/30 text-gold hover:bg-gold/10 hover:text-gold" onClick={() => navigate('/admin')}><ShieldCheck className="h-4 w-4" />Admin Dashboard</Button></div>}
        <CreditDisplay />
      </aside>

      <div className="min-w-0 md:pl-60">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-white/10 bg-background/90 px-3 py-2 backdrop-blur-xl sm:px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="shrink-0 md:hidden" aria-label="Open navigation menu"><Menu className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="flex w-[88vw] max-w-72 flex-col border-r border-white/10 bg-secondary/95 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5"><ForvaLogo size={28} showWordmark={true} wordmarkClassName="text-base" /></div>
                <div className="min-h-0 flex-1 overflow-y-auto"><SidebarNav onNavigate={() => setMobileOpen(false)} /></div>
                {isAdmin && <div className="mx-3 mb-3"><Button variant="outline" size="sm" className="w-full justify-start border-gold/30 text-gold hover:bg-gold/10 hover:text-gold" onClick={() => { setMobileOpen(false); navigate('/admin'); }}><ShieldCheck className="h-4 w-4" />Admin Dashboard</Button></div>}
                <CreditDisplay />
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-semibold text-foreground sm:text-lg">{routeInfo.title}</h1>
              {routeInfo.subtitle && <p className="hidden truncate text-xs text-muted-foreground sm:block">{routeInfo.subtitle}</p>}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {onRefresh && <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing} aria-label="Refresh data"><RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} /><span className="hidden lg:inline">Refresh</span></Button>}
            <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground xl:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut} aria-label="Sign out"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign Out</span></Button>
          </div>
        </header>

        <main id="forva-main" tabIndex={-1} className="min-w-0 px-3 py-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] outline-none sm:px-4 sm:py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
