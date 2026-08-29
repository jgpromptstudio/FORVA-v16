export interface BillingPlan {
  name: string;
  price: string;
  period: string;
  renewalDate: string;
}

export const currentPlan: BillingPlan = {
  name: 'Growth',
  price: '$69',
  period: '/month',
  renewalDate: 'September 27, 2026',
};

export const usageData = {
  creditsUsed: 6800,
  creditsTotal: 10000,
  percentage: 68,
  warning80: 8000,
  warning95: 9500,
};

export interface UsageHistoryItem {
  month: string;
  credits: number;
  percentage: number;
}

export const usageHistory: UsageHistoryItem[] = [
  { month: 'Mar', credits: 4200, percentage: 42 },
  { month: 'Apr', credits: 5100, percentage: 51 },
  { month: 'May', credits: 5800, percentage: 58 },
  { month: 'Jun', credits: 6200, percentage: 62 },
  { month: 'Jul', credits: 6500, percentage: 65 },
  { month: 'Aug', credits: 6800, percentage: 68 },
];

export interface ProviderUsage {
  name: string;
  used: number;
  total: number;
  type: 'FORVA-managed' | 'Customer-connected';
}

export const providerUsage: ProviderUsage[] = [
  { name: 'OpenAI', used: 2400, total: 4000, type: 'FORVA-managed' },
  { name: 'Apollo', used: 1800, total: 3000, type: 'FORVA-managed' },
  { name: 'Resend', used: 1200, total: 2000, type: 'FORVA-managed' },
  { name: 'Hunter', used: 800, total: 1000, type: 'Customer-connected' },
];

export interface ConnectedApi {
  name: string;
  status: 'Connected' | 'Not Connected';
  maskedKey: string;
  type: 'FORVA-managed' | 'Customer-connected';
}

export const connectedApis: ConnectedApi[] = [
  { name: 'Apollo', status: 'Connected', maskedKey: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20224X7P', type: 'Customer-connected' },
  { name: 'Hunter', status: 'Connected', maskedKey: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20229K2M', type: 'Customer-connected' },
  { name: 'OpenAI', status: 'Connected', maskedKey: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022A3F8', type: 'FORVA-managed' },
  { name: 'Resend', status: 'Not Connected', maskedKey: '\u2014', type: 'FORVA-managed' },
];

export const byoApiPanelCopy =
  'When a supported personal provider account is connected, that provider\u2019s usage is billed directly to the customer while FORVA continues managing orchestration, qualification, workflow state, and safety controls.';
