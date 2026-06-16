/** Shared locale alternate mapping — used by sitemap and HTML hreflang. */
export const LOCALE_ALTERNATE_MAP: Record<string, Record<string, string>> = {
  'phone-system': {
    en: 'phone-system',
    'en-AU': 'dental-phones',
    'en-GB': 'dental-phones',
  },
  'phone-system/features': {
    en: 'phone-system/features',
    'en-AU': 'dental-phones/features',
    'en-GB': 'dental-phones/features',
  },
  'phone-system/reviews': {
    en: 'phone-system/reviews',
    'en-AU': 'dental-phones/reviews',
    'en-GB': 'dental-phones/reviews',
  },
  'phone-system/integrations': {
    en: 'phone-system/integrations',
    'en-AU': 'dental-phones/integrations',
    'en-GB': 'dental-phones/integrations',
  },
  'phone-system/comparison': {
    en: 'phone-system/comparison',
    'en-AU': 'dental-phones/comparison',
    'en-GB': 'dental-phones/comparison',
  },
  'phone-system/case-studies': {
    en: 'phone-system/case-studies',
    'en-AU': 'dental-phones/case-studies',
    'en-GB': 'dental-phones/case-studies',
  },
  'phone-system/phones': {
    en: 'phone-system/phones',
    'en-AU': 'dental-phones/phones',
    'en-GB': 'dental-phones/phones',
  },
  'ai-receptionist': {
    en: 'phone-system/features/ai-receptionist',
    'en-AU': 'dental-phones/ai-receptionist',
    'en-GB': 'dental-phones/features/ai-receptionist',
  },
  'marketing-spend-optimization': {
    en: 'phone-system/features/marketing-spend-optimization',
    'en-AU': 'dental-phones/features/marketing-spend-optimisation',
    'en-GB': 'dental-phones/features/marketing-spend-optimisation',
  },
  'who-we-serve/multi-location-dental-practices': {
    en: 'who-we-serve/multi-location-dental-practices',
    'en-AU': 'who-we-serve/multi-location-dental-practices',
    'en-GB': 'who-we-serve/multi-site-dental-practices',
  },
  'who-we-serve/single-location-dental-practices': {
    en: 'who-we-serve/single-location-dental-practices',
    'en-AU': 'who-we-serve/single-location-dental-practices',
    'en-GB': 'who-we-serve/single-site-dental-practices',
  },
  'who-we-serve/groups-dsos': {
    en: 'who-we-serve/groups-and-enterprises',
    'en-AU': 'who-we-serve/groups-and-dsos',
    'en-GB': 'who-we-serve/dental-groups-dsos-corporates',
  },
  'who-we-serve/startups': {
    en: 'who-we-serve/startups',
    'en-AU': 'who-we-serve/startups',
    'en-GB': 'who-we-serve/squat-dental-practices',
  },
}

export const PATH_TO_CANONICAL: Record<string, string> = {
  'phone-system': 'phone-system',
  'dental-phones': 'phone-system',
  'phone-system/features': 'phone-system/features',
  'dental-phones/features': 'phone-system/features',
  'phone-system/reviews': 'phone-system/reviews',
  'dental-phones/reviews': 'phone-system/reviews',
  'phone-system/integrations': 'phone-system/integrations',
  'dental-phones/integrations': 'phone-system/integrations',
  'phone-system/comparison': 'phone-system/comparison',
  'dental-phones/comparison': 'phone-system/comparison',
  'phone-system/case-studies': 'phone-system/case-studies',
  'dental-phones/case-studies': 'phone-system/case-studies',
  'phone-system/phones': 'phone-system/phones',
  'dental-phones/phones': 'phone-system/phones',
  'phone-system/features/ai-receptionist': 'ai-receptionist',
  'phone-system/ai-receptionist': 'ai-receptionist',
  'dental-phones/ai-receptionist': 'ai-receptionist',
  'dental-phones/features/ai-receptionist': 'ai-receptionist',
  'phone-system/features/marketing-spend-optimization': 'marketing-spend-optimization',
  'phone-system/features/marketing-spend-optimisation': 'marketing-spend-optimization',
  'dental-phones/features/marketing-spend-optimisation': 'marketing-spend-optimization',
  'dental-phones/features/marketing-spend-optimization': 'marketing-spend-optimization',
  'who-we-serve/multi-location-dental-practices': 'who-we-serve/multi-location-dental-practices',
  'who-we-serve/multi-site-dental-practices': 'who-we-serve/multi-location-dental-practices',
  'who-we-serve/single-location-dental-practices': 'who-we-serve/single-location-dental-practices',
  'who-we-serve/single-site-dental-practices': 'who-we-serve/single-location-dental-practices',
  'who-we-serve/dental-groups-dsos-corporates': 'who-we-serve/groups-dsos',
  'who-we-serve/groups-and-dsos': 'who-we-serve/groups-dsos',
  'who-we-serve/groups-and-enterprises': 'who-we-serve/groups-dsos',
  'who-we-serve/startups': 'who-we-serve/startups',
  'who-we-serve/squat-dental-practices': 'who-we-serve/startups',
}

export function getCanonicalKey(path: string): string | null {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '')
  return PATH_TO_CANONICAL[clean] ?? null
}
