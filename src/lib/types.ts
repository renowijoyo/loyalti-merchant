export interface SerializedPhoneLink {
  id: string;
  phone: string;
  label: string | null;
  createdAt: string;
}

export interface SerializedWallet {
  id: string;
  customerPhone: string;
  totalPoints: number;
  lifetimePoints: number;
  merchant: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    primaryColor: string;
  };
  activeBatches: Array<{
    id: string;
    pointsRemaining: number;
    expiresAt: string | null;
    createdAt: string;
  }>;
}

export interface SerializedTransaction {
  id: string;
  type: 'EARN' | 'REDEEM';
  points: number;
  phone: string;
  merchant: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    primaryColor: string;
  };
  title: string;
  subtitle: string | null;
  transactionAmount: number | null;
  billReference: string | null;
  voucherCode: string | null;
  status: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface CustomerAccountOverview {
  account: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
  };
  phoneLinks: SerializedPhoneLink[];
  summary: {
    totalActivePoints: number;
    totalLifetimePoints: number;
    merchantsCount: number;
    boundNumbersCount: number;
    transactionsCount: number;
  };
  wallets: SerializedWallet[];
  transactions: SerializedTransaction[];
}
