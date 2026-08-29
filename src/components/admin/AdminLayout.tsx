import { type ReactNode, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ForvaLogo } from '@/components/ForvaLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  Rocket,
  Briefcase,
  Send,
  MessageSquare,
  CalendarClock,
  UserCog,
  CreditCard,
  ScrollText,
  LogOut,
  RefreshCw,
  Menu,
  ArrowLeft,
  Shield,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/workspaces', label: 'Workspaces', icon: Building2 },
  { to: '/admin/runs', label: 'Acquisition Runs', icon: Rocket },
  { to: '/admin/prospects', label: 'Prospects', icon: Briefcase },
  { to: '/admin/reviews', label: 'Review Queue', icon: UserCog },
  { to: '/admin/outreach', label: 'Outreach', icon: Send },
  { to: '/admin/conversations', label: 'Conversations', icon: MessageSquare },
  { to: '/admin/followups', label: 'Follow-ups', icon: CalendarClock },
  { to: '/admin/billing', label: 'Revenue & Credits', icon: CreditCard },
  { to: '/admin/system', label: 'System & Audit', icon: ScrollText },
];

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin': { title: 'Admin Overview', subtitle: 'FORVA platform-wide metrics' },
  '/admin/analytics': { title: 'Analytics', subtitle: 'Platform growth, funnel and plan-value metrics' },
  '/admin/users': { title: 'Users', subtitle: 'Registered accounts and workspace membership' },
  '/admin/workspaces': { title: 'Workspaces', subtitle: 'All FORVA workspaces' },
  '/admin/runs': { title: 'Acquisition Runs', subtitle: 'Platform-wide acquisition run status' },
  '/admin/prospects': { title: 'Prospects', subtitle: 'All businesses across workspaces' },
  '/admin/reviews': { title: 'Review Queue', subtitle: 'Drafts and handoffs requiring attention' },
  '/admin/outreach': { title: 'Outreach', subtitle: 'All outbound email activity' },
  '/admin/conversations': { title: 'Conversations', subtitle: 'All prospect conversations' },
  '/admin/followups': { title: 'Follow-ups', subtitle: 'All scheduled follow-ups' },
  '/admin/billing': { title: 'Revenue & Credits', subtitle: 'Plan distribution and credit accounts across workspaces' },
  '/admin/system': { title: 'System & Audit', subtitle: 'Recent runs and audit logs' },
};

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/admin'}
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

interface AdminLayoutProps {
  children: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function AdminLayout({ children, onRefresh, refreshing }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const routeInfo = routeTitles[location.pathname] ?? { title: 'Admin', subtitle: '' };

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-secondary/30 backdrop-blur-xl md:flex">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <ForvaLogo size={28} showWordmark={true} wordmarkClassName="text-base" />
          <Badge variant="gold" className="text-xs">Admin</Badge>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="border-t border-white/10 p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            User Dashboard
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open admin navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-r border-white/10 bg-secondary/95 p-0">
                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
                  <ForvaLogo size={28} showWordmark={true} wordmarkClassName="text-base" />
                  <Badge variant="gold" className="text-xs">Admin</Badge>
                </div>
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
                <div className="border-t border-white/10 p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    User Dashboard
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-semibold text-foreground">{routeInfo.title}</h1>
                <Badge variant="gold" className="hidden text-xs md:inline-flex">Admin</Badge>
              </div>
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
                aria-label="Refresh admin data"
              >
                <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
              <Shield className="h-3.5 w-3.5 text-gold" />
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
