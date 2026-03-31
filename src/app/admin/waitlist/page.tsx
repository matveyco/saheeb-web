'use client';

import { useEffect, useState } from 'react';

interface WaitlistEntry {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  userType: string;
  city: string;
  consent: boolean;
  locale: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  referrer: string | null;
  landingPath: string | null;
  countryCode: string | null;
  consentTimestamp: string;
  createdAt: string;
}

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch('/api/admin/waitlist');

        if (response.status === 401) {
          setError('Unauthorized - check credentials');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await response.json();
        setEntries(data.entries);
      } catch {
        setError('Failed to load waitlist entries');
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-[#8F8F96]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Waitlist Entries</h1>
        <p className="text-[#8F8F96] mb-8">
          Total entries: {entries.length}
        </p>

        {entries.length === 0 ? (
          <div className="bg-[#19191B] rounded-xl p-8 text-center">
            <p className="text-[#8F8F96]">No waitlist entries yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#222225]">
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">ID</th>
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">Name</th>
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">Email</th>
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">Phone</th>
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">Type</th>
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">Attribution</th>
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">Country</th>
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">Locale</th>
                  <th className="text-left py-3 px-4 text-[#8F8F96] font-medium text-sm">Created</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#1A1A1D] hover:bg-[#19191B] transition-colors"
                  >
                    <td className="py-3 px-4 text-[#5C5C63] text-sm">{entry.id}</td>
                    <td className="py-3 px-4 text-white">{entry.name}</td>
                    <td className="py-3 px-4 text-white/80">{entry.email || '-'}</td>
                    <td className="py-3 px-4 text-white/80">{entry.phone || '-'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          entry.userType === 'buyer'
                            ? 'bg-blue-500/20 text-blue-400'
                            : entry.userType === 'seller'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {entry.userType === 'buyer'
                          ? 'Buyer'
                          : entry.userType === 'seller'
                            ? 'Seller'
                            : 'Legacy'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/80 text-sm">
                      <div>{entry.utmSource || '-'}</div>
                      <div className="text-[#5C5C63]">
                        {entry.utmCampaign || entry.landingPath || entry.city}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/80">
                      {entry.countryCode || '-'}
                    </td>
                    <td className="py-3 px-4 text-[#8F8F96]">{entry.locale}</td>
                    <td className="py-3 px-4 text-[#8F8F96] text-sm">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
