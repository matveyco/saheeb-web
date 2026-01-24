import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Saheeb',
    short_name: 'Saheeb',
    description: 'AI-native technology solutions for Oman',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0E1A',
    theme_color: '#D4AF37',
    orientation: 'portrait-primary',
    categories: ['business', 'technology'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
