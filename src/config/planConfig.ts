export interface Plan {
  name: string;
  price: string;
  period: string;
  credits: string;
  prospects: string;
  label?: string;
  audience: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export const plansConfig: Plan[] = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    credits: '500 FORVA Credits',
    prospects: 'Approximately 50 fully processed prospects',
    audience: 'For one focused professional beginning consistent outreach.',
    features: [
      'Core client acquisition workflow',
      'Business discovery and research',
      'AI qualification and enrichment',
      'Contact and email verification',
      'Personalized outreach',
      'Automated follow-ups',
      'Duplicate and suppression safeguards',
      'Campaign tracking',
      'Usage dashboard',
    ],
    cta: 'Start with Starter',
  },
  {
    name: 'Growth',
    price: '$69',
    period: '/month',
    credits: '1,250 FORVA Credits',
    prospects: 'Approximately 125 fully processed prospects',
    label: 'Recommended',
    audience: 'For professionals ready to run a larger and more consistent pipeline.',
    features: [
      'Everything in Starter',
      'Higher monthly credit allowance',
      'Expanded prospect processing',
      'Conversation intelligence',
      'Human-review workflow',
      'Multiple supported API connections',
    ],
    cta: 'Choose Growth',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    credits: '1,800 FORVA Credits',
    prospects: 'Approximately 180 fully processed prospects',
    audience: 'For teams and high-volume professionals managing multiple opportunities.',
    features: [
      'Everything in Growth',
      'Highest monthly credit allowance',
      'Team-oriented visibility',
      'Advanced pipeline visibility',
      'Management summaries',
      'Incident and escalation visibility',
      'Higher workflow capacity',
      'Extended BYO API capacity',
    ],
    cta: 'Go Pro',
  },
];

export const planNotes = [
  'Every plan includes a monthly FORVA Credit allowance. Credits are spent based on the work performed: discovery, research, qualification, enrichment, verification, outreach, and follow-ups.',
  'Need more capacity? Upgrade your plan, purchase FORVA Credit top-ups, or connect supported provider accounts you already own.',
  'No surprise overages. FORVA warns you before your credits run low and will never charge additional usage without your approval.',
];

export const creditUsageExamples = [
  { action: 'Process and qualify prospect', credits: 4 },
  { action: 'Deep enrichment', credits: 3 },
  { action: 'Verified email found', credits: 1 },
  { action: 'Other acquisition actions', credits: 2 },
];

export const creditAverageNote = 'A typical fully processed prospect uses approximately 10 FORVA Credits.';
