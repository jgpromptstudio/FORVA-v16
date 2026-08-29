import { LegalLayout, LegalSection } from '@/components/LegalLayout';
import { useNavigate } from 'react-router-dom';

export function BillingPage() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title="Billing and Cancellation"
      intro="This page explains how subscriptions, FORVA Credits, and cancellation work in FORVA."
    >
      <LegalSection heading="1. Subscription Plans">
        <p>FORVA offers three subscription plans, each with a monthly FORVA Credit allowance:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Starter: $29/month, 500 FORVA Credits.</li>
          <li>Growth: $69/month, 1,250 FORVA Credits.</li>
          <li>Pro: $99/month, 1,800 FORVA Credits.</li>
        </ul>
        <p>
          Subscriptions are billed according to the checkout terms presented at the time of purchase.
          For a full comparison of plan features, see the{' '}
          <button
            onClick={() => navigate('/#pricing')}
            className="text-primary underline-offset-4 hover:underline"
          >
            pricing section
          </button>
          .
        </p>
      </LegalSection>

      <LegalSection heading="2. FORVA Credits">
        <p>
          FORVA Credits represent usage capacity inside the service. Different acquisition actions
          consume different credit amounts. For example, processing and qualifying a prospect, deep
          enrichment, and verified email discovery each consume credits according to the work performed.
        </p>
        <p>
          Credits do not represent cash or stored monetary value. They cannot be withdrawn, transferred,
          or exchanged for money. A typical fully processed prospect uses approximately 10 FORVA Credits.
        </p>
      </LegalSection>

      <LegalSection heading="3. Credit Top-Ups">
        <p>
          When your monthly credits run low or are exhausted, you can purchase additional FORVA Credit
          top-ups without changing your subscription plan. Top-ups provide extra usage capacity and are
          subject to availability.
        </p>
      </LegalSection>

      <LegalSection heading="4. Cancellation">
        <p>
          You may cancel your subscription through the billing settings in your account. Cancellation
          affects future renewals according to the subscription and checkout terms shown in your account.
        </p>
      </LegalSection>

      <LegalSection heading="5. Loss of Access and Remaining Credits">
        <p>
          If your subscription is cancelled or your account loses access for any reason, remaining
          FORVA Credits do not convert into cash or monetary value. Unused credits are forfeited when
          access ends.
        </p>
      </LegalSection>

      <LegalSection heading="6. Refunds">
        <p>
          Fees already charged are handled according to the terms presented at checkout and applicable
          law. Contact FORVA support if you believe a billing error occurred.
        </p>
      </LegalSection>

      <LegalSection heading="7. Contact">
        <p>
          For billing questions or support, please visit the{' '}
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
