import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import groq from 'groq'
import siteConfig from 'config/siteConfig'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://voicestack.com"

// Paths with all locale variants and hreflang alternates
const PATHS_WITH_ALTERNATES = ['', 'system-requirements'];

// Exclude list for test pages and patterns
const EXCLUDED_PATHS = [
  'who-we-serve/test-shakir',
  'who-we-serve/ref',
  'test2',
  'en-GB/test',
  'test',
  'search',
  'onboarding',
  'demo/thank-you',
  'pricing/thank-you',
  'en-AU/phone-system',
  'en/who-we-serve/multi-location-dental-practices'
];

// Paths that must not have their en (root) URL in sitemap; en-AU and en-GB versions still included
const PATHS_NO_EN_URL = [
  'who-we-serve/single-location-dental-practices',
  'who-we-serve/multi-location-dental-practices',
  'who-we-serve/groups-and-enterprises'
];

function shouldOmitEnUrl(path: string, locale: string): boolean {
  return locale === 'en' && PATHS_NO_EN_URL.includes(path);
}

// Paths that must not have en-GB URL in sitemap (pages don't exist for en-GB); en and en-AU still included
const PATHS_NO_EN_GB_URL = [
  'dental-phones/comparison',
  'dental-phones/case-studies',
  'phone-system/comparison',
  'phone-system/case-studies',
];

function shouldOmitEnGBUrl(path: string): boolean {
  return PATHS_NO_EN_GB_URL.includes(path);
}

// Locale-aware alternate mapping: canonical key -> path per locale (only include locales where this path exists)
const LOCALE_ALTERNATE_MAP: Record<string, Record<string, string>> = {
  'phone-system': {
    'en': 'phone-system',
    'en-AU': 'dental-phones',
    'en-GB': 'dental-phones',
  },
  'phone-system/features': {
    'en': 'phone-system/features',
    'en-AU': 'dental-phones/features',
    'en-GB': 'dental-phones/features',
  },
  'phone-system/reviews': { 'en': 'phone-system/reviews', 'en-AU': 'dental-phones/reviews', 'en-GB': 'dental-phones/reviews' },
  'phone-system/integrations': { 'en': 'phone-system/integrations', 'en-AU': 'dental-phones/integrations', 'en-GB': 'dental-phones/integrations' },
  'phone-system/comparison': { 'en': 'phone-system/comparison', 'en-AU': 'dental-phones/comparison', 'en-GB': 'dental-phones/comparison' },
  'phone-system/case-studies': { 'en': 'phone-system/case-studies', 'en-AU': 'dental-phones/case-studies', 'en-GB': 'dental-phones/case-studies' },
  'phone-system/phones': { 'en': 'phone-system/phones', 'en-AU': 'dental-phones/phones', 'en-GB': 'dental-phones/phones' },
  'ai-receptionist': {
    'en': 'phone-system/features/ai-receptionist',
    'en-AU': 'dental-phones/ai-receptionist',
    'en-GB': 'dental-phones/features/ai-receptionist',
  },
  'marketing-spend-optimization': {
    'en': 'phone-system/features/marketing-spend-optimization',
    'en-AU': 'dental-phones/features/marketing-spend-optimisation',
    'en-GB': 'dental-phones/features/marketing-spend-optimisation',
  },
  'who-we-serve/multi-location-dental-practices': {
    'en': 'who-we-serve/multi-location-dental-practices',
    'en-AU': 'who-we-serve/multi-location-dental-practices',
    'en-GB': 'who-we-serve/multi-site-dental-practices',
  },
  'who-we-serve/single-location-dental-practices': {
    'en': 'who-we-serve/single-location-dental-practices',
    'en-AU': 'who-we-serve/single-location-dental-practices',
    'en-GB': 'who-we-serve/single-site-dental-practices',
  },
  'who-we-serve/groups-dsos': {
    'en': 'who-we-serve/groups-and-enterprises',
    'en-AU': 'who-we-serve/groups-and-dsos',
    'en-GB': 'who-we-serve/dental-groups-dsos-corporates',
  },
  'who-we-serve/startups': {
    'en': 'who-we-serve/startups',
    'en-AU': 'who-we-serve/startups',
    'en-GB': 'who-we-serve/squat-dental-practices',
  },
}

