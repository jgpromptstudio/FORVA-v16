export interface IntegrationItem {
  name: string;
}

export interface IntegrationGroup {
  title: string;
  items: IntegrationItem[];
}

export const integrationGroups: IntegrationGroup[] = [
  {
    title: 'Discovery & Intelligence',
    items: [
      { name: 'Google Places API' },
      { name: 'SeekAI' },
      { name: 'Google Gemini API' },
      { name: 'OpenAI API' },
      { name: 'OpenRouter' },
    ],
  },
  {
    title: 'Contact Data',
    items: [
      { name: 'Apollo.io' },
      { name: 'Hunter.io' },
      { name: 'Findymail' },
      { name: 'AnyMail Finder' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { name: 'Resend' },
      { name: 'Telegram' },
    ],
  },
  {
    title: 'Core Platform & Scale',
    items: [
      { name: 'n8n Queue Mode (Self-Hosted)' },
      { name: 'Hetzner VPS' },
      { name: 'Redis / Upstash' },
      { name: 'Supabase Pro' },
      { name: 'Netlify Pro' },
      { name: 'FORVA.net Domain' },
    ],
  },
  {
    title: 'Payments',
    items: [
      { name: 'PayPal' },
      { name: 'PayMongo' },
    ],
  },
  {
    title: 'Edge & Observability',
    items: [
      { name: 'Nginx / Traefik' },
      { name: 'Cloudflare' },
      { name: 'Sentry' },
      { name: 'Better Stack / UptimeRobot' },
    ],
  },
];

export const byoApiConfig = {
  heading: 'Already paying for your own APIs?',
  copy: 'Connect supported provider accounts to expand your available capacity while FORVA continues coordinating discovery, research, qualification, outreach, and workflow state.',
  examples: 'Apollo.io, Hunter.io, OpenAI API, Resend, and other explicitly supported FORVA providers.',
  clarification:
    'Provider availability and account requirements may vary. Private credentials must be handled only by secure backend services and must never be exposed in frontend code or browser storage.',
};
