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
];

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

function formatLastmod(date: string | Date | null | undefined): string {
  if (!date) {
    // Default to current date/time if no date provided
    return new Date().toISOString();
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString();
  }
  
  // Format as YYYY-MM-DDThh:mm:ss+00:00 (sitemap standard with time)
  // ISO 8601 format is accepted by sitemap protocol
  return dateObj.toISOString();
}

function buildUrl(path: string, locale: string): string {
  const cleanedPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
  
  if (locale === 'en' || !locale) {
    return cleanedPath ? `${BASE_URL}/${cleanedPath}` : BASE_URL;
  }
  
  return cleanedPath ? `${BASE_URL}/${locale}/${cleanedPath}` : `${BASE_URL}/${locale}`;
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
  
  // Group features by normalized slug to detect multi-locale features
  features.forEach((feature: any) => {
    if (!feature.slug) return;
    
    // Exclude 'track' feature
    if (feature.slug === 'track') return;
    
    const normalizedPath = `phone-system/features/${feature.slug}`;
    
    // Skip excluded paths
    if (shouldExcludePath(normalizedPath)) return;
    
    const featureLocale = feature.language || 'en';
    const featureDate = feature._updatedAt || new Date().toISOString();
    
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
    : new Date().toISOString();
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

async function generateSiteMap(
  navigationPaths: Map<string, { date: string; locales: string[] }>, 
  featurePaths: Map<string, { date: string; locales: string[] }>,
  client: any
) {
  const locales = siteConfig.locales;
  
  // Get ALL page documents to detect multi-locale pages
  const allPageDocuments = await getAllPageDocuments(client);
  
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

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // 1. Generate entries for paths WITH hreflang alternates (home, system-requirements)
  PATHS_WITH_ALTERNATES.forEach(path => {
    const pathData = allPathData.get(path);
    const lastmod = pathData?.date || new Date().toISOString();
    const formattedLastmod = formatLastmod(lastmod);
    
    locales.forEach(locale => {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(buildUrl(path, locale))}</loc>\n`;
      xml += `    <lastmod>${formattedLastmod}</lastmod>\n`;

      // Add hreflang alternates for all locales
      locales.forEach(altLocale => {
        xml += `    <xhtml:link rel="alternate" hreflang="${formatHreflang(altLocale)}" href="${escapeXml(buildUrl(path, altLocale))}"/>\n`;
      });

      // Add x-default pointing to 'en' version
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(buildUrl(path, 'en'))}"/>\n`;

      xml += '  </url>\n';
    });
  });

  // 2. Generate entries for other pages
  // If a path exists in multiple locales, add hreflang alternates
  allPathData.forEach((pathData, path) => {
    // Skip paths that already have alternates
    if (PATHS_WITH_ALTERNATES.includes(path)) return;
    
    const formattedLastmod = formatLastmod(pathData.date);
    const pathLocales = pathData.locales.length > 0 ? pathData.locales : ['en'];
    
    // If path exists in multiple locales, add hreflang alternates
    const hasMultipleLocales = pathLocales.length > 1;
    
    // Generate entries for each locale that has this path
    pathLocales.forEach(locale => {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(buildUrl(path, locale))}</loc>\n`;
      xml += `    <lastmod>${formattedLastmod}</lastmod>\n`;
      
      // Add hreflang alternates if path exists in multiple locales
      // This links all locale versions of the same URL together
      if (hasMultipleLocales) {
        // Add alternates for all locales that have this path
        pathLocales.forEach(altLocale => {
          const altUrl = buildUrl(path, altLocale);
          const altHreflang = formatHreflang(altLocale);
          xml += `    <xhtml:link rel="alternate" hreflang="${altHreflang}" href="${escapeXml(altUrl)}"/>\n`;
        });
        // Add x-default pointing to 'en' version if 'en' exists, otherwise first locale
        const defaultLocale = pathLocales.includes('en') ? 'en' : pathLocales[0];
        const defaultUrl = buildUrl(path, defaultLocale);
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}"/>\n`;
      }
      
      xml += '  </url>\n';
    });
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
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
