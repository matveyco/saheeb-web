import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Saheeb',
    short_name: 'Saheeb',
    description: 'AI-native technology solutions for Oman',
    start_url: '/',
    display: 'standalone',
    background_color: '#211C28',
    theme_color: '#316BE9',
    orientation: 'portrait-primary',
    categories: ['business', 'technology'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  };
}
