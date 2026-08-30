import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { GuidanceCard } from '@/components/dashboard/GuidanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { supabase } from '@/lib/supabase';
import { AlertCircle, Bot, CheckCircle2, Loader2, LogOut, Save, ShieldCheck, Sparkles } from 'lucide-react';

type JsonObject = Record<string, unknown>;

interface ProfileRecord {
  id: string;
  tone: string | null;
  length_preference: string | null;
  vocabulary_rules: JsonObject | null;
  phrases_to_avoid: string[] | null;
  allowed_claims: unknown;
  pricing_rules: JsonObject | null;
  followup_rules: JsonObject | null;
  handoff_rules: JsonObject | null;
  sender_identity: JsonObject | null;
  business_knowledge: JsonObject | null;
  autopilot_rules: JsonObject | null;
}

interface SettingsForm {
  from_name: string;
  from_email: string;
  tone: string;
  length_preference: string;
  phrases_to_avoid: string;
  business_context: string;
  followup_auto_send: boolean;
  first_delay_days: number;
  autopilot_enabled: boolean;
  reply_auto_send: boolean;
  daily_send_limit: number;
}

const emptyForm: SettingsForm = {
  from_name: '',
  from_email: '',
  tone: 'professional, concise, natural',
  length_preference: 'short',
  phrases_to_avoid: '',
  business_context: '',
  followup_auto_send: false,
  first_delay_days: 3,
  autopilot_enabled: false,
  reply_auto_send: false,
  daily_send_limit: 0,
};

