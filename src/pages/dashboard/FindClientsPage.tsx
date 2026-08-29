import { useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { useAcquisitionRuns } from '@/lib/dashboard/useAcquisitionRuns';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { formatTimeAgo, formatAcquisitionError } from '@/lib/dashboard/workspace';
import { Target, Loader2, AlertCircle, CheckCircle2, Rocket } from 'lucide-react';

const runStatusColors: Record<string, string> = {
  queued: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  running: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-white/10 text-muted-foreground border-white/20',
};

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

interface FormState {
  country: string;
  city: string;
  niche: string;
  serviceOffer: string;
  desiredProspectCount: string;
  minimumScore: string;
  mode: string;
}

const defaultForm: FormState = {
  country: '',
  city: '',
  niche: '',
  serviceOffer: '',
  desiredProspectCount: '50',
  minimumScore: '70',
  mode: 'manual',
};

export function FindClientsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { data: runs, loading: runsLoading, error: runsError, refresh: refreshRuns } = useAcquisitionRuns(workspaceId);

  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workspaceId) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    setFieldErrors({});

    const country = form.country.trim();
    const city = form.city.trim();
    const niche = form.niche.trim();
    const serviceOffer = form.serviceOffer.trim();

    const errors: Record<string, string> = {};
    if (!country) errors.country = 'Country is required';
    if (!city) errors.city = 'City is required';
    if (!niche) errors.niche = 'Industry / Niche is required';
    if (!serviceOffer) errors.serviceOffer = 'Service Offer is required';

    const desiredCount = Number.parseInt(form.desiredProspectCount, 10);
    if (Number.isNaN(desiredCount) || desiredCount < 1) {
      errors.desiredProspectCount = 'Desired prospects must be at least 1';
    }

    const parsedScore = Number.parseInt(form.minimumScore, 10);
    const minimumScore = Number.isNaN(parsedScore) ? 70 : Math.min(100, Math.max(0, parsedScore));
    if (!Number.isNaN(parsedScore) && (parsedScore < 0 || parsedScore > 100)) {
      errors.minimumScore = 'Minimum score must be between 0 and 100';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const { data: savedProfile, error: saveError } = await supabase.rpc('save_forva_target_profile', {
        p_workspace_id: workspaceId,
        p_profile_id: null,
        p_name: null,
        p_country: country,
        p_city: city,
        p_niche: niche,
        p_service_offer: serviceOffer,
        p_desired_prospect_count: Number.isNaN(desiredCount) ? 50 : desiredCount,
        p_minimum_score: minimumScore,
        p_mode: form.mode,
      });

      if (saveError) throw new Error(saveError.message);

      const profileId = typeof savedProfile === 'string'
        ? savedProfile
        : savedProfile?.id;

      if (!profileId) {
        throw new Error('Failed to save target profile: no profile ID returned. Please try again or contact support.');
      }

      const { data: queuedRun, error: queueError } = await supabase.rpc('queue_forva_acquisition_run', {
        p_target_profile_id: profileId,
      });

      if (queueError) throw new Error(formatAcquisitionError(queueError.message));

      const runId = typeof queuedRun === 'string'
        ? queuedRun
        : queuedRun?.id;

      if (!runId) {
        throw new Error('Failed to queue acquisition run: no run ID returned.');
      }

      const { error: invokeError } = await supabase.functions.invoke('start-forva-acquisition', {
        body: { run_id: runId },
      });

      if (invokeError) {
        console.error('start-forva-acquisition error:', invokeError.message);
        throw new Error(formatAcquisitionError(invokeError.message));
      }

      setSubmitSuccess('Acquisition run queued and started. You can track its status below.');
      setForm(defaultForm);
      refreshRuns();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  }

  const inputClass = 'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none';
  const errorInputClass = 'w-full rounded-lg border border-red-500/40 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-red-500/50 focus:outline-none';

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Target Profile
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Define your ideal client criteria. FORVA will discover and process matching businesses.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Country <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    placeholder="e.g. United States"
                    className={cn('mt-1', fieldErrors.country ? errorInputClass : inputClass)}
                  />
                  {fieldErrors.country && <p className="mt-1 text-xs text-red-400">{fieldErrors.country}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">City <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g. New York"
                    className={cn('mt-1', fieldErrors.city ? errorInputClass : inputClass)}
                  />
                  {fieldErrors.city && <p className="mt-1 text-xs text-red-400">{fieldErrors.city}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Industry / Niche <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.niche}
                  onChange={(e) => updateField('niche', e.target.value)}
                  placeholder="e.g. Dental clinics"
                  className={cn('mt-1', fieldErrors.niche ? errorInputClass : inputClass)}
                />
                {fieldErrors.niche && <p className="mt-1 text-xs text-red-400">{fieldErrors.niche}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Service Offer <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.serviceOffer}
                  onChange={(e) => updateField('serviceOffer', e.target.value)}
                  placeholder="e.g. Web design and SEO"
                  className={cn('mt-1', fieldErrors.serviceOffer ? errorInputClass : inputClass)}
                />
                {fieldErrors.serviceOffer && <p className="mt-1 text-xs text-red-400">{fieldErrors.serviceOffer}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Desired Prospect Count</label>
                  <input
                    type="number"
                    min="1"
                    value={form.desiredProspectCount}
                    onChange={(e) => updateField('desiredProspectCount', e.target.value)}
                    className={cn('mt-1', fieldErrors.desiredProspectCount ? errorInputClass : inputClass)}
                  />
                  {fieldErrors.desiredProspectCount && <p className="mt-1 text-xs text-red-400">{fieldErrors.desiredProspectCount}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Minimum Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.minimumScore}
                    onChange={(e) => updateField('minimumScore', e.target.value)}
                    className={cn('mt-1', fieldErrors.minimumScore ? errorInputClass : inputClass)}
                  />
                  {fieldErrors.minimumScore && <p className="mt-1 text-xs text-red-400">{fieldErrors.minimumScore}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Mode</label>
                  <select
                    value={form.mode}
                    onChange={(e) => updateField('mode', e.target.value)}
                    className={cn('mt-1', inputClass)}
                  >
                    <option value="manual">Manual</option>
                    <option value="auto_pilot">Autopilot</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {form.mode === 'manual'
                      ? 'FORVA finds and prepares prospects for your review before outreach is sent.'
                      : 'FORVA can automatically send eligible outreach after all qualification and safety checks pass.'}
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-xs text-destructive">{submitError}</p>
                </div>
              )}

              {submitSuccess && (
                <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <p className="text-xs text-emerald-400">{submitSuccess}</p>
                </div>
              )}

              <Button type="submit" disabled={submitting || !workspaceId} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Queuing run...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Launch Acquisition Run
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Run history */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Recent Acquisition Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {runsError && <ErrorBanner error={runsError} />}
            {runsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : runs.length === 0 ? (
              <EmptyState message="No acquisition runs yet. Launch your first run using the form on the left." />
            ) : (
              <div className="space-y-3">
                {runs.map((run) => (
                  <div key={run.id} className="rounded-lg bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                        runStatusColors[run.status] ?? 'bg-white/10 text-muted-foreground border-white/20'
                      )}>
                        {capitalize(run.status)}
                      </span>
                      {run.created_at && (
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(run.created_at)}</span>
                      )}
                    </div>
                    {run.requested_prospect_count !== null && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Requested prospects: <span className="font-medium text-foreground">{run.requested_prospect_count}</span>
                      </p>
                    )}
                    {run.error_message && (
                      <div className="mt-2 rounded-lg bg-red-500/10 p-2">
                        <p className="text-xs text-red-400">{formatAcquisitionError(run.error_message)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WorkspaceGuard>
  );
}