// Path -> canonical key for resolving alternates (multiple paths can map to same key)
const PATH_TO_CANONICAL: Record<string, string> = {
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

function getCanonicalKey(path: string): string | null {
  return PATH_TO_CANONICAL[path] ?? null;
}

// Static pages that should be included in sitemap (pages not managed in Sanity)
// Format: { path: string[], locales: string[] }
const STATIC_PAGES: Array<{ path: string; locales: string[] }> = [
  { path: 'company/leadership-team', locales: ['en', 'en-AU'] },
]


interface NavigationLink {
  label?: string
  href?: string
  link?: string
  text?: string
  submenu?: NavigationLink[]
}

interface FooterColumn {
  title?: string
  titleLink?: string
  links?: NavigationLink[]
}

interface HeaderData {
  language: string
  navigationMenu?: NavigationLink[]
  topNavigationMenu?: NavigationLink[]
}

interface FooterData {
  language: string
  footerColumns?: FooterColumn[]
  bottomLinks?: NavigationLink[]
}

function formatHreflang(locale: string): string {
  const localeMap: { [key: string]: string } = {
    'en': 'en-US',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    '': 'en'
  };
  return localeMap[locale] || 'en';
}

function formatLastmod(date: string | Date | null | undefined): string | null {
  if (!date) {
    return null;
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return null;
  }
  
  // Format as YYYY-MM-DDThh:mm:ss+00:00 (sitemap standard with time)
  // ISO 8601 format is accepted by sitemap protocol
  return dateObj.toISOString();
}

/**
 * Sanitizes a path for use in URLs: lowercase, spaces to hyphens, collapse multiple hyphens.
 */
function sanitizePathForUrl(path: string): string {
  return path
    .split('/')
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    )
    .filter(Boolean)
    .join('/');
}

/**
 * Normalizes a path for a specific locale.
 * - en (en-US): dental-phones -> phone-system; optimisation -> optimization
 * - en-AU / en-GB: phone-system -> dental-phones; optimization -> optimisation
 */
function normalizePathForLocale(path: string, locale: string): string {
  let result = path;
  if (locale === 'en' || !locale) {
    // en-US: show phone-system, not dental-phones
    result = result.replace(/(^|\/)dental-phones(\/|$)/g, '$1phone-system$2');
    result = result.replace(/optimisation/g, 'optimization');
  }
  if (locale === 'en-AU' || locale === 'en-GB') {
    result = result.replace(/(^|\/)phone-system(\/|$)/g, '$1dental-phones$2');
    result = result.replace(/optimization/g, 'optimisation');
  }
  return result;
}

