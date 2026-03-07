import { MetadataRoute } from 'next';

const baseUrl = 'https://saheeb.com';

const staticPages = [
  '',
  '/services',
  '/projects',
  '/projects/saheeb-drive',
  '/projects/saheeb-drive/waitlist',
  '/contact',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Generate entries for both locales
  staticPages.forEach((page) => {
    // English version
    routes.push({
      url: `${baseUrl}/en${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly',
      priority: page === '' ? 1.0 : page.includes('projects') ? 0.9 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page}`,
          ar: `${baseUrl}/ar${page}`,
        },
      },
    });

    // Arabic version
    routes.push({
      url: `${baseUrl}/ar${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly',
      priority: page === '' ? 1.0 : page.includes('projects') ? 0.9 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page}`,
          ar: `${baseUrl}/ar${page}`,
        },
      },
    });
  });

  return routes;
}
