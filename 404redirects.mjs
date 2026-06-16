// 404 Redirects for voicestack.com
// - US (default locale): omit locale: false — Next.js i18n auto-handles default paths
// - en-GB / en-AU: keep locale: false when source already includes the locale prefix
// - Put locale-specific overrides before US rules (first match wins)
// permanent: false (302) — change to true once verified

/** @type {import('next/dist/lib/load-custom-routes').Redirect[]} */
const notFoundRedirects = [
  // ─── en-GB (locale prefix in source — locale: false required) ─────────────

  {
    source: '/en-GB/who-we-serve/groups-and-enterprises/veterinary-service-organizations-vso',
    destination: '/en-GB/who-we-serve/dental-groups-dsos-corporates',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-GB/phone-system/features/ivr-and-call-routing',
    destination: '/en-GB/dental-phones/features/ivr-and-call-routing',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-GB/dental-phones/ai-receptionist',
    destination: '/en-GB/dental-phones',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-GB/who-we-serve/startups',
    destination: '/en-GB/who-we-serve/squat-dental-practices',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-GB/phone-system/features/google-analytics-integration',
    destination: '/en-GB/dental-phones/features/google-analytics-integration',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-GB/dental-phones/dental-crm',
    destination: '/en-GB/dental-phones',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-GB/who-we-serve/multi-location-dental-practices',
    destination: '/en-GB/who-we-serve/multi-site-dental-practices',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-GB/phone-system/features/post-call-task-detection',
    destination: '/en-GB/dental-phones/features/post-call-task-detection',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-GB/phone-system',
    destination: '/en-GB/dental-phones',
    permanent: false,
    locale: false,
  },

  // ─── en-AU (locale prefix in source — locale: false required) ─────────────

  {
    source: '/en-AU/who-we-serve/groups-and-enterprises/veterinary-service-organizations-vso',
    destination: '/en-AU/who-we-serve/groups-and-dsos',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-AU/who-we-serve/multi-site-dental-practices',
    destination: '/en-AU/who-we-serve/multi-location-dental-practices',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-AU/who-we-serve/veterinary',
    destination: '/en-AU/who-we-serve',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-AU/phone-system/features/time-zone-management',
    destination: '/en-AU/dental-phones/features/time-zone-management',
    permanent: false,
    locale: false,
  },

  {
    source: '/en-AU/phone-system',
    destination: '/en-AU/dental-phones',
    permanent: false,
    locale: false,
  },

  // ─── US (default locale) ───────────────────────────────────────────────────

  {
    source: '/company/partners',
    destination: '/company',
    permanent: false,
  },

  {
    source: '/dental-phones/features/google-analytics-integration',
    destination: '/phone-system/features/google-analytics-integration',
    permanent: false,
  },

  {
    source: '/company/leadership',
    destination: '/company/leadership-team',
    permanent: false,
  },

  {
    source: '/dental-phones/features',
    destination: '/phone-system/features',
    permanent: false,
  },

  {
    source: '/dental-phones/features/marketing-spend-optimisation',
    destination: '/phone-system/features/marketing-spend-optimization',
    permanent: false,
  },

  {
    source: '/dental-phones/comparison',
    destination: '/phone-system/comparison',
    permanent: false,
  },

  {
    source: '/dental-phones/ai-receptionist',
    destination: '/phone-system/features/ai-receptionist',
    permanent: false,
  },

  {
    source: '/phone-system/features/attribution-and-analytics',
    destination: '/phone-system/features',
    permanent: false,
  },

  {
    source: '/dental-phones/reviews',
    destination: '/phone-system/reviews',
    permanent: false,
  },

  {
    source: '/dental-phones/integrations',
    destination: '/phone-system/integrations',
    permanent: false,
  },

  {
    source: '/who-we-serve/speciality-practices',
    destination: '/who-we-serve',
    permanent: false,
  },

  {
    source: '/who-we-serve/mobile-practices-v2',
    destination: '/who-we-serve',
    permanent: false,
  },

  {
    source: '/who-we-serve/specialists-v2',
    destination: '/who-we-serve',
    permanent: false,
  },

  {
    source: '/cloud-fax',
    destination: '/phone-system/features/cloud-fax',
    permanent: false,
  },

  {
    source: '/who-we-serve/startup-practices-v2',
    destination: '/who-we-serve',
    permanent: false,
  },

  {
    source: '/dental-software',
    destination: '/phone-system',
    permanent: false,
  },

  {
    source: '/who-we-serve/landing-v2',
    destination: '/who-we-serve',
    permanent: false,
  },

  {
    source: '/who-we-serve/startup-practices',
    destination: '/who-we-serve',
    permanent: false,
  },

  {
    source: '/why-voicestack',
    destination: '/who-we-serve/why-voicestack',
    permanent: false,
  },

  {
    source: '/example-page-1',
    destination: '/',
    permanent: false,
  },

  {
    source: '/example-page-2',
    destination: '/',
    permanent: false,
  },
];

export default notFoundRedirects;
