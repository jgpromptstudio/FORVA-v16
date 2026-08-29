export interface BusinessRow {
  id: string;
  name: string;
  domain: string;
  website_url: string | null;
  city: string | null;
  country_code: string | null;
  verification_status: string | null;
  public_email: string | null;
  phone: string | null;
  state: string | null;
  updated_at: string | null;
}

export interface OutreachRow {
  id: string;
  business_id: string | null;
  contact_id: string | null;
  channel: string | null;
  subject: string | null;
  status: string | null;
  approval_state: string | null;
  sent_at: string | null;
  provider_message_id: string | null;
  business_name: string;
  contact_name: string | null;
  contact_email: string | null;
  business_public_email: string | null;
}

export interface MessageRow {
  id: string;
  conversation_id: string | null;
  direction: string | null;
  status: string | null;
  subject: string | null;
  body: string | null;
  intent: string | null;
  provider: string | null;
  occurred_at: string | null;
}

export interface ConversationRow {
  id: string;
  business_id: string | null;
  channel: string | null;
  status: string | null;
  last_message_at: string | null;
  business_name: string;
}

export interface FollowupRow {
  id: string;
  business_id: string | null;
  scheduled_for: string | null;
  status: string | null;
  stop_reason: string | null;
  business_name: string;
}

export interface ReviewRow {
  id: string;
  business_name: string;
  type: string;
  intent: string | null;
  priority: 'High' | 'Medium' | 'Low';
  subject?: string | null;
  body: string | null;
  occurred_at: string | null;
  source?: 'conversation_draft' | 'manual_outreach';
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  occurred_at: string | null;
  type: 'info' | 'warning' | 'success';
}

export interface DashboardStats {
  businessesDiscovered: number;
  verifiedBusinesses: number;
  qualifiedBusinesses: number;
  outreachSent: number;
  repliesReceived: number;
  followUpsScheduled: number;
  humanReviews: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface CreditAccount {
  plan: string | null;
  monthly_allowance: number | null;
  monthly_remaining: number | null;
  topup_remaining: number | null;
  cycle_start: string | null;
  cycle_end: string | null;
  status?: string | null;
  updated_at?: string | null;
}

export interface AcquisitionRun {
  id: string;
  status: string;
  error_message: string | null;
  created_at: string | null;
  updated_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  requested_prospect_count: number | null;
  target_profile_id: string | null;
}

export function safePct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

export function formatTimeAgo(dateStr: string): string {
  const timestamp = new Date(dateStr).getTime();
  if (!Number.isFinite(timestamp)) return '';
  const diff = Date.now() - timestamp;
  const future = diff < 0;
  const absMinutes = Math.floor(Math.abs(diff) / 60000);
  if (absMinutes < 1) return future ? 'in less than a minute' : 'just now';
  if (absMinutes < 60) return future ? `in ${absMinutes}m` : `${absMinutes}m ago`;
  const hours = Math.floor(absMinutes / 60);
  if (hours < 24) return future ? `in ${hours}h` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return future ? `in ${days}d` : `${days}d ago`;
}

export function mapReviewType(provider: string | null, intent: string | null): string {
  if (provider === 'forva_human_handoff' && intent === 'pricing_question') return 'Pricing Question';
  if (provider === 'forva_human_handoff' && intent === 'wants_meeting') return 'Meeting Request';
  if (provider === 'openai_draft') return 'AI Draft Review';
  return 'Needs Review';
}

export function mapPriority(intent: string | null): 'High' | 'Medium' | 'Low' {
  if (intent === 'pricing_question' || intent === 'wants_meeting') return 'High';
  return 'Medium';
}

export function formatAcquisitionError(error: string | null): string {
  if (!error) return '';
  if (error.includes('FORVA_ACQUISITION_RUN_CONFIG_INCOMPLETE')) {
    return 'This run was created with incomplete target settings. Create a new run with Country, City, Industry and Service Offer.';
  }
  if (error.includes('FORVA_ACQUISITION_RUN_NOT_QUEUED_OR_NOT_FOUND')) {
    return 'This run could not be started because it is no longer queued.';
  }
  if (error.includes('FORVA_ACQUISITION_RUN_MODE_INVALID')) {
    return 'The selected outreach mode is not valid.';
  }
  if (error.includes('FORVA_CREDIT_ACCOUNT_REQUIRED')) {
    return 'Activate a FORVA plan before launching an acquisition run.';
  }
  if (error.includes('FORVA_CREDIT_ACCOUNT_INACTIVE')) {
    return 'Your FORVA plan is not active. Check your billing status before launching a run.';
  }
  if (error.includes('FORVA_CREDITS_EXHAUSTED')) {
    return 'You do not have enough FORVA Credits to start this acquisition run.';
  }
  return 'FORVA could not complete this acquisition run.';
}

export function formatStopReason(reason: string | null): string {
  if (!reason) return '\u2014';
  const map: Record<string, string> = {
    'inbound_reply:interested': 'Prospect replied: interested',
    'inbound_reply:not_interested': 'Prospect replied: not interested',
    'unsubscribe': 'Unsubscribed',
    'not_interested': 'Not interested',
  };
  if (map[reason]) return map[reason];
  return reason.replace(/[:_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