function asObject(value: unknown): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseAvoidList(value: string): string[] {
  const userItems = value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return Array.from(new Set([...userItems, '—', '--']));
}

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const navigate = useNavigate();
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      if (!workspaceId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: loadError } = await supabase
        .from('writing_profiles')
        .select('id,tone,length_preference,vocabulary_rules,phrases_to_avoid,allowed_claims,pricing_rules,followup_rules,handoff_rules,sender_identity,business_knowledge,autopilot_rules')
        .eq('workspace_id', workspaceId)
        .eq('is_default', true)
        .maybeSingle();

      if (loadError || !data) {
        setError(loadError?.message ?? 'Default writing profile not found for this workspace.');
        setLoading(false);
        return;
      }

      const current = data as ProfileRecord;
      const identity = asObject(current.sender_identity);
      const followupRules = asObject(current.followup_rules);
      const autopilotRules = asObject(current.autopilot_rules);
      const businessKnowledge = asObject(current.business_knowledge);
      const avoid = Array.isArray(current.phrases_to_avoid)
        ? current.phrases_to_avoid.filter((item) => item !== '—' && item !== '--')
        : [];

      setProfile(current);
      setForm({
        from_name: typeof identity.from_name === 'string' ? identity.from_name : '',
        from_email: typeof identity.from_email === 'string' ? identity.from_email : '',
        tone: current.tone || 'professional, concise, natural',
        length_preference: current.length_preference || 'short',
        phrases_to_avoid: avoid.join(', '),
        business_context: typeof businessKnowledge.context === 'string' ? businessKnowledge.context : '',
        followup_auto_send: asBoolean(followupRules.auto_send, false),
        first_delay_days: Math.max(1, Math.min(30, asNumber(followupRules.first_delay_days, 3))),
        autopilot_enabled: asBoolean(autopilotRules.enabled, false),
        reply_auto_send: asBoolean(autopilotRules.reply_auto_send, false),
        daily_send_limit: Math.max(0, Math.min(1000, asNumber(autopilotRules.daily_send_limit, 0))),
      });
      setLoading(false);
    }

    loadSettings();
  }, [workspaceId]);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  async function saveSettings() {
    if (!workspaceId || !profile) return;

    const fromName = form.from_name.trim();
    const fromEmail = form.from_email.trim();
    const tone = form.tone.trim();

    if (!fromName || !fromEmail || !tone) {
      setError('Sender name, sender email and writing style are required.');
      setSuccess(null);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(fromEmail)) {
      setError('Enter a valid sender email address.');
      setSuccess(null);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const senderIdentity = {
      ...asObject(profile.sender_identity),
      from_name: fromName,
      from_email: fromEmail,
    };

    const vocabularyRules = {
      ...asObject(profile.vocabulary_rules),
      human_like: true,
      avoid_em_dashes: true,
      avoid_double_hyphens: true,
      avoid_hype: true,
    };

    const followupRules = {
      ...asObject(profile.followup_rules),
      enabled: true,
      auto_send: form.followup_auto_send,
      first_delay_days: Math.max(1, Math.min(30, Math.round(form.first_delay_days || 3))),
    };

    const autopilotRules = {
      ...asObject(profile.autopilot_rules),
      enabled: form.autopilot_enabled,
      reply_auto_send: form.reply_auto_send,
      daily_send_limit: Math.max(0, Math.min(1000, Math.round(form.daily_send_limit || 0))),
    };

    const businessKnowledge = {
      ...asObject(profile.business_knowledge),
      context: form.business_context.trim(),
    };

    const { data: result, error: saveError } = await supabase.rpc('save_forva_writing_profile_settings', {
      p_workspace_id: workspaceId,
      p_tone: tone,
      p_length_preference: form.length_preference,
      p_vocabulary_rules: vocabularyRules,
      p_phrases_to_avoid: parseAvoidList(form.phrases_to_avoid),
      p_allowed_claims: Array.isArray(profile.allowed_claims) ? profile.allowed_claims : [],
      p_pricing_rules: asObject(profile.pricing_rules),
      p_followup_rules: followupRules,
      p_handoff_rules: asObject(profile.handoff_rules),
      p_sender_identity: senderIdentity,
      p_business_knowledge: businessKnowledge,
      p_autopilot_rules: autopilotRules,
    });

    if (saveError || !result?.ok) {
      setError(saveError?.message ?? result?.error ?? 'Unable to save settings.');
      setSaving(false);
      return;
    }

    setProfile({
      ...profile,
      tone,
      length_preference: form.length_preference,
      vocabulary_rules: vocabularyRules,
      phrases_to_avoid: parseAvoidList(form.phrases_to_avoid),
      followup_rules: followupRules,
      sender_identity: senderIdentity,
      business_knowledge: businessKnowledge,
      autopilot_rules: autopilotRules,
    });
    setSuccess('Settings saved. New first emails, replies and follow-ups will use these preferences.');
    setSaving(false);
  }

  const inputClass = 'mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none';

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
    >
      <div className="space-y-6">
        <GuidanceCard title="Set this once, then let FORVA follow it">
          Sender identity controls what prospects see. Writing Style controls how new AI drafts sound. Auto-Pilot controls what FORVA may send without waiting for you. Manual mode still waits for your approval even when Auto-Pilot settings are configured.
        </GuidanceCard>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Authenticated email</label>
                <p className="mt-1 text-sm text-foreground">{user?.email ?? 'Not available'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Session status</label>
                <div className="mt-1 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-foreground">Authenticated</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card><CardContent><div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></CardContent></Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Sender Identity
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Choose the name and email prospects see in their inbox. FORVA manages platform compliance details separately.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Sender Name</label>
                  <input
                    type="text"
                    value={form.from_name}
                    onChange={(e) => setForm((f) => ({ ...f, from_name: e.target.value }))}
                    placeholder="FORVA"
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-muted-foreground/70">This is the sender name prospects will see.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Sender Email</label>
                  <input
                    type="email"
                    value={form.from_email}
                    onChange={(e) => setForm((f) => ({ ...f, from_email: e.target.value }))}
                    placeholder="hello@forva.net"
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Use an address on a sending domain already approved for your FORVA workspace.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Writing Style
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  These preferences are used when FORVA drafts first emails, replies and follow-ups.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Tone</label>
                  <input
                    type="text"
                    value={form.tone}
                    onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))}
                    placeholder="professional, concise, natural"
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-muted-foreground/70">Example: friendly, direct and conversational.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Message Length</label>
                  <select
                    value={form.length_preference}
                    onChange={(e) => setForm((f) => ({ ...f, length_preference: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Words or phrases to avoid</label>
                  <textarea
                    value={form.phrases_to_avoid}
                    onChange={(e) => setForm((f) => ({ ...f, phrases_to_avoid: e.target.value }))}
                    placeholder="e.g. game changer, revolutionary, just checking in"
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Business Context</label>
                  <textarea
                    value={form.business_context}
                    onChange={(e) => setForm((f) => ({ ...f, business_context: e.target.value }))}
                    placeholder="Briefly explain what your business offers and what FORVA may safely say when replying."
                    rows={4}
                    className={inputClass}
                  />
                </div>
                <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-3 text-xs text-muted-foreground">
                  <span className="font-medium text-emerald-400">Human-like writing is always on.</span> New drafts are instructed to stay natural, avoid hype, avoid em dashes and avoid double hyphens.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Auto-Pilot Controls
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  These rules apply only when you choose Auto-Pilot for an acquisition run. Manual mode still waits for you.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <input
                    type="checkbox"
                    checked={form.autopilot_enabled}
                    onChange={(e) => setForm((f) => ({ ...f, autopilot_enabled: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">Allow eligible first emails to send automatically</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">Qualification, suppression and compliance checks still run before any send.</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <input
                    type="checkbox"
                    checked={form.reply_auto_send}
                    onChange={(e) => setForm((f) => ({ ...f, reply_auto_send: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">Allow safe replies to send automatically</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">Pricing questions, meeting requests and safety handoffs still go to Review Queue.</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <input
                    type="checkbox"
                    checked={form.followup_auto_send}
                    onChange={(e) => setForm((f) => ({ ...f, followup_auto_send: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">Allow scheduled follow-ups to send automatically</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">If a prospect replies or unsubscribes, unnecessary follow-ups are stopped.</span>
                  </span>
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">First follow-up after</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={form.first_delay_days}
                        onChange={(e) => setForm((f) => ({ ...f, first_delay_days: Number(e.target.value) }))}
                        className={inputClass}
                      />
                      <span className="mt-1 text-xs text-muted-foreground">days</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Daily Auto-Pilot send limit</label>
                    <input
                      type="number"
                      min={0}
                      max={1000}
                      value={form.daily_send_limit}
                      onChange={(e) => setForm((f) => ({ ...f, daily_send_limit: Number(e.target.value) }))}
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-muted-foreground/70">0 means use no extra user-set daily cap.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <p className="text-xs text-emerald-400">{success}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={saving || !workspaceId || !profile}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </>
        )}
      </div>
    </WorkspaceGuard>
  );
}
