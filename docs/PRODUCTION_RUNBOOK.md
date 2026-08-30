# FORVA Production Recovery Runbook

This runbook covers only production controls that are implemented in the current FORVA backend. It does not replace provider dashboards or n8n execution logs.

## 1. Emergency outbound stop

FORVA has a centralized database-authoritative outbound switch used by `forva_outreach_preflight`. Main Auto-Pilot, Manual Outreach Worker, and Follow-up Worker all call this preflight before provider sending.

Disable all outbound sending with the service-role-only RPC:

```sql
select public.forva_set_outbound_sending(false, 'incident reason');
```

Re-enable only after the incident is resolved:

```sql
select public.forva_set_outbound_sending(true, 'incident resolved');
```

Expected blocked preflight reason while disabled: `platform_sending_disabled`.

For a broader acquisition incident, also disable the affected n8n workflow or set the Main workflow `killSwitch` to true so new prospect-processing work does not continue unnecessarily.

## 2. Acquisition run checks

Inspect recent queued/running/failed work:

```sql
select id, workspace_id, status, requested_prospect_count,
       started_at, completed_at, error_message, created_at, updated_at
from public.acquisition_runs
order by created_at desc
limit 100;
```

Investigate runs that remain `running` longer than expected before changing state. Do not mark a run completed unless the workflow actually completed.

## 3. Follow-up worker checks

The Follow-up Worker uses `forva_claim_due_followups_v2` with atomic claim/retry handling. A follow-up must have a successful sent/delivered source outreach before it can be claimed.

Inspect due or stale rows:

```sql
select id, workspace_id, business_id, status, mode, sequence_no,
       scheduled_for, claimed_at, attempt_count,
       source_outreach_message_id, stop_reason, last_error
from public.followups
where status in ('scheduled', 'queued', 'failed', 'stopped')
order by scheduled_for asc;
```

If outbound safety is uncertain, use the central outbound switch first. Do not activate the 5-minute Follow-up schedule against uncontrolled historical rows.

## 4. Resend inbound / delivery webhook checks

`forva-resend-webhook` verifies Svix signatures, deduplicates provider events, forwards valid inbound email events to authenticated n8n, and processes bounce/complaint/suppression events.

Inspect failures/retries:

```sql
select provider, event_id, event_type, status, attempts,
       last_error, created_at, updated_at, processed_at
from public.forva_webhook_events
order by created_at desc
limit 100;
```

Repeated `failed` rows require investigation in Supabase Edge Function logs and the corresponding n8n inbound execution. Never bypass signature verification to clear a webhook incident.

## 5. Suppression and unsubscribe safety

Before restoring sending after an incident, confirm suppression is still enforced. Never delete suppression records merely to unblock sending.

```sql
select workspace_id, channel, reason, source, is_active, created_at, lifted_at
from public.suppression_records
where is_active = true
order by created_at desc;
```

## 6. Billing and credit checks

Inspect subscription state and credit balances independently. A provider payment must not grant credits twice, and failed paid actions must restore only the intended credit portion.

```sql
select workspace_id, provider, plan, pending_plan, status,
       environment, last_payment_at, cancel_requested_at, updated_at
from public.forva_billing_subscriptions
order by updated_at desc;

select workspace_id, plan, monthly_allowance, monthly_remaining,
       topup_remaining, cycle_start, cycle_end, status, updated_at
from public.forva_credit_accounts
order by updated_at desc;
```

For PayPal incidents, also inspect Supabase Edge Function logs for `paypal-webhook`, `paypal-create-subscription`, `paypal-manage-subscription`, `paypal-create-topup-order`, and `paypal-capture-topup-order`.

## 7. Audit checks

Sensitive state changes are persisted to `audit_logs`, including outreach approval/rejection/send/failure, follow-up sent/stopped/failure, suppression changes, billing-state changes, platform outbound-switch changes, and Main workflow failure logs.

```sql
select id, workspace_id, actor_user_id, action,
       entity_type, entity_id, metadata, created_at
from public.audit_logs
order by created_at desc
limit 200;
```

Do not store raw API keys, provider secrets, email bodies, or passwords in audit metadata.

## 8. Rate-limit checks

Expensive/sensitive public actions use the service-only `forva_check_rate_limit` backend limiter. The rate-limit bucket table is not accessible to browser roles.

If legitimate traffic is unexpectedly receiving HTTP 429, inspect the associated endpoint and its configured window before changing limits. Do not disable rate limiting as the first response.

## 9. Recovery order

1. Disable outbound sending if there is any risk of unintended email.
2. Stop or disable the affected n8n workflow when continued processing could create cost or state changes.
3. Identify the failed run, follow-up, webhook, billing event, or provider call using persisted state and logs.
4. Fix the root cause without deleting evidence, suppression, audit, or billing ledger history.
5. Verify credits and idempotency state before retrying.
6. Perform one controlled retry with a recipient/account you control when applicable.
7. Confirm persistence and provider metadata.
8. Re-enable the affected worker/workflow.
9. Re-enable outbound sending last.

## 10. Launch-proof items that must remain evidence-based

Do not mark production complete until controlled evidence exists for Main, Manual Outreach Worker, Follow-up Worker, signed Resend inbound webhook handling, and the live PayPal payment-to-credit journey. Final canonical n8n exports must come from the workflows that actually passed those tests.