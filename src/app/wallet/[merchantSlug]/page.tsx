import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import WalletClient from './WalletClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Kartu Stempel & Voucher | Loyalti',
  description: 'Cek saldo stempel loyalitas dan tukarkan voucher hadiah.',
};

interface ApiMerchant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  description: string | null;
  promotions: Array<{
    id: string;
    title: string;
    description: string | null;
    endAt: string;
  }>;
  rewards: Array<{
    id: string;
    title: string;
    description: string | null;
    pointsCost: number;
    voucherValidityDays: number;
    quota: number | null;
    redeemedCount: number;
  }>;
}

interface ApiBatch {
  id: string;
  pointsRemaining: number;
  expiresAt: string | null;
  notes: string | null;
  createdAt: string;
}

interface ApiRedemption {
  id: string;
  voucherCode: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  pointsSpent: number;
  reward: {
    title: string;
  };
}

export default async function WalletPage({
  params,
  searchParams,
}: {
  params: Promise<{ merchantSlug: string }>;
  searchParams: Promise<{ phone?: string }>;
}) {
  const { merchantSlug } = await params;
  const { phone: rawPhone } = await searchParams;

  const query = rawPhone ? `?phone=${encodeURIComponent(rawPhone)}` : '';
  const res = await fetchApi(`/api/wallet/${encodeURIComponent(merchantSlug)}${query}`);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error('Gagal memuat data kartu loyalitas dari Loyalti API');
  }

  const data: {
    merchant: ApiMerchant;
    wallet: { totalPoints: number; lifetimePoints: number } | null;
    customer: { phone: string; name?: string | null } | null;
    batches: ApiBatch[];
    redemptions: ApiRedemption[];
  } = await res.json();

  const { merchant, wallet, customer, batches = [], redemptions = [] } = data;

  return (
    <WalletClient
      merchant={{
        id: merchant.id,
        name: merchant.name,
        slug: merchant.slug,
        logoUrl: merchant.logoUrl,
        primaryColor: merchant.primaryColor,
        description: merchant.description,
        promotions: merchant.promotions.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          endAt: p.endAt,
        })),
        rewards: merchant.rewards.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          pointsCost: r.pointsCost,
          voucherValidityDays: r.voucherValidityDays,
          quota: r.quota,
          redeemedCount: r.redeemedCount,
        })),
      }}
      initialPhone={rawPhone || ''}
      initialCustomer={
        customer ? { phone: customer.phone, name: customer.name ?? null } : null
      }
      initialWallet={
        wallet
          ? { totalPoints: wallet.totalPoints, lifetimePoints: wallet.lifetimePoints }
          : { totalPoints: 0, lifetimePoints: 0 }
      }
      initialBatches={batches.map((b) => ({
        id: b.id,
        pointsRemaining: b.pointsRemaining,
        expiresAt: b.expiresAt,
        notes: b.notes,
        createdAt: b.createdAt,
      }))}
      initialRedemptions={redemptions.map((rd) => ({
        id: rd.id,
        voucherCode: rd.voucherCode,
        status: rd.status,
        expiresAt: rd.expiresAt,
        createdAt: rd.createdAt,
        rewardTitle: rd.reward.title,
        pointsSpent: rd.pointsSpent,
      }))}
    />
  );
}
