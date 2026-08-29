import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ForvaLogo } from '@/components/ForvaLogo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { navConfig } from '@/config/navConfig';
import { cn } from '@/lib/utils';

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 transition-all duration-500',
        scrolled ? 'glass-strong rounded-2xl shadow-2xl shadow-black/30' : 'glass rounded-2xl'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center"
          aria-label="FORVA home"
        >
          <ForvaLogo size={32} />
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 lg:flex">
          {navConfig.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.href);
              }}
              className="nav-underline text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate('/signup')}>
            Start Finding Clients
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="glass"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="glass-strong border-l border-white/10 w-80">
            <SheetHeader>
              <SheetTitle>
                <ForvaLogo size={32} />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-2">
              {navConfig.map((item) => (
                <SheetClose asChild key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <SheetClose asChild>
                  <Button variant="outline" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button onClick={() => navigate('/signup')}>Start Finding Clients</Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
