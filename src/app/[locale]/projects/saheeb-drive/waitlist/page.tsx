import { permanentRedirect } from 'next/navigation';

interface WaitlistAliasPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function appendSearchParam(
  query: URLSearchParams,
  key: string,
  value: string | string[] | undefined
) {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => query.append(key, entry));
    return;
  }

  query.set(key, value);
}

export default async function WaitlistAliasPage({
  params,
  searchParams,
}: WaitlistAliasPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const query = new URLSearchParams();

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    appendSearchParam(query, key, value);
  });

  query.set('focus', 'waitlist');

  permanentRedirect(
    `/${locale}/projects/saheeb-drive?${query.toString()}#drive-waitlist-form`
  );
}
