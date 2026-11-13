import { Metadata } from 'next';
import { fetchApi } from '@/lib/api';
import ManageClient from './ManageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Merchant Portal - Manajemen Poin & Hadiah | Loyalti',
  description: 'Portal Merchant untuk kelola promosi, riwayat transaksi stempel, katalog reward, dan konfigurasi toko.',
};

interface ApiMerchant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  fonnteToken: string | null;
  qrExpiryMinutes: number | null;
  apiKey: string | null;
  description: string | null;
  promotions: Array<{
    id: string;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string;
    isActive: boolean;
  }>;
  pointSystems: Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string;
    ruleType: string;
    pointsPerUnit: number;
    amountPerPoint: number;
    minSpendAmount: number | null;
    maxPointsPerTx: number | null;
    pointValidityDays: number;
    startAt: string;
    endAt: string;
    isActive: boolean;
  }>;
  rewards: Array<{
    id: string;
    title: string;
    description: string | null;
    pointsCost: number;
    quota: number | null;
    redeemedCount: number;
    voucherValidityDays: number;
    startAt: string;
    endAt: string;
    isActive: boolean;
    pointSystemId: string | null;
  }>;
  _count: {
    wallets: number;
    claimTokens: number;
    redemptions: number;
  };
}

export default async function ManagePage() {
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
    <ManageClient
      initialMerchants={merchants.map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        logoUrl: m.logoUrl,
        primaryColor: m.primaryColor,
        fonnteToken: m.fonnteToken,
        qrExpiryMinutes: m.qrExpiryMinutes || 15,
        apiKey: m.apiKey,
        description: m.description,
        promotions: m.promotions.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          startAt: p.startAt,
          endAt: p.endAt,
          isActive: p.isActive,
        })),
        pointSystems: m.pointSystems.map((ps) => ({
          id: ps.id,
          name: ps.name,
          description: ps.description,
          icon: ps.icon,
          ruleType: ps.ruleType,
          pointsPerUnit: ps.pointsPerUnit,
          amountPerPoint: ps.amountPerPoint,
          minSpendAmount: ps.minSpendAmount,
          maxPointsPerTx: ps.maxPointsPerTx,
          pointValidityDays: ps.pointValidityDays,
          startAt: ps.startAt,
          endAt: ps.endAt,
          isActive: ps.isActive,
        })),
        rewards: m.rewards.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          pointsCost: r.pointsCost,
          quota: r.quota,
          redeemedCount: r.redeemedCount,
          voucherValidityDays: r.voucherValidityDays,
          startAt: r.startAt,
          endAt: r.endAt,
          isActive: r.isActive,
          pointSystemId: r.pointSystemId,
        })),
        stats: {
          customersCount: m._count.wallets,
          claimsCount: m._count.claimTokens,
          redemptionsCount: m._count.redemptions,
        },
      }))}
    />
  );
}
