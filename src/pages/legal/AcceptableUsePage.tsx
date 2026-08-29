import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';

export function AcceptableUsePage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Acceptable Use Policy"
      intro="This Acceptable Use Policy describes what you may and may not do while using FORVA. By using the service, you agree to comply with this policy."
    >
      <LegalSection heading="1. Purpose">
        <p>
          FORVA is designed for legitimate business outreach. This policy exists to protect the
          integrity of the platform, its users, and the recipients of outreach sent through the service.
        </p>
      </LegalSection>

      <LegalSection heading="2. Prohibited Activities">
        <p>You must not use FORVA to engage in any of the following:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Illegal activity of any kind.</li>
          <li>Phishing or fraudulent messaging.</li>
          <li>Impersonation or misrepresentation of your identity or affiliation.</li>
          <li>Harassment, threats, or abusive messaging.</li>
          <li>Deceptive outreach, including false claims or misleading subject lines.</li>
          <li>Distributing malware, viruses, or malicious content.</li>
          <li>Credential theft or unauthorized access to any system.</li>
          <li>Using purchased, leaked, or stolen credential lists.</li>
          <li>Abusive scraping or data harvesting beyond the service&apos;s intended use.</li>
          <li>Attempts to bypass suppression controls, rate limits, or other safeguards.</li>
          <li>Sending prohibited or unlawful content.</li>
          <li>Using FORVA to intentionally contact people who have opted out.</li>
          <li>Platform abuse, including automated abuse of features or resources.</li>
          <li>Misuse of third-party services connected to your account, including exceeding API limits or violating provider terms.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Enforcement">
        <p>
          FORVA may suspend or terminate accounts that violate this policy. FORVA may also investigate
          suspected violations and take action to protect the platform, its users, and third parties.
          Serious violations may result in immediate suspension without prior notice.
        </p>
      </LegalSection>

      <LegalSection heading="4. Reporting Violations">
        <p>
          If you become aware of misuse of FORVA or believe an account is violating this policy, you can
          report it through the{' '}
          <button
            onClick={() => navigate('/contact')}
            className="text-primary underline-offset-4 hover:underline"
          >
            contact page
          </button>
          .
        </p>
      </LegalSection>

      <LegalSection heading="5. Changes to This Policy">
        <p>
          FORVA may update this Acceptable Use Policy from time to time. Updated versions will be posted
          with a revised &quot;Last updated&quot; date.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
