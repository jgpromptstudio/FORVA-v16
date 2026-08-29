import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Privacy Policy"
      intro="This Privacy Policy explains how FORVA handles information in connection with the FORVA client acquisition service."
    >
      <LegalSection heading="1. Information FORVA May Process">
        <p>When you use FORVA, the service may process the following types of information:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Account and profile information, such as your name and email address used for authentication.</li>
          <li>Authentication information, including credentials used to sign in securely.</li>
          <li>Subscription and billing-related account data, such as your active plan and credit usage.</li>
          <li>Campaign settings, including targeting criteria and outreach configuration you create.</li>
          <li>Prospect and business information supplied or discovered through the service, such as business names, domains, and professional contact details.</li>
          <li>Outreach activity, including messages prepared and sent through the platform.</li>
          <li>Usage and diagnostic information, such as feature interactions and error reports that help keep the service running.</li>
          <li>Communications with FORVA, such as support requests and account-related correspondence.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. Why Information Is Processed">
        <p>FORVA processes information for the following purposes:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Providing the service, including discovery, qualification, enrichment, verification, outreach, and follow-up workflows.</li>
          <li>Authenticating your account and maintaining secure sessions.</li>
          <li>Running client and prospect acquisition workflows on your behalf.</li>
          <li>Administering your account, including plan management and credit tracking.</li>
          <li>Preventing fraud and protecting the security of the platform.</li>
          <li>Providing support and resolving issues.</li>
          <li>Improving the service over time.</li>
          <li>Meeting legal obligations where applicable.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Prospect and Business Data">
        <p>
          As part of client-acquisition workflows, FORVA may process business and professional prospect
          information. This includes business names, websites, professional contact details, and
          qualification data gathered or enriched through supported providers. This information is
          processed to perform the acquisition work you request.
        </p>
        <p>
          FORVA does not treat all discovered prospect information as private consumer information. Much
          of the prospect data processed through the service consists of publicly available business and
          professional information. You are responsible for using prospect data in a manner that is
          lawful and appropriate for your use case.
        </p>
      </LegalSection>

      <LegalSection heading="4. Service Providers">
        <p>
          FORVA relies on third-party infrastructure and API providers to operate the service. These may
          include hosting, database, authentication, email delivery, and data enrichment providers.
          These providers may process information on FORVA&apos;s behalf when necessary to deliver the
          service.
        </p>
        <p>
          FORVA does not transfer your information to third parties for their own marketing purposes. The
          specific providers used may change as the service evolves.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data Retention">
        <p>
          FORVA retains information only as long as reasonably necessary for service operation, account
          requirements, legal obligations, and legitimate operational purposes. Account data and
          campaign records are retained while your account is active. After account closure, data may be
          retained for a limited period to address disputes, comply with legal obligations, or maintain
          operational integrity, after which it is removed or anonymized.
        </p>
      </LegalSection>

      <LegalSection heading="6. Security">
        <p>
          FORVA uses technical and operational safeguards appropriate to the service, including
          authenticated access, separation of public and authenticated areas, and controlled access to
          account data. Security is an ongoing process and FORVA continually works to improve its systems.
        </p>
        <p>
          No system can guarantee complete security. FORVA does not claim any specific security
          certification unless explicitly verified and stated.
        </p>
      </LegalSection>

      <LegalSection heading="7. Your Choices">
        <p>You may have the following options regarding your information:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Accessing your account information through your dashboard settings.</li>
          <li>Correcting profile information within your account.</li>
          <li>Requesting deletion of your account and associated data by contacting FORVA support.</li>
          <li>Managing campaign settings and suppression lists within the platform.</li>
        </ul>
        <p>
          If you wish to access, correct, or delete your information, or if you have questions about how
          your data is handled, you can contact FORVA through the{' '}
          <button
            onClick={() => navigate('/contact')}
            className="text-primary underline-offset-4 hover:underline"
          >
            contact page
          </button>
          .
        </p>
      </LegalSection>

      <LegalSection heading="8. International Processing">
        <p>
          FORVA uses cloud-based infrastructure, and your information may be processed in jurisdictions
          different from your own. By using the service, you acknowledge that your information may be
          transferred to and processed in countries where FORVA&apos;s infrastructure providers operate,
          subject to applicable legal requirements.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to This Policy">
        <p>
          FORVA may update this Privacy Policy from time to time. When material changes are made, the
          updated policy will be posted with a revised &quot;Last updated&quot; date. Continued use of the
          service after changes are posted constitutes acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact">
        <p>
          If you have questions about this Privacy Policy or how FORVA handles your information, please
          visit the{' '}
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
