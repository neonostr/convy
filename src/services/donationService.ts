import { getDonationLnurlEndpoint } from '@/lib/brandDomain';

interface LNURLData {
  callback: string;
  maxSendable: number;
  minSendable: number;
  status?: string;
  reason?: string;
}

interface InvoiceData {
  pr: string;
  verify?: string;
}

// Donations go through the CashuGateway Lightning Address (LNURL-pay + LUD-21 verify),
// resolved per domain: convy@tip.neo21.dev on neo21.dev, convy@tip.neo21.io everywhere else.
export async function getLnurlData(): Promise<LNURLData> {
  const response = await fetch(getDonationLnurlEndpoint());
  if (!response.ok) {
    throw new Error(`Error retrieving LNURL data: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

export async function getInvoice(callbackUrl: string, amountMsat: number): Promise<InvoiceData> {
  const sep = callbackUrl.includes('?') ? '&' : '?';
  const response = await fetch(`${callbackUrl}${sep}amount=${amountMsat}`);
  if (!response.ok) {
    throw new Error(`Error generating invoice: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

export async function createDonationInvoice(amountSats: number): Promise<{ invoice: string; verifyUrl?: string }> {
  const lnurlData = await getLnurlData();
  if (!lnurlData || lnurlData.status === 'ERROR') {
    throw new Error(lnurlData?.reason || 'Donation service unavailable');
  }
  const amountMsat = Math.round(amountSats) * 1000;
  if (amountMsat < lnurlData.minSendable || amountMsat > lnurlData.maxSendable) {
    throw new Error(`Amount must be between ${lnurlData.minSendable / 1000} and ${lnurlData.maxSendable / 1000} sats`);
  }
  const invoiceData = await getInvoice(lnurlData.callback, amountMsat);
  if (!invoiceData?.pr) throw new Error('Failed to generate invoice');
  return { invoice: invoiceData.pr, verifyUrl: invoiceData.verify };
}
