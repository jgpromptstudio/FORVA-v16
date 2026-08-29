import { useNavigate } from 'react-router-dom';
import { ForvaLogo } from '@/components/ForvaLogo';
import { footerConfig, type FooterLink } from '@/config/footerConfig';

function FooterLinkItem({ item }: { item: FooterLink }) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.type === 'anchor') {
      const hashIndex = item.href.indexOf('#');
      if (hashIndex !== -1) {
        const hash = item.href.substring(hashIndex);
        if (window.location.pathname === '/') {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    } else {
      navigate(item.href);
    }
  };

  return (
    <li>
      <a
        href={item.href}
        onClick={handleClick}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {item.label}
      </a>
    </li>
  );
}

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-secondary/40 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Logo column */}
          <div className="col-span-2 lg:col-span-1">
            <button
              onClick={() => navigate('/')}
              className="flex items-center"
              aria-label="FORVA home"
            >
              <ForvaLogo size={32} />
            </button>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {footerConfig.tagline}
            </p>
          </div>

          {/* Platform column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Platform</h3>
            <ul className="space-y-3">
              {footerConfig.platform.map((item) => (
                <FooterLinkItem key={item.label} item={item} />
              ))}
            </ul>
          </div>

          {/* Product column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Product</h3>
            <ul className="space-y-3">
              {footerConfig.product.map((item) => (
                <FooterLinkItem key={item.label} item={item} />
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Company</h3>
            <ul className="space-y-3">
              {footerConfig.company.map((item) => (
                <FooterLinkItem key={item.label} item={item} />
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Legal</h3>
            <ul className="space-y-3">
              {footerConfig.legal.map((item) => (
                <FooterLinkItem key={item.label} item={item} />
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-sm text-muted-foreground">{footerConfig.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
