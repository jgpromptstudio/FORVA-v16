# FORVA frontend source validation

Baseline: `project-bolt-sb1-wfjme6vj (15).zip`

## Regular dashboard changes
- New-account workspace self-heal uses `ensure_my_forva_workspace`.
- Credits use `get_forva_credit_account` instead of direct credit-table reads.
- No-plan state is distinct from a backend error.
- Acquisition queue errors use the existing `formatAcquisitionError` helper.
- Overview run errors use the existing formatter.
- Recent Activity follow-up timestamps use record creation time, not the future scheduled time.
- Review Queue includes pending manual outreach persisted by n8n v1.4 plus conversation reply drafts.
- Billing uses the canonical plan configuration and does not render fake disabled checkout buttons.
- Settings no longer exposes technical workspace identifiers.
- Admin Dashboard entry appears only after `platform_admins` authorization succeeds.

## Admin dashboard changes
- Existing `AdminRoute` and `forva-admin-data` authorization preserved.
- Added Analytics route using only existing admin overview data.
- Added plan MRR/ARR estimates, reply rate, qualification rate and run success rate.
- Actual collected revenue/churn/refunds are explicitly not fabricated while payment data is unavailable.
- Users page adds search and read-only expandable account detail.
- Billing renamed Revenue & Credits; existing read-only credit monitoring preserved.
- Existing workspaces, runs, prospects, review queue, outreach, conversations, follow-ups and audit/system pages preserved.

## Validation performed
- 104 TS/TSX source files parsed successfully with TypeScript transpile validation.
- 0 local import resolution failures.
- `.env` removed from the GitHub package and `.env.example` added.
- Secret-pattern source scan found no embedded service-role/provider keys.

## Environment limitation
A full Vite build could not run in this sandbox because the npm cache is missing the transitive package `yocto-queue`; this is an environment/dependency-download limitation. Build must be confirmed in Bolt/GitHub CI/Netlify where npm dependencies can be installed.
