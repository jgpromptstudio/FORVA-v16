import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/GoogleIcon';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [accountType, setAccountType] = useState<'individual' | 'team'>('individual');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [validation, setValidation] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidation('');

    if (!fullName.trim()) {
      setValidation('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setValidation('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setValidation('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidation('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setValidation('Please accept the Terms and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          business_name: businessName,
          country,
          account_type: accountType,
        },
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      navigate('/dashboard');
      return;
    }

    setSuccess('Check your email for a confirmation link to complete your registration.');
  }

  async function handleGoogle() {
    setError('');
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setGoogleLoading(false);

    if (error) {
      setError(error.message);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors';

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-white font-display">Build your client engine</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create your FORVA account and start building a more consistent path to premium clients.
      </p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      {success && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
          <p className="text-sm text-emerald-400">{success}</p>
        </div>
      )}
      {validation && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <p className="text-sm text-amber-400">{validation}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="signup-business" className="mb-1.5 block text-sm font-medium text-foreground">
            Business or Company Name
          </label>
          <input
            id="signup-business"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Smith Consulting Group"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={cn(inputClass, 'pr-11')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="signup-confirm" className="mb-1.5 block text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <input
            id="signup-confirm"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="signup-country" className="mb-1.5 block text-sm font-medium text-foreground">
            Country or Target Market
          </label>
          <input
            id="signup-country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United States"
            className={inputClass}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">Account Type</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccountType('individual')}
              className={cn(
                'rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                accountType === 'individual'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
              )}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setAccountType('team')}
              className={cn(
                'rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                accountType === 'team'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
              )}
            >
              Team / Agency
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{' '}
            <Link to="/terms" className="font-medium text-primary underline-offset-4 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create My Account
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Google button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
