import { Metadata } from 'next';
import { fetchApi } from '@/lib/api';
import PosClient from './PosClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cashier Mode - Generate QR Stempel | Loyalti',
  description: 'Mode Cashier untuk menghasilkan QR code stempel loyalitas pelanggan via ponsel atau terminal kasir.',
};

interface ApiMerchant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  pointSystems: Array<{
    id: string;
    name: string;
    ruleType: string;
    pointsPerUnit: number;
    amountPerPoint: number;
    icon: string;
    isActive: boolean;
  }>;
}

export default async function PosPage() {
  let merchants: ApiMerchant[] = [];

  try {
    const res = await fetchApi('/api/merchants');
    if (res.ok) {
      const data = await res.json();
      merchants = data.merchants || [];
    }
  } catch {
    // API offline
  }

  return (
    <PosClient
      initialMerchants={merchants.map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        logoUrl: m.logoUrl,
        pointSystems: m.pointSystems
          .filter((ps) => ps.isActive)
          .map((ps) => ({
            id: ps.id,
            name: ps.name,
            ruleType: ps.ruleType,
            pointsPerUnit: ps.pointsPerUnit,
            amountPerPoint: ps.amountPerPoint,
            icon: ps.icon,
          })),
      }))}
    />
  );
}
