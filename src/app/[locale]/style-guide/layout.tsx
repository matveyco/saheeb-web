import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design System | Saheeb Drive',
  description: 'Internal style guide for Saheeb Drive app developers and designers.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function StyleGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