function buildUrl(path: string, locale: string): string {
  const cleanedPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
  // Normalize path for locale (e.g., phone-system -> dental-phones for en-AU)
  const normalizedPath = normalizePathForLocale(cleanedPath, locale);
  // Sanitize for URL (e.g. "AI Receptionist" -> "ai-receptionist")
  const urlPath = sanitizePathForUrl(normalizedPath);

  if (locale === 'en' || !locale) {
    return urlPath ? `${BASE_URL}/${urlPath}` : BASE_URL;
  }

  return urlPath ? `${BASE_URL}/${locale}/${urlPath}` : `${BASE_URL}/${locale}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isInternalLink(link: string | undefined): boolean {
  if (!link) return false;
  return !link.startsWith('http') && 
         !link.startsWith('mailto:') && 
         !link.startsWith('tel:') &&
         !link.startsWith('#');
}

function cleanPath(link: string): string {
  return link
    .replace(/^\/+/, '')
    .replace(/^(en-GB|en-AU)\//, '')
    .replace(/\/+$/, '');
}

function shouldExcludePath(path: string): boolean {
  if (!path) return false;
  
  if (EXCLUDED_PATHS.includes(path)) return true;
  
  for (const excluded of EXCLUDED_PATHS) {
    if (path.startsWith(excluded + '/') || path === excluded) return true;
  }
  
  if (path.startsWith('dental-phones/features/')) return true;
  if (path.startsWith('test') || path.includes('/test')) return true;
  
  // Exclude paths containing '-v2' in any segment
  const pathSegments = path.split('/');
  for (const segment of pathSegments) {
    if (segment.endsWith('-v2') || segment.includes('-v2')) return true;
  }
  
  return false;
}

// Extract paths from header navigation (all locales: 'en', 'en-AU', 'en-GB')
function extractHeaderPaths(headers: HeaderData[]): Map<string, Set<string>> {
  const paths = new Map<string, Set<string>>(); // Map<path, Set<locales>>
  
  // Process all locale headers
  const enHeader = headers.find(h => h.language === 'en' || !h.language);
  const enAUHeader = headers.find(h => h.language === 'en-AU');
  const enGBHeader = headers.find(h => h.language === 'en-GB');
  
  const processHeader = (header: HeaderData | undefined, locale: string) => {
    if (!header) return;

    if (header.navigationMenu) {
      header.navigationMenu.forEach((item) => {
        if (item.href && isInternalLink(item.href)) {
          const path = cleanPath(item.href);
          if (path && !shouldExcludePath(path)) {
            // Add locale to the set for this path
            if (!paths.has(path)) {
              paths.set(path, new Set<string>());
            }
            paths.get(path)!.add(locale);
          }
        }
        
        if (item.submenu) {
          item.submenu.forEach((subItem) => {
            if (subItem.href && isInternalLink(subItem.href)) {
              const path = cleanPath(subItem.href);
              if (path && !shouldExcludePath(path)) {
                if (!paths.has(path)) {
                  paths.set(path, new Set<string>());
                }
                paths.get(path)!.add(locale);
              }
            }
          });
        }
      });
    }

    if (header.topNavigationMenu) {
      header.topNavigationMenu.forEach((item) => {
        if (item.href && isInternalLink(item.href)) {
          const path = cleanPath(item.href);
          if (path && !shouldExcludePath(path)) {
            if (!paths.has(path)) {
              paths.set(path, new Set<string>());
            }
            paths.get(path)!.add(locale);
          }
        }
      });
    }
  };

  processHeader(enHeader, 'en');
  processHeader(enAUHeader, 'en-AU');
  processHeader(enGBHeader, 'en-GB');
  
  return paths;
}

// Extract paths from footer (all locales: 'en', 'en-AU', 'en-GB')
function extractFooterPaths(footers: FooterData[]): Map<string, Set<string>> {
  const paths = new Map<string, Set<string>>(); // Map<path, Set<locales>>
  
  // Process all locale footers
  const enFooter = footers.find(f => f.language === 'en' || !f.language);
  const enAUFooter = footers.find(f => f.language === 'en-AU');
  const enGBFooter = footers.find(f => f.language === 'en-GB');
  
  const processFooter = (footer: FooterData | undefined, locale: string) => {
    if (!footer) return;

    if (footer.footerColumns) {
      footer.footerColumns.forEach((column) => {
        if (column.titleLink && isInternalLink(column.titleLink)) {
          const path = cleanPath(column.titleLink);
          if (path && !shouldExcludePath(path)) {
            if (!paths.has(path)) {
              paths.set(path, new Set<string>());
            }
            paths.get(path)!.add(locale);
          }
        }
        
        if (column.links) {
          column.links.forEach((link) => {
            if (link.link && isInternalLink(link.link)) {
              const path = cleanPath(link.link);
              if (path && !shouldExcludePath(path)) {
                if (!paths.has(path)) {
                  paths.set(path, new Set<string>());
                }
                paths.get(path)!.add(locale);
              }
            }
          });
        }
      });
    }
    
    if (footer.bottomLinks) {
      footer.bottomLinks.forEach((link) => {
        if (link.link && isInternalLink(link.link)) {
          const path = cleanPath(link.link);
          if (path && !shouldExcludePath(path)) {
            if (!paths.has(path)) {
              paths.set(path, new Set<string>());
            }
            paths.get(path)!.add(locale);
          }
        }
      });
    }
  };

  processFooter(enFooter, 'en');
  processFooter(enAUFooter, 'en-AU');
  processFooter(enGBFooter, 'en-GB');
  
  return paths;
}

async function getFeaturePaths(client: any): Promise<Map<string, { date: string; locales: string[] }>> {
  const pathData = new Map<string, { date: string; locales: Set<string> }>();
  
  const featuresQuery = groq`
    *[_type == "features" && !(_id in path("drafts.**")) && defined(basicInfo.slug.current)] {
      "slug": basicInfo.slug.current,
      language,
      _updatedAt
    }
  `;
  
  const features = await client.fetch(featuresQuery);
  // console.log({features});

  // features.forEach((slug: any) => {
  //   const featureDate = slug._updatedAt;
  //   const enPath = `phone-system/features/${slug.slug}`;
  //   const enAUPath = `dental-phones/features/${slug.slug}`;
  //   const enGBPath = `dental-phones/features/${slug.slug}`;
  //   if(slug =='en'){
  //     pathData.set(enPath, { date: featureDate, locales: new Set([slug.language]) });
  //   }else if(slug =='en-AU'){
  //     pathData.set(enAUPath, { date: featureDate, locales: new Set([slug.language]) });
  //   }else if(slug =='en-GB'){
  //     pathData.set(enGBPath, { date: featureDate, locales: new Set([slug.language]) });
  //   }
  // });
  
  // Group features by normalized slug to detect multi-locale features
  features.forEach((feature: any) => {
    if (!feature.slug) return;

    const slug = typeof feature.slug === 'string' ? sanitizePathForUrl(feature.slug) : feature.slug;
    const normalizedPath = `phone-system/features/${slug}`;
    
    // Skip excluded paths
    if (shouldExcludePath(normalizedPath)) return;
    
    const featureLocale = feature.language || 'en';
    const featureDate = feature._updatedAt || '';
    
    const existing = pathData.get(normalizedPath);
    if (existing) {
      existing.locales.add(featureLocale);
      // Use the most recent date if multiple features match
      if (featureDate > existing.date) {
        existing.date = featureDate;
      }
    } else {
      pathData.set(normalizedPath, { date: featureDate, locales: new Set([featureLocale]) });
    }
  });
  
  // Convert Set to Array for return
  const result = new Map<string, { date: string; locales: string[] }>();
  pathData.forEach((value, path) => {
    result.set(path, { date: value.date, locales: Array.from(value.locales) });
  });
  
  return result;
}

async function getNavigationPaths(client: any): Promise<Map<string, { date: string; locales: string[] }>> {
  const headerQuery = groq`
    *[_type == "homeSettings" && !(_id in path("drafts.**")) && language in ["en", "en-AU", "en-GB"]] {
      language,
      _updatedAt,
      navigationMenu[] {
        label,
        href,
        submenu[] {
          label,
          href
        }
      },
      topNavigationMenu[] {
        label,
        href
      }
    }
  `;
  
  const footerQuery = groq`
    *[_type == "footer" && !(_id in path("drafts.**")) && language in ["en", "en-AU", "en-GB"]] {
      language,
      _updatedAt,
      footerColumns[] {
        title,
        titleLink,
        links[] {
          text,
          link
        }
      },
      bottomLinks[] {
        text,
        link
      }
    }
  `;
  
  const [headers, footers] = await Promise.all([
    client.fetch(headerQuery),
    client.fetch(footerQuery)
  ]);
  
  const headerPaths = extractHeaderPaths(headers);
  const footerPaths = extractFooterPaths(footers);
  
  // Get the most recent update date from headers/footers (all locales)
  const enHeader = headers.find((h: any) => h.language === 'en' || !h.language);
  const enAUHeader = headers.find((h: any) => h.language === 'en-AU');
  const enGBHeader = headers.find((h: any) => h.language === 'en-GB');
  const enFooter = footers.find((f: any) => f.language === 'en' || !f.language);
  const enAUFooter = footers.find((f: any) => f.language === 'en-AU');
  const enGBFooter = footers.find((f: any) => f.language === 'en-GB');
  
  // Get the most recent date from all header/footer locales
  const headerDates = [
    enHeader?._updatedAt,
    enAUHeader?._updatedAt,
    enGBHeader?._updatedAt,
    enFooter?._updatedAt,
    enAUFooter?._updatedAt,
    enGBFooter?._updatedAt
  ].filter(Boolean) as string[];
  
  const headerDate = headerDates.length > 0
    ? headerDates.reduce((latest, date) => date > latest ? date : latest)
    : '';
  const footerDate = headerDate; // Use same date since we're combining them

  // Combine paths with dates and locales
  const pathData = new Map<string, { date: string; locales: Set<string> }>();
  
  // Process header paths
  headerPaths.forEach((locales, path) => {
    const existing = pathData.get(path);
    if (existing) {
      // Merge locales
      locales.forEach(locale => existing.locales.add(locale));
    } else {
      pathData.set(path, { date: headerDate, locales: new Set(locales) });
    }
  });
  
  // Process footer paths
  footerPaths.forEach((locales, path) => {
    const existing = pathData.get(path);
    if (existing) {
      // Merge locales
      locales.forEach(locale => existing.locales.add(locale));
      // Use most recent date if path exists in both
      if (footerDate > existing.date) {
        existing.date = footerDate;
      }
    } else {
      pathData.set(path, { date: footerDate, locales: new Set(locales) });
    }
  });
  
  // Convert Set to Array for return
  const result = new Map<string, { date: string; locales: string[] }>();
  pathData.forEach((value, path) => {
    result.set(path, { date: value.date, locales: Array.from(value.locales) });
  });
  
  return result;
}

// Fetch ALL page documents to detect multi-locale pages
async function getAllPageDocuments(client: any): Promise<Map<string, { date: string; locales: string[] }>> {
  const pathData = new Map<string, { date: string; locales: Set<string> }>();
  
  // Query for ALL page documents (not just those matching navigation paths)
  const pageQuery = groq`
    *[_type == "page" && !(_id in path("drafts.**")) && defined(basicInfo.slug.current)] {
      "slug": basicInfo.slug.current,
      language,
      _updatedAt
    }
  `;
  
  const pages = await client.fetch(pageQuery);
  
  // Group pages by normalized slug (same slug in different locales = same path)
  pages.forEach((page: any) => {
    if (!page.slug) return;
    
    const pageLocale = page.language || 'en';
    
    // Normalize path - remove locale prefix to get the base slug
    // This way "pricing" and "en-AU/pricing" both map to "pricing"
    const normalizedPath = cleanPath(page.slug);
    
    // Skip excluded paths
    if (shouldExcludePath(normalizedPath)) return;
    
    if (page._updatedAt) {
      const existing = pathData.get(normalizedPath);
      if (existing) {
        existing.locales.add(pageLocale);
        // Use most recent date if multiple pages match
        if (page._updatedAt > existing.date) {
          existing.date = page._updatedAt;
        }
      } else {
        pathData.set(normalizedPath, { date: page._updatedAt, locales: new Set([pageLocale]) });
      }
    }
  });
  
  // Convert Set to Array for return
  const result = new Map<string, { date: string; locales: string[] }>();
  pathData.forEach((value, path) => {
    result.set(path, { date: value.date, locales: Array.from(value.locales) });
  });
  
  return result;
}

// Fetch page document dates and locales for paths that might have corresponding page documents
async function getPageDocumentDates(client: any, paths: Set<string>): Promise<Map<string, { date: string; locales: string[] }>> {
  const allPages = await getAllPageDocuments(client);
  
  // Filter to only pages that match our navigation paths
  const result = new Map<string, { date: string; locales: string[] }>();
  allPages.forEach((data, path) => {
    if (paths.has(path)) {
      result.set(path, data);
    }
  });
  
  return result;
}

async function getHomePageDates(client: any): Promise<Map<string, string>> {
  const homePageQuery = groq`
    *[_type == "homePage" && !(_id in path("drafts.**")) && defined(basicInfo.slug.current) && basicInfo.slug.current match "*v2*"] {
      "slug": basicInfo.slug.current,
      language,
      _updatedAt
    }
  `;

  const homePages = await client.fetch(homePageQuery);
  const result = new Map<string, string>();

  homePages.forEach((page: any) => {
    if (!page._updatedAt) return;

    const locale = page.language || 'en';
    const existingDate = result.get(locale);
    if (!existingDate || page._updatedAt > existingDate) {
      result.set(locale, page._updatedAt);
    }
  });

  return result;
}

async function generateSiteMap(
  navigationPaths: Map<string, { date: string; locales: string[] }>, 
  featurePaths: Map<string, { date: string; locales: string[] }>,
  client: any
) {
  const locales = siteConfig.locales;
  
  const [allPageDocuments, homePageDates] = await Promise.all([
    getAllPageDocuments(client),
    getHomePageDates(client)
  ]);
  
  // Combine all paths and dates
  const allPathData = new Map<string, { date: string; locales: string[] }>();
  
  // Add navigation paths with their locales
  navigationPaths.forEach((data, path) => {
    allPathData.set(path, data);
  });
  
  // Add feature paths with their locales
  featurePaths.forEach((featureData, path) => {
    const existing = allPathData.get(path);
    if (existing) {
      // Merge locales from features
      const combinedLocales = new Set([...existing.locales, ...featureData.locales]);
      existing.locales = Array.from(combinedLocales);
      // Use most recent date if path exists in both
      if (featureData.date > existing.date) {
        existing.date = featureData.date;
      }
    } else {
      allPathData.set(path, featureData);
    }
  });
  
  // Merge page documents - these may have multi-locale versions
  allPageDocuments.forEach((pageData, path) => {
    const existing = allPathData.get(path);
    if (existing) {
      // Merge locales from page documents
      const combinedLocales = new Set([...existing.locales, ...pageData.locales]);
      existing.locales = Array.from(combinedLocales);
      // Use most recent date
      if (pageData.date > existing.date) {
        existing.date = pageData.date;
      }
    } else {
      // Add page document paths that aren't in navigation
      allPathData.set(path, pageData);
    }
  });

  // Add static pages (pages not managed in Sanity)
  STATIC_PAGES.forEach(({ path, locales }) => {
    // Skip excluded paths
    if (shouldExcludePath(path)) return;
    
    const existing = allPathData.get(path);
    
    if (existing) {
      // Merge locales from static pages
      const combinedLocales = new Set([...existing.locales, ...locales]);
      existing.locales = Array.from(combinedLocales);
    } else {
      // Add static page with specified locales and no generated lastmod.
      allPathData.set(path, { date: '', locales });
    }
  });

  // Note: phone-system paths will be automatically transformed to dental-phones for en-AU/en-GB
  // in the buildUrl function, so we don't filter by locale for most paths.

  // Only remove en-GB for paths where the en-GB page does not exist (e.g. comparison, case-studies).
  // All other paths get en-GB included like en-AU.
  allPathData.forEach((pathData, path) => {
    if (shouldOmitEnGBUrl(path)) {
      pathData.locales = pathData.locales.filter(locale => locale !== 'en-GB');
    }
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Track all generated URLs to prevent duplicates
  const generatedUrls = new Set<string>();

  // 1. Generate entries for paths WITH hreflang alternates (home, system-requirements)
  PATHS_WITH_ALTERNATES.forEach(path => {
    const pathData = allPathData.get(path);
    
    locales.forEach(locale => {
      const currentUrl = buildUrl(path, locale);
      const lastmodDate = path === '' ? homePageDates.get(locale) : pathData?.date;
      const formattedLastmod = formatLastmod(lastmodDate);
      
      // Skip if this URL has already been generated
      if (generatedUrls.has(currentUrl)) {
        return;
      }
      generatedUrls.add(currentUrl);
      
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(currentUrl)}</loc>\n`;
      if (formattedLastmod) {
        xml += `    <lastmod>${formattedLastmod}</lastmod>\n`;
      }

      // Add hreflang alternates for all locales
      locales.forEach(altLocale => {
        xml += `    <xhtml:link rel="alternate" hreflang="${formatHreflang(altLocale)}" href="${escapeXml(buildUrl(path, altLocale))}"/>\n`;
      });

      // x-default same as loc (this URL)
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(currentUrl)}"/>\n`;

      xml += '  </url>\n';
    });
  });

  // 2. Generate entries for other pages
  // If a path has a canonical key, only the first path we see for that key is processed; others are skipped (already generated as alternates).
  const processedCanonicalKeys = new Set<string>();
  const processedAlternatePathLocales = new Set<string>(); // "path:locale" to avoid duplicate <url> for same (path, locale)

  allPathData.forEach((pathData, path) => {
    if (PATHS_WITH_ALTERNATES.includes(path)) return;
    if (shouldExcludePath(path)) return;

    const canonicalKey = getCanonicalKey(path);
    if (canonicalKey && processedCanonicalKeys.has(canonicalKey)) return;
    if (canonicalKey) processedCanonicalKeys.add(canonicalKey);

    const formattedLastmod = formatLastmod(pathData.date);
    const pathLocales = pathData.locales.length > 0 ? pathData.locales : ['en'];
    const localeMap = canonicalKey ? LOCALE_ALTERNATE_MAP[canonicalKey] : null;
    const hasLocaleAlternates = Boolean(localeMap);
    const hasMultipleLocales = pathLocales.length > 1;

    const allAlternateUrlsSet = new Set<string>();
    const allAlternateUrls: Array<{ url: string; hreflang: string }> = [];

    const addAlternateUrl = (url: string, hreflang: string) => {
      if (url.includes('/en-AU/phone-system') || url.includes('/en-GB/phone-system')) return;
      // Omit en-GB only for paths where the page does not exist (e.g. comparison, case-studies)
      if (hreflang === 'en-GB' || url.includes('/en-GB')) {
        const enGBMatch = url.match(/\/en-GB(?:\/(.*))?$/);
        if (enGBMatch) {
          const urlPath = (enGBMatch[1] || '').replace(/\/$/, '');
          if (shouldOmitEnGBUrl(urlPath)) return;
        }
      }
      const key = `${url}|${hreflang}`;
      if (!allAlternateUrlsSet.has(key)) {
        allAlternateUrlsSet.add(key);
        allAlternateUrls.push({ url, hreflang });
      }
    };

    if (hasMultipleLocales) {
      pathLocales.forEach(altLocale => {
        addAlternateUrl(buildUrl(path, altLocale), formatHreflang(altLocale));
      });
    }

    // Allow dental-phones/features/ as alternates (en-AU/en-GB form of phone-system/features)
    const allowLocalePathForAlternate = (p: string) => !shouldExcludePath(p) || p.startsWith('dental-phones/features/');
    if (hasLocaleAlternates && localeMap) {
      locales.forEach(locale => {
        const localePath = localeMap[locale];
        if (localePath != null && allowLocalePathForAlternate(localePath) && !shouldOmitEnUrl(localePath, locale) && !(locale === 'en-GB' && shouldOmitEnGBUrl(localePath))) {
          const url = buildUrl(localePath, locale);
          addAlternateUrl(url, formatHreflang(locale));
        }
      });
    }

    pathLocales.forEach(locale => {
      if (shouldOmitEnUrl(path, locale)) return;
      const currentUrl = buildUrl(path, locale);
      if (generatedUrls.has(currentUrl)) return;
      generatedUrls.add(currentUrl);

      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(currentUrl)}</loc>\n`;
      if (formattedLastmod) {
        xml += `    <lastmod>${formattedLastmod}</lastmod>\n`;
      }
      if (allAlternateUrls.length > 0) {
        allAlternateUrls.forEach(({ url, hreflang }) => {
          xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(url)}"/>\n`;
        });
        // x-default same as loc (this URL)
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(currentUrl)}"/>\n`;
      }
      xml += '  </url>\n';
    });

    if (hasLocaleAlternates && localeMap) {
      locales.forEach(locale => {
        const localePath = localeMap[locale];
        if (localePath == null || shouldExcludePath(localePath) || shouldOmitEnUrl(localePath, locale) || (locale === 'en-GB' && shouldOmitEnGBUrl(localePath))) return;
        const pathLocaleKey = `${localePath}:${locale}`;
        if (processedAlternatePathLocales.has(pathLocaleKey)) return;
        if (generatedUrls.has(buildUrl(localePath, locale))) return;
        processedAlternatePathLocales.add(pathLocaleKey);

        const alternatePathData = allPathData.get(localePath);
        const alternateLastmod = alternatePathData?.date ?? pathData.date;
        const formattedAlternateLastmod = formatLastmod(alternateLastmod);

        const alternateUrlsSet = new Set<string>();
        const alternateUrlsList: Array<{ url: string; hreflang: string }> = [];
        const addAlt = (url: string, hreflang: string) => {
          if (url.includes('/en-AU/phone-system') || url.includes('/en-GB/phone-system')) return;
          if (hreflang === 'en-GB' || url.includes('/en-GB')) {
            const enGBMatch = url.match(/\/en-GB(?:\/(.*))?$/);
            if (enGBMatch) {
              const urlPath = (enGBMatch[1] || '').replace(/\/$/, '');
              if (shouldOmitEnGBUrl(urlPath)) return;
            }
          }
          const k = `${url}|${hreflang}`;
          if (!alternateUrlsSet.has(k)) {
            alternateUrlsSet.add(k);
            alternateUrlsList.push({ url, hreflang });
          }
        };
        locales.forEach(l => {
          const p = localeMap[l];
          if (p != null && allowLocalePathForAlternate(p) && !shouldOmitEnUrl(p, l) && !(l === 'en-GB' && shouldOmitEnGBUrl(p))) addAlt(buildUrl(p, l), formatHreflang(l));
        });

        const alternateUrl = buildUrl(localePath, locale);
        generatedUrls.add(alternateUrl);
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(alternateUrl)}</loc>\n`;
        if (formattedAlternateLastmod) {
          xml += `    <lastmod>${formattedAlternateLastmod}</lastmod>\n`;
        }
        if (alternateUrlsList.length > 0) {
          alternateUrlsList.forEach(({ url, hreflang }) => {
            xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(url)}"/>\n`;
          });
          // x-default same as loc (this URL)
          xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(alternateUrl)}"/>\n`;
        }
        xml += '  </url>\n';
      });
    }
  });

  xml += '</urlset>';
  return xml;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = getClient(req.preview ? { token: readToken } : undefined);
    const [navigationPaths, featurePaths] = await Promise.all([
      getNavigationPaths(client),
      getFeaturePaths(client)
    ]);
    
    // Get page document dates and locales for paths that might have corresponding page documents
    const allPathsSet = new Set<string>();
    navigationPaths.forEach((_, p) => allPathsSet.add(p));
    featurePaths.forEach((_, p) => allPathsSet.add(p));
    
    const pageDates = await getPageDocumentDates(client, allPathsSet);
    
    // Merge page dates and locales into navigation paths (prefer page document dates if available)
    pageDates.forEach((pageData, path) => {
      const existing = navigationPaths.get(path);
      if (existing) {
        // Merge locales
        const combinedLocales = new Set([...existing.locales, ...pageData.locales]);
        existing.locales = Array.from(combinedLocales);
        // Use most recent date
        if (pageData.date > existing.date) {
          existing.date = pageData.date;
        }
      } else {
        navigationPaths.set(path, { date: pageData.date, locales: pageData.locales });
      }
    });
    
    const sitemap = await generateSiteMap(navigationPaths, featurePaths, client);
    
    // Set headers explicitly before sending response
    res.writeHead(200, {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    });
    
    // Send XML response
    res.end(sitemap);
    return;
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
