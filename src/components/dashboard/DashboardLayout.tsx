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
  { to: '/dashboard/billing', label: 'Credits & Billing', icon: CreditCard },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Overview', subtitle: 'Your FORVA acquisition pipeline at a glance' },
  '/dashboard/find-clients': { title: 'Find Clients', subtitle: 'Configure and launch acquisition runs' },
  '/dashboard/prospects': { title: 'Prospects', subtitle: 'All discovered businesses' },
  '/dashboard/reviews': { title: 'Review Queue', subtitle: 'Review outreach that needs your approval or manual action before it can continue.' },
  '/dashboard/outreach': { title: 'Outreach', subtitle: 'Outbound email activity' },
  '/dashboard/conversations': { title: 'Conversations', subtitle: 'Prospect message threads' },
  '/dashboard/followups': { title: 'Follow-ups', subtitle: 'Scheduled and queued follow-ups' },
  '/dashboard/billing': { title: 'Credits & Billing', subtitle: 'Plan and credit usage' },
  '/dashboard/settings': { title: 'Settings', subtitle: 'Account settings' },
  '/dashboard/support': { title: 'Support', subtitle: 'Get help with FORVA' },
};

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'
            )
          }
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

  const totalAvailable = credit
    ? (credit.monthly_remaining ?? 0) + (credit.topup_remaining ?? 0)
    : null;

  return (
    <div className="mx-3 mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground">Credits</span>
      </div>
      {wsLoading || creditLoading ? (
        <div className="mt-1.5 flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground/70">Loading...</span>
        </div>
      ) : credit && totalAvailable !== null ? (
        <div className="mt-1.5">
          <p className="text-sm font-bold text-foreground">{totalAvailable.toLocaleString()} available</p>
          {credit.plan && (
            <p className="text-xs text-muted-foreground/70 capitalize">{credit.plan}</p>
          )}
        </div>
      ) : reason === 'credit_account_not_provisioned' ? (
        <div className="mt-1.5">
          <p className="text-xs font-medium text-muted-foreground">No active plan yet</p>
          <p className="text-[11px] text-muted-foreground/60">Credits become available after plan activation.</p>
        </div>
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
    checkIsAdmin(user).then((allowed) => {
      if (active) setIsAdmin(allowed);
    });
    return () => { active = false; };
  }, [user]);

  const routeInfo = routeTitles[location.pathname] ?? { title: 'Dashboard', subtitle: '' };

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/10 bg-secondary/30 backdrop-blur-xl md:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <ForvaLogo size={28} showWordmark={true} wordmarkClassName="text-base" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        {isAdmin && (
          <div className="mx-3 mb-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
              onClick={() => navigate('/admin')}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
            </Button>
          </div>
        )}
        <CreditDisplay />
      </aside>

      {/* Main content area */}
      <div className="md:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-r border-white/10 bg-secondary/95 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-16 items-center border-b border-white/10 px-5">
                  <ForvaLogo size={28} showWordmark={true} wordmarkClassName="text-base" />
                </div>
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
                {isAdmin && (
                  <div className="mx-3 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                      onClick={() => { setMobileOpen(false); navigate('/admin'); }}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </div>
                )}
                <CreditDisplay />
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">{routeInfo.title}</h1>
              {routeInfo.subtitle && (
                <p className="hidden text-xs text-muted-foreground sm:block">{routeInfo.subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
                aria-label="Refresh data"
              >
                <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}
            <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground lg:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
