import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';

export function CookiesPage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Cookie Policy"
      intro="This Cookie Policy explains how FORVA uses browser storage and cookies to operate the service."
    >
      <LegalSection heading="1. Essential Storage">
        <p>
          FORVA uses browser storage and cookies that are strictly necessary for the service to
          function. This includes:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Authentication and session management, so you can sign in and remain signed in securely.</li>
          <li>Preference storage, such as remembering interface settings where applicable.</li>
        </ul>
        <p>
          These essential storage mechanisms are required for core functionality. Without them, the
          service cannot operate properly.
        </p>
      </LegalSection>

      <LegalSection heading="2. Analytics and Tracking">
        <p>
          FORVA does not currently use advertising cookies, marketing pixels, or third-party analytics
          trackers. If non-essential tracking is introduced in the future, this policy will be updated
          accordingly.
        </p>
      </LegalSection>

      <LegalSection heading="3. Third-Party Services">
        <p>
          Some third-party services used by FORVA, such as authentication and payment providers, may set
          their own cookies as part of their normal operation. These are governed by the respective
          provider&apos;s policies.
        </p>
      </LegalSection>

      <LegalSection heading="4. Managing Cookies">
        <p>
          You can control or delete cookies through your browser settings. Disabling essential cookies
          may prevent the service from functioning properly. Since FORVA does not use non-essential
          tracking at this time, no cookie consent banner is presented.
        </p>
      </LegalSection>

      <LegalSection heading="5. Changes to This Policy">
        <p>
          If FORVA introduces new cookie or storage usage, this policy will be updated with a revised
          &quot;Last updated&quot; date.
        </p>
      </LegalSection>

      <LegalSection heading="6. Contact">
        <p>
          For questions about this Cookie Policy, please visit the{' '}
          <button
            onClick={() => navigate('/contact')}
            className="text-primary underline-offset-4 hover:underline"
          >
            contact page
          </button>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
