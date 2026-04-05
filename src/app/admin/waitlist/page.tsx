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
  pageVariant: string | null;
  intentSource: string | null;
  consentTimestamp: string;
  createdAt: string;
}

interface SummaryCounts {
  drivePageViews: number;
  waitlistViews: number;
  ctaClicks: number;
  formStarts: number;
  submitAttempts: number;
  submitSuccesses: number;
  duplicateSubmits: number;
  validationErrors: number;
  leads: number;
  uniqueReachableLeads: number;
}

interface BreakdownItem extends SummaryCounts {
  label: string;
}

interface AnalyticsWindow {
  days: number;
  totals: SummaryCounts;
  rates: {
    ctaFromView: number | null;
    waitlistFromClick: number | null;
    startFromWaitlistView: number | null;
    submitFromStart: number | null;
    submitFromAttempt: number | null;
    duplicateFromSubmit: number | null;
  };
  breakdowns: {
    normalizedSources: BreakdownItem[];
    sources: BreakdownItem[];
    campaigns: BreakdownItem[];
    locales: BreakdownItem[];
    countries: BreakdownItem[];
    intents: BreakdownItem[];
    pageVariants: BreakdownItem[];
  };
}

interface AnalyticsSummary {
  generatedAt: string;
  windows: AnalyticsWindow[];
}

function formatRate(value: number | null) {
  if (value === null) {
    return '—';
  }

  return `${(value * 100).toFixed(value >= 0.1 ? 0 : 1)}%`;
}

function BreakdownTable({
  title,
  items,
}: {
  title: string;
  items: BreakdownItem[];
}) {
  return (
    <div className="rounded-2xl border border-[#222225] bg-[#111113] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#EDEDEF]">
          {title}
        </h3>
        <span className="text-xs text-[#5C5C63]">Top {items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[#5C5C63]">No data yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="py-2 pe-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-[#5C5C63]">
                  Label
                </th>
                <th className="py-2 pe-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-[#5C5C63]">
                  Leads
                </th>
                <th className="py-2 pe-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-[#5C5C63]">
                  Submits
                </th>
                <th className="py-2 pe-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-[#5C5C63]">
                  Starts
                </th>
                <th className="py-2 text-left text-xs font-medium uppercase tracking-[0.12em] text-[#5C5C63]">
                  Clicks
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.label} className="border-b border-[#1A1A1D]/60">
                  <td className="py-3 pe-4 text-sm text-white">{item.label}</td>
                  <td className="py-3 pe-4 text-sm text-[#D0D0D5]">
                    {item.leads}
                  </td>
                  <td className="py-3 pe-4 text-sm text-[#D0D0D5]">
                    {item.submitSuccesses}
                  </td>
                  <td className="py-3 pe-4 text-sm text-[#D0D0D5]">
                    {item.formStarts}
                  </td>
                  <td className="py-3 text-sm text-[#D0D0D5]">
                    {item.ctaClicks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
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
        setAnalytics(data.analytics);
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
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-white">
          Waitlist Entries
        </h1>
        <p className="mb-2 text-[#8F8F96]">
          Total entries: {entries.length}
        </p>
        <p className="mb-8 text-sm text-[#5C5C63]">
          Analytics snapshot:{' '}
          {analytics
            ? new Date(analytics.generatedAt).toLocaleString()
            : 'Loading'}
        </p>

        {analytics ? (
          <div className="mb-10 space-y-8">
            {analytics.windows.map((window) => (
              <section
                key={window.days}
                className="rounded-[2rem] border border-[#222225] bg-[#0D0D10] p-6"
              >
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Last {window.days} Days
                    </h2>
                    <p className="text-sm text-[#8F8F96]">
                      First-party funnel summary across views, starts, submits,
                      duplicates, and lead creation.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {[
                    ['Unique leads', window.totals.uniqueReachableLeads],
                    ['Raw leads', window.totals.leads],
                    ['Drive views', window.totals.drivePageViews],
                    ['CTA clicks', window.totals.ctaClicks],
                    ['Form starts', window.totals.formStarts],
                    ['Submit attempts', window.totals.submitAttempts],
                    ['Submit successes', window.totals.submitSuccesses],
                    ['Duplicates', window.totals.duplicateSubmits],
                    ['Validation errors', window.totals.validationErrors],
                    ['Waitlist views', window.totals.waitlistViews],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[#1A1A1D] bg-[#111113] p-4"
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5C63]">
                        {label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    ['CTA from view', formatRate(window.rates.ctaFromView)],
                    [
                      'Waitlist view from CTA',
                      formatRate(window.rates.waitlistFromClick),
                    ],
                    [
                      'Start from waitlist view',
                      formatRate(window.rates.startFromWaitlistView),
                    ],
                    ['Submit from start', formatRate(window.rates.submitFromStart)],
                    [
                      'Submit from attempt',
                      formatRate(window.rates.submitFromAttempt),
                    ],
                    [
                      'Duplicate share',
                      formatRate(window.rates.duplicateFromSubmit),
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[#1A1A1D] bg-[#111113] p-4"
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5C63]">
                        {label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  <BreakdownTable
                    title="Normalized Sources"
                    items={window.breakdowns.normalizedSources}
                  />
                  <BreakdownTable
                    title="Campaigns"
                    items={window.breakdowns.campaigns}
                  />
                  <BreakdownTable
                    title="Page Variants"
                    items={window.breakdowns.pageVariants}
                  />
                  <BreakdownTable
                    title="Intent Mix"
                    items={window.breakdowns.intents}
                  />
                  <BreakdownTable
                    title="Locales"
                    items={window.breakdowns.locales}
                  />
                  <BreakdownTable
                    title="Countries"
                    items={window.breakdowns.countries}
                  />
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {entries.length === 0 ? (
          <div className="rounded-xl bg-[#19191B] p-8 text-center">
            <p className="text-[#8F8F96]">No waitlist entries yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="border-b border-[#222225]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Variant</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Attribution</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Country</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Locale</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#8F8F96]">Created</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#1A1A1D] transition-colors hover:bg-[#19191B]"
                  >
                    <td className="px-4 py-3 text-sm text-[#5C5C63]">{entry.id}</td>
                    <td className="px-4 py-3 text-white">{entry.name}</td>
                    <td className="px-4 py-3 text-white/80">
                      {entry.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-white/80">
                      {entry.phone || '-'}
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-sm text-white/80">
                      {entry.pageVariant || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/80">
                      <div>{entry.utmSource || '-'}</div>
                      <div className="text-[#5C5C63]">
                        {entry.utmCampaign || entry.landingPath || entry.intentSource || entry.city}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/80">
                      {entry.countryCode || '-'}
                    </td>
                    <td className="px-4 py-3 text-[#8F8F96]">{entry.locale}</td>
                    <td className="px-4 py-3 text-sm text-[#8F8F96]">
                      {new Date(entry.createdAt).toLocaleString()}
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
