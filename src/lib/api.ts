import { cookies } from 'next/headers';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export async function fetchApi(path: string, init?: RequestInit): Promise<Response> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const headers = new Headers(init?.headers);
  if (cookieHeader && !headers.has('cookie')) {
    headers.set('cookie', cookieHeader);
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
}
