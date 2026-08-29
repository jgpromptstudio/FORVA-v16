export interface FaqItem {
  question: string;
  answer: string;
}

export const faqsConfig: FaqItem[] = [
  {
    question: 'Does FORVA guarantee clients?',
    answer:
      'No. FORVA improves the process of discovering, researching, qualifying, contacting, and following up with potential clients. Results still depend on your offer, market, outreach quality, follow-through, and the prospect\u2019s decision.',
  },
  {
    question: 'Why isn\u2019t FORVA free?',
    answer:
      'FORVA uses databases, automation workflows, AI models, business research, contact verification, communication providers, monitoring, and support infrastructure whenever the system works for you.',
  },
  {
    question: 'Is usage unlimited?',
    answer:
      'No. Every plan includes a defined monthly allowance so FORVA can remain reliable and sustainable. You can upgrade, add approved capacity, or connect supported provider accounts.',
  },
  {
    question: 'Can I connect my Apollo or Hunter account?',
    answer:
      'Yes. Supported personal API connections can expand your capacity. Provider charges remain between you and that provider.',
  },
  {
    question: 'Are my API credentials visible in the browser?',
    answer:
      'No. Private credentials must be encrypted and handled only by secure backend services. The frontend displays connection status and masked identifiers only.',
  },
  {
    question: 'Can I cancel or change plans?',
    answer:
      'Yes. Subscription-management options will be available through the account billing settings once production payments are connected.',
  },
  {
    question: 'What happens when I reach my usage limit?',
    answer:
      'FORVA warns you before the limit is reached. You can wait for the next cycle, upgrade, purchase approved additional capacity, or use a supported personal provider connection.',
  },
];
