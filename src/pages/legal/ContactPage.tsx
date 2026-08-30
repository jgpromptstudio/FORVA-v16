import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, MessageSquare, CreditCard } from 'lucide-react';

export function ContactPage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Contact FORVA"
      intro="Choose the support path that matches what you need. FORVA does not ask users to share passwords, API keys, recovery codes, or full payment details in support reports."
    >
      <LegalSection heading="Using FORVA">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            If you already have a FORVA account, use Support inside your dashboard. When reporting a problem, include the page you were on, what you clicked, the approximate time, and a screenshot when useful.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <button onClick={() => navigate('/login')} className="text-primary underline-offset-4 hover:underline">Sign in to FORVA</button>
          <button onClick={() => navigate('/signup')} className="text-primary underline-offset-4 hover:underline">Create an account</button>
        </div>
      </LegalSection>

      <LegalSection heading="Account and Billing Support">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            Use the forgot-password flow for account access issues. Signed-in users can view their active plan, credit balance, top-ups, and PayPal subscription status from Credits & Billing in the dashboard.
          </p>
        </div>
        <div className="mt-4">
          <button onClick={() => navigate('/login')} className="text-primary underline-offset-4 hover:underline">Go to login</button>
        </div>
      </LegalSection>

      <LegalSection heading="Security Concerns">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            If you have identified a security vulnerability or have a security concern, report it responsibly through the authenticated Support area when possible. Do not attempt to exploit or publicly disclose potential vulnerabilities before reporting them.
          </p>
        </div>
        <div className="mt-4">
          <button onClick={() => navigate('/security')} className="text-primary underline-offset-4 hover:underline">Read the Security page</button>
        </div>
      </LegalSection>

      <LegalSection heading="Responsible-Use Reports">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            If you believe a FORVA account is being used in violation of the Acceptable Use Policy or Responsible Outreach guidelines, include enough relevant detail for the matter to be reviewed.
          </p>
        </div>
        <div className="mt-4">
          <button onClick={() => navigate('/acceptable-use')} className="text-primary underline-offset-4 hover:underline">Read the Acceptable Use Policy</button>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
