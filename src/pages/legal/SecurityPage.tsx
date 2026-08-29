import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';

export function SecurityPage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Security at FORVA"
      intro="Security is an ongoing process. FORVA uses technical and operational safeguards appropriate to the service while continually improving its systems."
    >
      <LegalSection heading="1. Authenticated Access">
        <p>
          FORVA separates public areas from authenticated areas. Account features are protected by
          authentication, and access to account data requires valid credentials. Public pages, such as
          the landing page and legal pages, do not expose account information.
        </p>
      </LegalSection>

      <LegalSection heading="2. Secure Infrastructure">
        <p>
          FORVA operates on cloud-based infrastructure providers. These providers offer their own
          security measures as part of their platform. FORVA does not publish internal implementation
          details, API keys, environment variables, or webhook secrets.
        </p>
      </LegalSection>

      <LegalSection heading="3. Controlled Access to Account Data">
        <p>
          Access to account data is controlled through authentication and authorization mechanisms.
          Users can only access their own account information and campaign data. Administrative access
          is restricted and separately controlled.
        </p>
      </LegalSection>

      <LegalSection heading="4. Operational Safeguards">
        <p>
          FORVA includes operational safeguards relevant to outreach, including suppression lists,
          duplicate protection, rate limiting, and human-review workflows. These safeguards help prevent
          unintended or abusive outreach and protect both users and recipients.
        </p>
      </LegalSection>

      <LegalSection heading="5. Monitoring and Error Handling">
        <p>
          FORVA monitors the service for errors and operational issues where supported. Error handling
          and diagnostic information are used to maintain and improve the platform. Sensitive
          information is not exposed in error messages or client-facing interfaces.
        </p>
      </LegalSection>

      <LegalSection heading="6. No Certifications Claimed">
        <p>
          FORVA does not claim SOC 2, ISO 27001, HIPAA, GDPR, or any other specific security
          certification unless explicitly verified and stated. Security practices are continually
          reviewed and improved.
        </p>
      </LegalSection>

      <LegalSection heading="7. Responsible Disclosure">
        <p>
          If you believe you have identified a security vulnerability in FORVA, please report it
          responsibly through the{' '}
          <button
            onClick={() => navigate('/contact')}
            className="text-primary underline-offset-4 hover:underline"
          >
            contact page
          </button>
          . Do not attempt to exploit or publicly disclose potential vulnerabilities before
          contacting FORVA.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
