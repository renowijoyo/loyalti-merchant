import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import ClaimClient from './ClaimClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Klaim Stempel Loyalitas | Loyalti',
  description: 'Klaim stempel dan reward kamu dengan mudah tanpa perlu install aplikasi.',
};

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const res = await fetchApi(`/api/claim/${encodeURIComponent(token)}`);
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error('Gagal memuat info stempel dari Loyalti API');
  }

  const data = await res.json();

  return (
    <ClaimClient
      token={token}
      initialTokenData={{
        points: data.points,
        billReference: data.billReference,
        status: data.status,
        claimedByPhone: data.claimedByPhone ?? null,
        expiresAt: data.expiresAt,
        merchant: {
          name: data.merchant.name,
          slug: data.merchant.slug,
          logoUrl: data.merchant.logoUrl,
          primaryColor: data.merchant.primaryColor,
          description: data.merchant.description,
        },
        pointSystem: {
          name: data.pointSystem.name,
          icon: data.pointSystem.icon,
          pointValidityDays: data.pointSystem.pointValidityDays,
        },
        rewards: (data.rewards || []).map((r: {
          id: string;
          title: string;
          description: string | null;
          pointsCost: number;
        }) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          pointsCost: r.pointsCost,
        })),
      }}
    />
  );
}
