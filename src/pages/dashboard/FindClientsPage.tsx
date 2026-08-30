import { useEffect, useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { GuidanceCard } from '@/components/dashboard/GuidanceCard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { useAcquisitionRuns } from '@/lib/dashboard/useAcquisitionRuns';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { formatTimeAgo, formatAcquisitionError } from '@/lib/dashboard/workspace';
import {
  loadCountries,
  loadStates,
  loadCities,
  type CountryOption,
  type StateOption,
  type CityOption,
} from '@/lib/locationData';
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
  stateCode: string;
  city: string;
  niche: string;
  serviceOffer: string;
  desiredProspectCount: string;
  minimumScore: string;
  mode: string;
}

const defaultForm: FormState = {
  country: '',
  stateCode: '',
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

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function initCountries() {
      setCountriesLoading(true);
      setLocationError(null);
      try {
        const data = await loadCountries();
        if (!cancelled) setCountries(data);
      } catch {
        if (!cancelled) setLocationError('Location choices could not be loaded. Please refresh and try again.');
      } finally {
        if (!cancelled) setCountriesLoading(false);
      }
    }
    initCountries();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function refreshStates() {
      setStates([]);
      setCities([]);
      if (!form.country) return;
      setStatesLoading(true);
      setLocationError(null);
      try {
        const data = await loadStates(form.country);
        if (!cancelled) {
          setStates(data);
          if (data.length === 0) setLocationError('No state or region data is available for this country yet.');
        }
      } catch {
        if (!cancelled) setLocationError('States or regions could not be loaded. Please try again.');
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    }
    refreshStates();
    return () => { cancelled = true; };
  }, [form.country]);

  useEffect(() => {
    let cancelled = false;
    async function refreshCities() {
      setCities([]);
      if (!form.country || !form.stateCode) return;
      setCitiesLoading(true);
      setLocationError(null);
      try {
        const data = await loadCities(form.country, form.stateCode);
        if (!cancelled) {
          setCities(data);
          if (data.length === 0) setLocationError('No city data is available for this state or region yet.');
        }
      } catch {
        if (!cancelled) setLocationError('Cities could not be loaded. Please try again.');
      } finally {
        if (!cancelled) setCitiesLoading(false);
      }
    }
    refreshCities();
    return () => { cancelled = true; };
  }, [form.country, form.stateCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workspaceId) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    setFieldErrors({});

    const country = form.country.trim();
    const stateCode = form.stateCode.trim();
    const city = form.city.trim();
    const niche = form.niche.trim();
    const serviceOffer = form.serviceOffer.trim();
    const selectedState = states.find((state) => state.iso2 === stateCode);

    const errors: Record<string, string> = {};
    if (!country || !countries.some((item) => item.iso2 === country)) errors.country = 'Select a country';
    if (!stateCode || !selectedState) errors.stateCode = 'Select a state or region';
    if (!city || !cities.some((item) => item.name === city)) errors.city = 'Select a city';
    if (!niche) errors.niche = 'Industry / Niche is required';
    if (!serviceOffer) errors.serviceOffer = 'Service Offer is required';

    const desiredCount = Number.parseInt(form.desiredProspectCount, 10);
    if (Number.isNaN(desiredCount) || desiredCount < 1) errors.desiredProspectCount = 'Desired prospects must be at least 1';

    const parsedScore = Number.parseInt(form.minimumScore, 10);
    const minimumScore = Number.isNaN(parsedScore) ? 70 : Math.min(100, Math.max(0, parsedScore));
    if (!Number.isNaN(parsedScore) && (parsedScore < 0 || parsedScore > 100)) errors.minimumScore = 'Minimum score must be between 0 and 100';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitting(false);
      return;
    }

    const cityForBackend = selectedState ? `${city}, ${selectedState.name}` : city;

    try {
      const { data: savedProfile, error: saveError } = await supabase.rpc('save_forva_target_profile', {
        p_workspace_id: workspaceId,
        p_profile_id: null,
        p_name: null,
        p_country: country,
        p_city: cityForBackend,
        p_niche: niche,
        p_service_offer: serviceOffer,
        p_desired_prospect_count: Number.isNaN(desiredCount) ? 50 : desiredCount,
        p_minimum_score: minimumScore,
        p_mode: form.mode,
      });

      if (saveError) throw new Error(saveError.message);
      const profileId = typeof savedProfile === 'string' ? savedProfile : savedProfile?.id;
      if (!profileId) throw new Error('Failed to save target profile: no profile ID returned. Please try again or contact support.');

      const { data: queuedRun, error: queueError } = await supabase.rpc('queue_forva_acquisition_run', {
        p_target_profile_id: profileId,
      });
      if (queueError) throw new Error(formatAcquisitionError(queueError.message));

      const runId = typeof queuedRun === 'string' ? queuedRun : queuedRun?.id;
      if (!runId) throw new Error('Failed to queue acquisition run: no run ID returned.');

      const { error: invokeError } = await supabase.functions.invoke('start-forva-acquisition', {
        body: { run_id: runId },
      });
      if (invokeError) throw new Error(formatAcquisitionError(invokeError.message));

      setSubmitSuccess('Acquisition run started. FORVA is now finding and processing matching businesses.');
      setForm(defaultForm);
      refreshRuns();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((current) => {
      if (key === 'country') return { ...current, country: value, stateCode: '', city: '' };
      if (key === 'stateCode') return { ...current, stateCode: value, city: '' };
      return { ...current, [key]: value };
    });
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  }

  const inputClass = 'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';
  const errorInputClass = 'w-full rounded-lg border border-red-500/40 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-red-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <WorkspaceGuard workspaceLoading={wsLoading} workspaceError={wsError} workspaceId={workspaceId}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Target Profile
            </CardTitle>
            <p className="text-xs text-muted-foreground">Tell FORVA who you want to reach and what you want to offer them.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Country <span className="text-red-400">*</span></label>
                  <select value={form.country} onChange={(e) => updateField('country', e.target.value)} disabled={countriesLoading} className={cn('mt-1', fieldErrors.country ? errorInputClass : inputClass)}>
                    <option value="">{countriesLoading ? 'Loading countries...' : 'Select country'}</option>
                    {countries.map((country) => <option key={country.iso2} value={country.iso2}>{country.emoji ? `${country.emoji} ` : ''}{country.name}</option>)}
                  </select>
                  {fieldErrors.country && <p className="mt-1 text-xs text-red-400">{fieldErrors.country}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">State / Region <span className="text-red-400">*</span></label>
                  <select value={form.stateCode} onChange={(e) => updateField('stateCode', e.target.value)} disabled={!form.country || statesLoading} className={cn('mt-1', fieldErrors.stateCode ? errorInputClass : inputClass)}>
                    <option value="">{statesLoading ? 'Loading regions...' : form.country ? 'Select state / region' : 'Select country first'}</option>
                    {states.map((state) => <option key={`${state.iso2}-${state.id}`} value={state.iso2}>{state.name}</option>)}
                  </select>
                  {fieldErrors.stateCode && <p className="mt-1 text-xs text-red-400">{fieldErrors.stateCode}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">City <span className="text-red-400">*</span></label>
                  <select value={form.city} onChange={(e) => updateField('city', e.target.value)} disabled={!form.stateCode || citiesLoading} className={cn('mt-1', fieldErrors.city ? errorInputClass : inputClass)}>
                    <option value="">{citiesLoading ? 'Loading cities...' : form.stateCode ? 'Select city' : 'Select state / region first'}</option>
                    {cities.map((city) => <option key={`${city.id}-${city.name}`} value={city.name}>{city.name}</option>)}
                  </select>
                  {fieldErrors.city && <p className="mt-1 text-xs text-red-400">{fieldErrors.city}</p>}
                </div>
              </div>

              {locationError && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <p className="text-xs text-amber-300">{locationError}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground">Industry / Niche <span className="text-red-400">*</span></label>
                <input type="text" value={form.niche} onChange={(e) => updateField('niche', e.target.value)} placeholder="e.g. Dental clinics" className={cn('mt-1', fieldErrors.niche ? errorInputClass : inputClass)} />
                <p className="mt-1 text-xs text-muted-foreground/70">Who do you want as clients? Be specific, such as dental clinics, real estate agencies or accounting firms.</p>
                {fieldErrors.niche && <p className="mt-1 text-xs text-red-400">{fieldErrors.niche}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Service Offer <span className="text-red-400">*</span></label>
                <input type="text" value={form.serviceOffer} onChange={(e) => updateField('serviceOffer', e.target.value)} placeholder="e.g. Web design and SEO" className={cn('mt-1', fieldErrors.serviceOffer ? errorInputClass : inputClass)} />
                <p className="mt-1 text-xs text-muted-foreground/70">What are you offering those businesses? FORVA uses this to judge fit and personalize outreach.</p>
                {fieldErrors.serviceOffer && <p className="mt-1 text-xs text-red-400">{fieldErrors.serviceOffer}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Desired Prospect Count</label>
                  <input type="number" min="1" value={form.desiredProspectCount} onChange={(e) => updateField('desiredProspectCount', e.target.value)} className={cn('mt-1', fieldErrors.desiredProspectCount ? errorInputClass : inputClass)} />
                  <p className="mt-1 text-xs text-muted-foreground/70">Your target, not a guaranteed number of qualified contacts.</p>
                  {fieldErrors.desiredProspectCount && <p className="mt-1 text-xs text-red-400">{fieldErrors.desiredProspectCount}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Minimum Score</label>
                  <input type="number" min="0" max="100" value={form.minimumScore} onChange={(e) => updateField('minimumScore', e.target.value)} className={cn('mt-1', fieldErrors.minimumScore ? errorInputClass : inputClass)} />
                  <p className="mt-1 text-xs text-muted-foreground/70">70 is a good starting point. Higher means stricter qualification.</p>
                  {fieldErrors.minimumScore && <p className="mt-1 text-xs text-red-400">{fieldErrors.minimumScore}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Mode</label>
                  <select value={form.mode} onChange={(e) => updateField('mode', e.target.value)} className={cn('mt-1', inputClass)}>
                    <option value="manual">Manual</option>
                    <option value="auto_pilot">Auto-Pilot</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {form.mode === 'manual'
                      ? 'You review messages before they are sent.'
                      : 'Eligible messages can continue automatically using your saved Settings and safety rules.'}
                  </p>
                </div>
              </div>

              {submitError && <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /><p className="text-xs text-destructive">{submitError}</p></div>}
              {submitSuccess && <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><p className="text-xs text-emerald-400">{submitSuccess}</p></div>}

              <Button type="submit" disabled={submitting || !workspaceId || countriesLoading || statesLoading || citiesLoading} className="w-full">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Queuing run...</> : <><Rocket className="h-4 w-4" />Launch Acquisition Run</>}
              </Button>

              <GuidanceCard title="What happens after you click Launch">
                <div className="space-y-2">
                  <p>FORVA finds matching businesses, verifies them, scores their fit, looks for usable contact details and prepares personalized outreach.</p>
                  <p>Not every discovered business will continue. A prospect must pass verification, qualification, contact and safety checks before FORVA can prepare or send outreach.</p>
                  <p><span className="font-medium text-foreground">Manual:</span> review the draft in Review Queue before sending. <span className="font-medium text-foreground">Auto-Pilot:</span> eligible actions can continue automatically according to your saved Settings. Anything that needs your judgment is held for review.</p>
                </div>
              </GuidanceCard>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" />Recent Acquisition Runs</CardTitle>
            <p className="text-xs text-muted-foreground">Track whether each search is queued, running, completed or needs attention.</p>
          </CardHeader>
          <CardContent>
            {runsError && <ErrorBanner error={runsError} />}
            {runsLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : runs.length === 0 ? (
              <EmptyState message="No acquisition runs yet. Complete the form on the left to start your first search." />
            ) : (
              <div className="space-y-3">
                {runs.map((run) => (
                  <div key={run.id} className="rounded-lg bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', runStatusColors[run.status] ?? 'bg-white/10 text-muted-foreground border-white/20')}>{capitalize(run.status)}</span>
                      {run.created_at && <span className="text-xs text-muted-foreground">{formatTimeAgo(run.created_at)}</span>}
                    </div>
                    {run.requested_prospect_count !== null && <p className="mt-2 text-xs text-muted-foreground">Requested prospects: <span className="font-medium text-foreground">{run.requested_prospect_count}</span></p>}
                    {run.error_message && <div className="mt-2 rounded-lg bg-red-500/10 p-2"><p className="text-xs text-red-400">{formatAcquisitionError(run.error_message)}</p></div>}
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
