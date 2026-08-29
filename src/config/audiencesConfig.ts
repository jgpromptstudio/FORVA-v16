import { User, Users, Building2, TrendingUp, Briefcase, Zap } from 'lucide-react';

export interface AudienceCard {
  icon: typeof User;
  title: string;
  description: string;
}

export const audiencesConfig: AudienceCard[] = [
  {
    icon: Building2,
    title: 'Agencies',
    description:
      'Run structured client-acquisition workflows with conversation intelligence and human review controls.',
  },
  {
    icon: Briefcase,
    title: 'Consultants',
    description:
      'Build a consistent client-acquisition process without spending every day searching and verifying contacts.',
  },
  {
    icon: Zap,
    title: 'Automation Professionals',
    description:
      'Connect discovery, qualification, outreach, and follow-up into one coordinated pipeline.',
  },
  {
    icon: TrendingUp,
    title: 'B2B Service Businesses',
    description:
      'Discover and qualify potential clients with research, verification, and personalized outreach.',
  },
  {
    icon: User,
    title: 'Freelancers',
    description:
      'Find and engage qualified clients with personalized outreach and smart follow-ups.',
  },
  {
    icon: Users,
    title: 'Sales Teams',
    description:
      'Coordinate discovery, qualification, outreach, and follow-up across multiple team members and pipelines.',
  },
];

export const audiencesSupportingCopy =
  'FORVA is designed for professionals and teams that need a more structured way to discover, qualify, contact, and follow up with potential clients.';
