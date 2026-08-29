export interface AdminOverviewData {
  ok: boolean;
  action: string;
  stats: {
    workspaces: number;
    prospects: number;
    verified: number;
    qualified: number;
    contacted: number;
    outreach_sent: number;
    conversations: number;
    inbound_replies: number;
    followups: number;
    pending_followups: number;
    review_items: number;
    acquisition_runs: {
      queued: number;
      running: number;
      completed: number;
      failed: number;
    };
  };
  plan_counts: {
    starter: number;
    growth: number;
    pro: number;
  };
  recent_runs: AdminRun[];
}

export interface AdminRun {
  id: string;
  workspace_id: string | null;
  target_profile_id: string | null;
  created_by: string | null;
  status: string;
  requested_prospect_count: number | null;
  config_snapshot: Record<string, unknown> | null;
  n8n_execution_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminWorkspaceRef {
  id: string;
  name: string | null;
  owner_user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminMembership {
  workspace_id: string;
  user_id: string;
  role: string | null;
  created_at: string | null;
  workspace: AdminWorkspaceRef | null;
}

export interface AdminUser {
  id: string;
  email: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  user_metadata: Record<string, unknown> | null;
  memberships: AdminMembership[];
}

export interface AdminUsersResponse {
  ok: boolean;
  action: string;
  page: number;
  page_size: number;
  has_more: boolean;
  data: AdminUser[];
}

export interface AdminWorkspace {
  id: string;
  name: string | null;
  owner_user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  member_count: number | null;
  credit_account: {
    workspace_id: string;
    plan: string | null;
    monthly_allowance: number | null;
    monthly_remaining: number | null;
    topup_remaining: number | null;
    cycle_start: string | null;
    cycle_end: string | null;
    status: string | null;
    updated_at: string | null;
  } | null;
}

export interface AdminProspect {
  id: string;
  workspace_id: string | null;
  name: string;
  domain: string | null;
  website_url: string | null;
  city: string | null;
  country_code: string | null;
  public_email: string | null;
  phone: string | null;
  verification_status: string | null;
  state: string | null;
  created_at: string | null;
}

export interface AdminBusinessRef {
  id: string;
  name: string | null;
  domain: string | null;
  website_url: string | null;
  public_email: string | null;
}

export interface AdminContactRef {
  id: string;
  full_name: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
}

export interface AdminOutreach {
  id: string;
  workspace_id: string | null;
  business_id: string | null;
  contact_id: string | null;
  channel: string | null;
  subject: string | null;
  body: string | null;
  approval_state: string | null;
  status: string | null;
  provider_message_id: string | null;
  approved_by: string | null;
  approved_at: string | null;
  sent_at: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  contact: AdminContactRef | null;
  business: AdminBusinessRef | null;
}

export interface AdminConversation {
  id: string;
  workspace_id: string | null;
  business_id: string | null;
  contact_id: string | null;
  channel: string | null;
  external_thread_id: string | null;
  status: string | null;
  last_message_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  business: AdminBusinessRef | null;
  contact: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

export interface AdminMessage {
  id: string;
  direction: string | null;
  status: string | null;
  subject: string | null;
  body: string | null;
  intent: string | null;
  provider: string | null;
  occurred_at: string | null;
  created_at: string | null;
}

export interface AdminConversationMessagesResponse {
  ok: boolean;
  action: string;
  data: AdminMessage[];
}

export interface AdminFollowup {
  id: string;
  workspace_id: string | null;
  business_id: string | null;
  conversation_id: string | null;
  scheduled_for: string | null;
  status: string | null;
  stop_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
  business: AdminBusinessRef | null;
}

export interface AdminReview {
  id: string;
  workspace_id: string | null;
  conversation_id: string | null;
  direction: string | null;
  body: string | null;
  subject: string | null;
  intent: string | null;
  status: string | null;
  provider: string | null;
  occurred_at: string | null;
  created_at: string | null;
}

export interface AdminBillingAccount {
  workspace_id: string;
  plan: string | null;
  monthly_allowance: number | null;
  monthly_remaining: number | null;
  topup_remaining: number | null;
  cycle_start: string | null;
  cycle_end: string | null;
  status: string | null;
  updated_at: string | null;
}

export interface AdminSystemData {
  ok: boolean;
  action: string;
  acquisition_runs: AdminRun[];
  audit_logs: AdminAuditLog[];
}

export interface AdminAuditLog {
  id: string;
  action: string | null;
  workspace_id: string | null;
  actor_user_id: string | null;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
}

export interface AdminPagedResponse<T> {
  ok: boolean;
  action: string;
  count: number;
  page: number;
  page_size: number;
  data: T[];
}
