import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { supabase } from '@/lib/supabase';
import { AlertCircle, CheckCircle2, Loader2, LogOut, Save, ShieldCheck } from 'lucide-react';

interface SenderIdentityForm {
  from_name: string;
  from_email: string;
}

const emptyForm: SenderIdentityForm = {
  from_name: '',
  from_email: '',
};

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const navigate = useNavigate();
  const [form, setForm] = useState<SenderIdentityForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadSenderIdentity() {
      if (!workspaceId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: loadError } = await supabase
        .from('writing_profiles')
        .select('sender_identity')
        .eq('workspace_id', workspaceId)
        .eq('is_default', true)
        .maybeSingle();

      if (loadError) {
        setError(loadError.message);
        setLoading(false);
        return;
      }

      const identity = (data?.sender_identity ?? {}) as Record<string, unknown>;
      setForm({
        from_name: typeof identity.from_name === 'string' ? identity.from_name : '',
        from_email: typeof identity.from_email === 'string' ? identity.from_email : '',
      });
      setLoading(false);
    }

    loadSenderIdentity();
  }, [workspaceId]);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  async function saveSenderIdentity() {
    if (!workspaceId) return;

    const fromName = form.from_name.trim();
    const fromEmail = form.from_email.trim();

    if (!fromName || !fromEmail) {
      setError('Sender name and sender email are required.');
      setSuccess(null);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const { data: current, error: currentError } = await supabase
      .from('writing_profiles')
      .select('id, sender_identity')
      .eq('workspace_id', workspaceId)
      .eq('is_default', true)
      .maybeSingle();

    if (currentError || !current?.id) {
      setError(currentError?.message ?? 'Default writing profile not found for this workspace.');
      setSaving(false);
      return;
    }

    const existing = (current.sender_identity ?? {}) as Record<string, unknown>;
    const nextIdentity = {
      ...existing,
      from_name: fromName,
      from_email: fromEmail,
    };

    const { error: updateError } = await supabase
      .from('writing_profiles')
      .update({ sender_identity: nextIdentity })
      .eq('id', current.id)
      .eq('workspace_id', workspaceId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setForm({ from_name: fromName, from_email: fromEmail });
    setSuccess('Sender identity saved. New outreach will use this sender name and email.');
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
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Sender Identity
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Choose the sender name and email prospects will see in their inbox. Compliance details are managed by FORVA automatically.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Sender Name</label>
                  <input
                    type="text"
                    value={form.from_name}
                    onChange={(e) => setForm((f) => ({ ...f, from_name: e.target.value }))}
                    placeholder="FORVA"
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    This is the name prospects will see as the sender.
                  </p>
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
                    This is the email address prospects will see in the From field.
                  </p>
                </div>

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

                <Button onClick={saveSenderIdentity} disabled={saving || !workspaceId}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Sender Identity
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </WorkspaceGuard>
  );
}
