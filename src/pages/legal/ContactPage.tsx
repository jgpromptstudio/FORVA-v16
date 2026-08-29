import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, MessageSquare, Mail } from 'lucide-react';

export function ContactPage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Contact FORVA"
      intro="Use the categories below to reach the right team. We do not publish a phone number or office address. All support is handled through the channels listed here."
    >
      <LegalSection heading="General Inquiries">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            For general questions about FORVA, how it works, sales questions, or partnership inquiries, start by creating
            an account. Already using FORVA and need help with your account or workspace? Open Support from your dashboard.
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/signup')}
            className="text-primary underline-offset-4 hover:underline"
          >
            Create an account to get started
          </button>
        </div>
      </LegalSection>

      <LegalSection heading="Account and Billing Support">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            For account access issues, including trouble signing in, use the forgot-password flow on the
            login page to reset your credentials. Billing and subscription management options will be
            available through your account once payment integration is connected.
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/login')}
            className="text-primary underline-offset-4 hover:underline"
          >
            Go to login
          </button>
        </div>
      </LegalSection>

      <LegalSection heading="Security Concerns">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            If you have identified a security vulnerability or have a security concern, please report it
            responsibly. Do not attempt to exploit or publicly disclose potential vulnerabilities before
            contacting FORVA.
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/security')}
            className="text-primary underline-offset-4 hover:underline"
          >
            Read the Security page
          </button>
        </div>
      </LegalSection>

      <LegalSection heading="Responsible-Use Reports">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            If you believe a FORVA account is being used in violation of the Acceptable Use Policy or
            Responsible Outreach guidelines, please report it. Include relevant details so the matter
            can be reviewed.
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/acceptable-use')}
            className="text-primary underline-offset-4 hover:underline"
          >
            Read the Acceptable Use Policy
          </button>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
