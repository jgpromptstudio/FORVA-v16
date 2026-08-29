import { Target, ShieldCheck, Brain, Send, MessageSquare, CalendarClock, CalendarCheck } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export const navConfig: NavItem[] = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const workforceConfig = [
  {
    title: 'Client Discovery',
    icon: Target,
    description: 'Searches real businesses and markets for the profile you want.',
    angle: 0,
  },
  {
    title: 'Contact Verification',
    icon: ShieldCheck,
    description: 'Validates emails before outreach to reduce wasted sends.',
    angle: 51,
  },
  {
    title: 'AI Qualification',
    icon: Brain,
    description: 'Scores opportunities using fit, intent, and evidence.',
    angle: 102,
  },
  {
    title: 'Personalized Outreach',
    icon: Send,
    description: 'Prepares relevant first-touch messages with prospect context.',
    angle: 154,
  },
  {
    title: 'Reply Intelligence',
    icon: MessageSquare,
    description: 'Connects inbound replies to the correct conversation and next action.',
    angle: 206,
  },
  {
    title: 'Follow-Up Scheduling',
    icon: CalendarClock,
    description: 'Schedules controlled follow-ups and stops them on reply or opt-out.',
    angle: 257,
  },
  {
    title: 'Appointment Booking',
    icon: CalendarCheck,
    description: 'Moves qualified prospects toward a real conversation.',
    angle: 308,
  },
];
