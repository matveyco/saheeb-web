export const SITE_CONFIG = {
  name: 'Saheeb',
  nameAr: 'صاحب',
  domain: 'saheeb.com',
  url: 'https://saheeb.com',
  email: 'contact@saheeb.com',
  // phone: '+968 9000 0000', // Placeholder - uncomment when available
  // whatsapp: 'https://wa.me/96890000000', // Placeholder - uncomment when available
  address: {
    en: 'Muscat, Oman',
    ar: 'مسقط، عمان',
  },
  // social: {
  //   linkedin: 'https://linkedin.com/company/saheeb',
  //   twitter: 'https://twitter.com/saheeb',
  // },
} as const;

export const SERVICES = [
  {
    id: 'build',
    icon: 'Rocket',
  },
  {
    id: 'ai',
    icon: 'Brain',
  },
  {
    id: 'grow',
    icon: 'TrendingUp',
  },
  {
    id: 'localize',
    icon: 'Globe',
  },
] as const;

export const VISION_2040_PILLARS = [
  {
    id: 'creative-individuals',
    icon: 'Users',
    color: 'blue',
  },
  {
    id: 'competitive-economy',
    icon: 'BarChart',
    color: 'green',
  },
  {
    id: 'responsible-agencies',
    icon: 'Shield',
    color: 'gold',
  },
  {
    id: 'sustainable-environment',
    icon: 'Leaf',
    color: 'emerald',
  },
] as const;

export const OMAN_CITIES = [
  { en: 'Muscat', ar: 'مسقط' },
  { en: 'Salalah', ar: 'صلالة' },
  { en: 'Sohar', ar: 'صحار' },
  { en: 'Nizwa', ar: 'نزوى' },
  { en: 'Sur', ar: 'صور' },
  { en: 'Ibri', ar: 'عبري' },
  { en: 'Barka', ar: 'بركاء' },
  { en: 'Rustaq', ar: 'الرستاق' },
  { en: 'Other', ar: 'أخرى' },
] as const;
