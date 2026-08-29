import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Terms of Service"
      intro="These Terms of Service govern your use of the FORVA client acquisition platform. By creating an account or using the service, you agree to these terms."
    >
      <LegalSection heading="1. Eligibility and Account Responsibility">
        <p>
          You must be at least 18 years old and legally able to enter into contracts to use FORVA. You are
          responsible for maintaining the security of your account credentials and for all activity that
          occurs under your account.
        </p>
      </LegalSection>

      <LegalSection heading="2. FORVA Service Description">
        <p>
          FORVA is an AI-powered client acquisition tool that helps users discover, research, qualify,
          enrich, verify, contact, and follow up with potential clients. The service includes prospect
          discovery, business research, contact enrichment, email verification, outreach preparation,
          follow-up scheduling, and campaign tracking.
        </p>
        <p>
          FORVA is a tool that supports your acquisition workflow. Results depend on many factors,
          including your offer, market, targeting, outreach quality, follow-through, and the
          prospect&apos;s decision. FORVA does not guarantee clients, appointments, email accuracy,
          revenue, or prospect availability.
        </p>
      </LegalSection>

      <LegalSection heading="3. Subscription Plans and FORVA Credits">
        <p>
          FORVA offers subscription plans with monthly FORVA Credit allowances. Credits represent usage
          capacity within the service and are consumed by acquisition actions such as discovery,
          qualification, enrichment, verification, and outreach.
        </p>
        <p>
          Credits do not represent cash or stored monetary value. Different actions consume different
          credit amounts. When your monthly credits run low, you may purchase additional credit top-ups
          without changing your plan, subject to availability.
        </p>
        <p>
          For details on current plans and credit amounts, see the{' '}
          <button
            onClick={() => navigate('/#pricing')}
            className="text-primary underline-offset-4 hover:underline"
          >
            pricing section
          </button>
          .
        </p>
      </LegalSection>

      <LegalSection heading="4. Permitted Use">
        <p>
          You may use FORVA for legitimate business outreach to prospects who may reasonably benefit
          from your offer. You agree to use accurate sender identity, respect opt-outs and suppression
          lists, and comply with applicable laws and provider rules. See the{' '}
          <button
            onClick={() => navigate('/responsible-outreach')}
            className="text-primary underline-offset-4 hover:underline"
          >
            Responsible Outreach
          </button>{' '}
          page for guidance.
        </p>
      </LegalSection>

      <LegalSection heading="5. Prohibited Activity">
        <p>You must not use FORVA to engage in any of the following:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Illegal activity of any kind.</li>
          <li>Phishing, fraud, or deceptive outreach.</li>
          <li>Impersonation or misrepresentation of identity.</li>
          <li>Harassment or abusive messaging.</li>
          <li>Sending malware or malicious content.</li>
          <li>Credential theft or unauthorized access to systems.</li>
          <li>Using purchased or stolen credential lists.</li>
          <li>Abusive scraping or data harvesting beyond service-intended use.</li>
          <li>Attempts to bypass suppression controls, rate limits, or safeguards.</li>
          <li>Intentionally contacting people who have opted out.</li>
          <li>Misuse of third-party services connected to your account.</li>
        </ul>
        <p>
          A more detailed list of prohibited activities is available in the{' '}
          <button
            onClick={() => navigate('/acceptable-use')}
            className="text-primary underline-offset-4 hover:underline"
          >
            Acceptable Use Policy
          </button>
          .
        </p>
      </LegalSection>

      <LegalSection heading="6. Third-Party Services">
        <p>
          FORVA may integrate with third-party API providers for data enrichment, email verification,
          and outreach. You are responsible for any costs, terms, and compliance obligations associated
          with third-party services you connect to your account.
        </p>
      </LegalSection>

      <LegalSection heading="7. User Responsibility for Campaigns and Outreach">
        <p>
          You are responsible for the content, targeting, and legality of your outreach campaigns. FORVA
          provides tools and safeguards, but you remain responsible for ensuring your campaigns comply
          with laws and regulations applicable to you and your recipients.
        </p>
      </LegalSection>

      <LegalSection heading="8. Accuracy Limitations of Third-Party and Public Data">
        <p>
          Information discovered, enriched, or verified through FORVA may come from third-party
          providers or public sources. FORVA does not guarantee the accuracy, completeness, or
          timeliness of such data. You should independently verify critical information before relying
          on it.
        </p>
      </LegalSection>

      <LegalSection heading="9. Intellectual Property">
        <p>
          FORVA and its content, including the logo, interface, and software, are owned by FORVA and
          protected by applicable intellectual property laws. You retain ownership of the campaign
          content and outreach messages you create.
        </p>
      </LegalSection>

      <LegalSection heading="10. Service Availability">
        <p>
          FORVA strives to maintain reliable service but does not guarantee uninterrupted access. The
          service may experience downtime, maintenance, or disruptions. FORVA is not liable for
          outages or data loss caused by factors beyond its reasonable control.
        </p>
      </LegalSection>

      <LegalSection heading="11. Suspension or Termination for Abuse">
        <p>
          FORVA may suspend or terminate accounts that violate these Terms, the Acceptable Use Policy, or
          applicable law. FORVA may also take action to protect the integrity of the platform and other
          users.
        </p>
      </LegalSection>

      <LegalSection heading="12. Cancellation">
        <p>
          You may cancel your subscription through the billing settings in your account. Cancellation
          prevents future renewal. For details, see the{' '}
          <button
            onClick={() => navigate('/billing')}
            className="text-primary underline-offset-4 hover:underline"
          >
            Billing and Cancellation
          </button>{' '}
          page.
        </p>
      </LegalSection>

      <LegalSection heading="13. Limitation of Warranties">
        <p>
          FORVA is provided &quot;as is&quot; and &quot;as available.&quot; To the fullest extent permitted by law,
          FORVA disclaims all warranties, express or implied, including warranties of merchantability,
          fitness for a particular purpose, and non-infringement. FORVA does not warrant that the service
          will be error-free, secure, or available at all times.
        </p>
      </LegalSection>

      <LegalSection heading="14. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, FORVA shall not be liable for indirect, incidental,
          special, consequential, or punitive damages, or for loss of profits, data, or business
          opportunity, arising from your use of or inability to use the service. FORVA&apos;s aggregate
          liability shall not exceed the amount you paid for the service in the three months preceding
          the claim.
        </p>
      </LegalSection>

      <LegalSection heading="15. Changes to Service and Terms">
        <p>
          FORVA may modify the service and these Terms from time to time. Material changes to the Terms
          will be posted with a revised &quot;Last updated&quot; date. Continued use of the service after
          changes are posted constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="16. Contact">
        <p>
          If you have questions about these Terms, please visit the{' '}
          <button
            onClick={() => navigate('/contact')}
            className="text-primary underline-offset-4 hover:underline"
          >
            contact page
          </button>{' '}
          for available support options.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
