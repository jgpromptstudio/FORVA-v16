export interface DashboardStat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const dashboardStats: DashboardStat[] = [
  { label: 'Businesses Discovered', value: '1,248', change: '+12%', trend: 'up' },
  { label: 'Verified Businesses', value: '892', change: '+8%', trend: 'up' },
  { label: 'Qualified Businesses', value: '341', change: '+15%', trend: 'up' },
  { label: 'Outreach Sent', value: '2,104', change: '+22%', trend: 'up' },
  { label: 'Replies Received', value: '318', change: '+5%', trend: 'up' },
  { label: 'Follow-Ups Scheduled', value: '467', change: '+9%', trend: 'up' },
  { label: 'Human Reviews', value: '23', change: '+3%', trend: 'up' },
  { label: 'Monthly Usage', value: '68%', change: '32% left', trend: 'neutral' },
];

export interface PipelineData {
  stage: string;
  count: number;
  percentage: number;
}

export const pipelineData: PipelineData[] = [
  { stage: 'Discovered', count: 1248, percentage: 100 },
  { stage: 'Verified', count: 892, percentage: 71 },
  { stage: 'Qualified', count: 341, percentage: 27 },
  { stage: 'Contacted', count: 2104, percentage: 100 },
  { stage: 'Replied', count: 318, percentage: 15 },
  { stage: 'Follow-Up', count: 467, percentage: 22 },
  { stage: 'Human Review', count: 23, percentage: 2 },
];

export interface ProspectRow {
  business: string;
  domain: string;
  location: string;
  verification: 'Verified' | 'Unverified' | 'Pending';
  score: number;
  contact: string;
  outreachState: 'New' | 'Contacted' | 'Replied' | 'Follow-Up' | 'Review';
}

export const recentProspects: ProspectRow[] = [
  { business: 'Northstar Marketing', domain: 'northstarmarketing.com', location: 'Austin, TX', verification: 'Verified', score: 87, contact: 'j.doe@northstarmarketing.com', outreachState: 'Replied' },
  { business: 'BrightWave Dental', domain: 'brightwavedental.com', location: 'Denver, CO', verification: 'Verified', score: 92, contact: 'front@brightwavedental.com', outreachState: 'Contacted' },
  { business: 'Vertex IT Solutions', domain: 'vertexitsolutions.com', location: 'Seattle, WA', verification: 'Pending', score: 78, contact: 'info@vertexitsolutions.com', outreachState: 'Follow-Up' },
  { business: 'Oakline Consulting', domain: 'oaklineconsulting.com', location: 'Chicago, IL', verification: 'Verified', score: 95, contact: 'hello@oaklineconsulting.com', outreachState: 'Review' },
  { business: 'Momentum Fitness', domain: 'momentumfitness.com', location: 'Miami, FL', verification: 'Unverified', score: 64, contact: 'N/A', outreachState: 'New' },
];

export interface ConversationItem {
  business: string;
  channel: string;
  status: 'Active' | 'Awaiting Reply' | 'Needs Review';
  lastUpdate: string;
}

export const conversations: ConversationItem[] = [
  { business: 'BrightWave Dental', channel: 'Email', status: 'Awaiting Reply', lastUpdate: '2h ago' },
  { business: 'Vertex IT Solutions', channel: 'Email', status: 'Needs Review', lastUpdate: '5h ago' },
  { business: 'Oakline Consulting', channel: 'Email', status: 'Active', lastUpdate: '1h ago' },
  { business: 'Northstar Marketing', channel: 'Email', status: 'Awaiting Reply', lastUpdate: '1d ago' },
];

export interface ReviewItem {
  business: string;
  type: 'Pricing Question' | 'Meeting Request' | 'Non-Email Contact' | 'Unmatched Inbound Reply' | 'AI Draft Review';
  state: 'Pending Review' | 'Needs Action' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
}

export const reviewQueue: ReviewItem[] = [
  { business: 'Vertex IT Solutions', type: 'Pricing Question', state: 'Pending Review', priority: 'High' },
  { business: 'Oakline Consulting', type: 'Meeting Request', state: 'Needs Action', priority: 'Medium' },
  { business: 'Northstar Marketing', type: 'AI Draft Review', state: 'Resolved', priority: 'Low' },
];

export interface NotificationItem {
  title: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

export const notifications: NotificationItem[] = [
  { title: 'New prospect reply received', time: '5m ago', type: 'info' },
  { title: 'Pricing question requires review', time: '1h ago', type: 'warning' },
  { title: 'Follow-up stopped after reply', time: '2h ago', type: 'success' },
  { title: 'Usage approaching plan limit', time: '3h ago', type: 'warning' },
];

export const systemActivity = {
  processedThisRun: 3,
  businessesPersisted: 3,
  followUpsScheduled: 2,
  needsReview: 1,
};
