/**
 * Formats a phone number for display (e.g., 0812-3456-7890)
 */
export function formatPhoneForDisplay(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('62')) {
    clean = '0' + clean.substring(2);
  }
  if (clean.length <= 4) return clean;
  if (clean.length <= 8) return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8)}`;
}
