'use client';

import { useEffect, useState } from 'react';

interface WaitlistEntry {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  userType: string;
  city: string;
  consent: boolean;
  locale: string;
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
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Waitlist Entries</h1>
        <p className="text-white/60 mb-8">
          Total entries: {entries.length}
        </p>

        {entries.length === 0 ? (
          <div className="bg-white/5 rounded-xl p-8 text-center">
            <p className="text-white/60">No waitlist entries yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">ID</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Name</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Email</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Phone</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Type</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">City</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Locale</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Created</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-white/40 text-sm">{entry.id}</td>
                    <td className="py-3 px-4 text-white">{entry.name}</td>
                    <td className="py-3 px-4 text-white/80">{entry.email || '-'}</td>
                    <td className="py-3 px-4 text-white/80">{entry.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          entry.userType === 'buy'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {entry.userType === 'buy' ? 'Buyer' : 'Seller'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/80">{entry.city}</td>
                    <td className="py-3 px-4 text-white/60">{entry.locale}</td>
                    <td className="py-3 px-4 text-white/60 text-sm">
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
