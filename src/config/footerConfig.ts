export interface FooterLink {
  label: string;
  href: string;
  type: 'anchor' | 'route';
}

export const footerConfig = {
  platform: [
    { label: 'How It Works', href: '/#how-it-works', type: 'anchor' as const },
    { label: 'Features', href: '/#features', type: 'anchor' as const },
    { label: 'Platform', href: '/#platform', type: 'anchor' as const },
    { label: 'Pricing', href: '/#pricing', type: 'anchor' as const },
    { label: 'FAQ', href: '/#faq', type: 'anchor' as const },
  ],
  product: [
    { label: 'Client Discovery', href: '/#features', type: 'anchor' as const },
    { label: 'Qualification', href: '/#features', type: 'anchor' as const },
    { label: 'Contact Verification', href: '/#features', type: 'anchor' as const },
    { label: 'Outreach', href: '/#features', type: 'anchor' as const },
    { label: 'Follow-Ups', href: '/#features', type: 'anchor' as const },
  ],
  company: [
    { label: 'Contact', href: '/contact', type: 'route' as const },
    { label: 'Security', href: '/security', type: 'route' as const },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy', type: 'route' as const },
    { label: 'Terms of Service', href: '/terms', type: 'route' as const },
    { label: 'Acceptable Use Policy', href: '/acceptable-use', type: 'route' as const },
    { label: 'Billing and Cancellation', href: '/billing', type: 'route' as const },
    { label: 'Cookie Policy', href: '/cookies', type: 'route' as const },
    { label: 'Responsible Outreach', href: '/responsible-outreach', type: 'route' as const },
  ],
  copyright: '\u00A9 2026 FORVA. All rights reserved.',
  tagline: 'AI-powered client acquisition and workflow automation.',
};
