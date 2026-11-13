import { Metadata } from 'next';
import { fetchApi } from '@/lib/api';
import type { CustomerAccountOverview } from '@/lib/types';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Akun Pelanggan | Loyalti',
  description:
    'Buat atau masuk akun pelanggan dengan email, hubungkan nomor WhatsApp, dan pantau poin serta riwayat transaksi Anda.',
};

export default async function AccountPage() {
  let initialOverview: CustomerAccountOverview | null = null;

  try {
    const res = await fetchApi('/api/customer/me');
    if (res.ok) {
      const data = await res.json();
      initialOverview = data.overview ?? null;
    }
  } catch {
    // API offline or unauthenticated
  }

  return <AccountClient initialOverview={initialOverview} />;
}
