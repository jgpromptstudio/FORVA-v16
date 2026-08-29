import {
  Search,
  Brain,
  FileSearch,
  UserCheck,
  ShieldCheck,
  Send,
  CalendarClock,
  Copy,
  Ban,
  BarChart3,
} from 'lucide-react';

export interface FeatureItem {
  icon: typeof Search;
  title: string;
  description: string;
  size: 'large' | 'medium' | 'small';
}

export const featuresConfig: FeatureItem[] = [
  {
    icon: Search,
    title: 'AI Prospect Discovery',
    description:
      'Search real businesses by service, niche, city, country, and target market. FORVA finds prospects that match your ideal client profile.',
    size: 'large',
  },
  {
    icon: Brain,
    title: 'Smart Qualification',
    description:
      'Score opportunities on business verification, service fit, contact quality, evidence strength, and commercial fit.',
    size: 'medium',
  },
  {
    icon: FileSearch,
    title: 'Deep Business Research',
    description:
      'Research company websites and supported data providers for relevant decision-makers and business context.',
    size: 'medium',
  },
  {
    icon: UserCheck,
    title: 'Contact Enrichment',
    description:
      'Find and enrich business contacts from supported providers so you have the right person to reach.',
    size: 'small',
  },
  {
    icon: ShieldCheck,
    title: 'Email Verification',
    description:
      'Validate candidate emails before any outreach goes out to reduce bounces and wasted sends.',
    size: 'small',
  },
  {
    icon: Send,
    title: 'Personalized Outreach',
    description:
      'Prepare first-touch messages built from verified business and qualification context.',
    size: 'small',
  },
  {
    icon: CalendarClock,
    title: 'Automated Follow Ups',
    description:
      'Schedule controlled follow-ups that stop automatically on reply or opt-out.',
    size: 'small',
  },
  {
    icon: Copy,
    title: 'Duplicate Protection',
    description:
      'Prevent the same business from being contacted twice across searches and campaigns.',
    size: 'small',
  },
  {
    icon: Ban,
    title: 'Suppression and Safeguards',
    description:
      'Control who gets contacted and when. Suppression lists and outreach safeguards protect your reputation.',
    size: 'medium',
  },
  {
    icon: BarChart3,
    title: 'Campaign Tracking',
    description:
      'Track discovered, verified, qualified, contacted, replied, and follow-up activity across every campaign.',
    size: 'medium',
  },
];
