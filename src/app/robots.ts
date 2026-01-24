import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/en/style-guide', '/ar/style-guide'],
      },
    ],
    sitemap: 'https://saheeb.com/sitemap.xml',
  };
}
