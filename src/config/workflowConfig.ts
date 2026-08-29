import { Target, Search, Brain, ShieldCheck, Send, BarChart3 } from 'lucide-react';

export interface WorkflowStep {
  step: number;
  title: string;
  icon: typeof Search;
  description: string;
}

export const workflowConfig: WorkflowStep[] = [
  {
    step: 1,
    title: 'Define Your Target',
    icon: Target,
    description: 'Tell FORVA what type of clients you want: service, niche, market, city, and ideal profile.',
  },
  {
    step: 2,
    title: 'Discover and Research',
    icon: Search,
    description: 'FORVA finds matching prospects and researches decision-makers, owners, and business details.',
  },
  {
    step: 3,
    title: 'Qualify and Enrich',
    icon: Brain,
    description: 'Prospects are scored on fit, intent, and evidence. Business and contact data are enriched.',
  },
  {
    step: 4,
    title: 'Verify and Prepare',
    icon: ShieldCheck,
    description: 'Emails are verified before outreach. Personalized first-touch messages are prepared.',
  },
  {
    step: 5,
    title: 'Send and Track',
    icon: Send,
    description: 'Approved outreach is sent. Follow-ups are scheduled. Replies and activity are tracked.',
  },
];

export const workflowSupportingCopy =
  'From target market to first conversation, FORVA coordinates every step so you spend less time on manual work.';
