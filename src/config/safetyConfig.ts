export interface SafetyTier {
  tier: number;
  title: string;
  items: string[];
}

export const safetyTiers: SafetyTier[] = [
  {
    tier: 1,
    title: 'Automatic Recovery',
    items: [
      'Controlled retries',
      'AI provider fallback',
      'Duplicate prevention',
      'Safe follow-up stopping',
    ],
  },
  {
    tier: 2,
    title: 'Assisted Human Review',
    items: [
      'AI draft review',
      'Pricing-question handoff',
      'Meeting-request handoff',
      'Contact-data review',
      'Non-email outreach review',
      'Unmatched inbound review',
    ],
  },
  {
    tier: 3,
    title: 'Incident Escalation',
    items: [
      'Workflow failure logging',
      'Admin alerts',
      'Incident ownership',
      'Incident state',
      'Audit history',
      'Resolution summaries',
    ],
  },
];
