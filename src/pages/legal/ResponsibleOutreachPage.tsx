import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';

export function ResponsibleOutreachPage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Responsible Outreach"
      intro="FORVA is designed to support legitimate business outreach. This page explains the responsible-use principles that guide the platform and what we ask of every user."
    >
      <LegalSection heading="1. Our Philosophy">
        <p>
          FORVA provides safeguards and workflow tools that can support responsible outreach, but users
          remain responsible for ensuring their campaigns comply with laws and regulations applicable to
          them and their recipients. Laws vary by location, campaign type, and recipient jurisdiction.
          Using FORVA does not automatically make a campaign compliant with CAN-SPAM, GDPR, CASL, or any
          other law.
        </p>
      </LegalSection>

      <LegalSection heading="2. Accurate Sender Identity">
        <p>
          Use a real, identifiable sender name and email address. Do not mislead recipients about who is
          contacting them or the purpose of the message.
        </p>
      </LegalSection>

      <LegalSection heading="3. Respect Opt-Outs and Suppression Lists">
        <p>
          Respect opt-out requests promptly. FORVA provides suppression lists and deduplication
          safeguards to help prevent contacting people who have opted out. Do not intentionally bypass
          these safeguards.
        </p>
      </LegalSection>

      <LegalSection heading="4. Avoid Excessive or Repetitive Messaging">
        <p>
          Do not send excessive or repetitive messages to the same recipient. FORVA&apos;s follow-up system
          is designed to stop automatically on reply or opt-out. Do not attempt to override this behavior.
        </p>
      </LegalSection>

      <LegalSection heading="5. Use Relevant Targeting">
        <p>
          Target prospects who may reasonably benefit from your offer. Avoid contacting audiences that
          are clearly irrelevant to your service or that would reasonably consider your message
          unwelcome.
        </p>
      </LegalSection>

      <LegalSection heading="6. Comply With Laws and Provider Rules">
        <p>
          You are responsible for ensuring your outreach complies with applicable laws, regulations, and
          the rules of any email or communication provider you use. This includes consent requirements,
          sender identification, unsubscribe mechanisms, and content restrictions where applicable.
        </p>
      </LegalSection>

      <LegalSection heading="7. Do Not Bypass Safeguards">
        <p>
          FORVA includes safeguards such as suppression lists, duplicate protection, rate limiting, and
          review workflows. Do not attempt to bypass, disable, or circumvent these safeguards.
        </p>
      </LegalSection>

      <LegalSection heading="8. Maintain Records Where Necessary">
        <p>
          Depending on your jurisdiction and campaign type, you may be required to maintain records of
          consent, opt-outs, or outreach activity. You are responsible for keeping appropriate records
          where applicable to your situation.
        </p>
      </LegalSection>

      <LegalSection heading="9. Contact">
        <p>
          If you have questions about responsible outreach practices or wish to report a concern, please
          visit the{' '}
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
