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
      { name: 'Google Business Discovery' },
      { name: 'SeekAI' },
      { name: 'Gemini' },
      { name: 'OpenAI' },
      { name: 'OpenRouter' },
    ],
  },
  {
    title: 'Contact Data',
    items: [
      { name: 'Apollo' },
      { name: 'Hunter' },
      { name: 'Findymail' },
      { name: 'Anymail Finder' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { name: 'Resend' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { name: 'Supabase' },
      { name: 'n8n' },
      { name: 'Netlify' },
    ],
  },
  {
    title: 'Payments',
    items: [{ name: 'PayPal' }, { name: 'PayMongo' }],
  },
];

export const byoApiConfig = {
  heading: 'Already paying for your own APIs?',
  copy: 'Connect supported provider accounts to expand your available capacity while FORVA continues coordinating discovery, research, qualification, outreach, and workflow state.',
  examples: 'Apollo, Hunter, OpenAI, Resend, and other explicitly supported FORVA providers.',
  clarification:
    'Provider availability and account requirements may vary. Private credentials must be handled only by secure backend services and must never be exposed in frontend code or browser storage.',
};
