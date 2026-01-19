import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import groq from 'groq'
import siteConfig from 'config/siteConfig'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.voicestack.com"

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
    'en': 'en',
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

// Extract paths from header navigation (only 'en' locale)
function extractHeaderPaths(headers: HeaderData[]): Set<string> {
  const paths = new Set<string>();
  
  // Only process 'en' locale header
  const enHeader = headers.find(h => h.language === 'en' || !h.language);
  if (!enHeader) return paths;
  
  if (enHeader.navigationMenu) {
    enHeader.navigationMenu.forEach((item) => {
      if (item.href && isInternalLink(item.href)) {
        const path = cleanPath(item.href);
        if (path && !shouldExcludePath(path)) {
          paths.add(path);
        }
      }
      
      if (item.submenu) {
        item.submenu.forEach((subItem) => {
          if (subItem.href && isInternalLink(subItem.href)) {
            const path = cleanPath(subItem.href);
            if (path && !shouldExcludePath(path)) {
              paths.add(path);
            }
          }
        });
      }
    });
  }
  
  if (enHeader.topNavigationMenu) {
    enHeader.topNavigationMenu.forEach((item) => {
      if (item.href && isInternalLink(item.href)) {
        const path = cleanPath(item.href);
        if (path && !shouldExcludePath(path)) {
          paths.add(path);
        }
      }
    });
  }
  
  return paths;
}

// Extract paths from footer (only 'en' locale)
function extractFooterPaths(footers: FooterData[]): Set<string> {
  const paths = new Set<string>();
  
  // Only process 'en' locale footer
  const enFooter = footers.find(f => f.language === 'en' || !f.language);
  if (!enFooter) return paths;
  
  if (enFooter.footerColumns) {
    enFooter.footerColumns.forEach((column) => {
      if (column.titleLink && isInternalLink(column.titleLink)) {
        const path = cleanPath(column.titleLink);
        if (path && !shouldExcludePath(path)) {
          paths.add(path);
        }
      }
      
      if (column.links) {
        column.links.forEach((link) => {
          if (link.link && isInternalLink(link.link)) {
            const path = cleanPath(link.link);
            if (path && !shouldExcludePath(path)) {
              paths.add(path);
            }
          }
        });
      }
    });
  }
  
  if (enFooter.bottomLinks) {
    enFooter.bottomLinks.forEach((link) => {
      if (link.link && isInternalLink(link.link)) {
        const path = cleanPath(link.link);
        if (path && !shouldExcludePath(path)) {
          paths.add(path);
        }
      }
    });
  }
  
  return paths;
}

async function getFeaturePaths(client: any): Promise<Map<string, string>> {
  const pathDates = new Map<string, string>();
  
  const featuresQuery = groq`
    *[_type == "features" && !(_id in path("drafts.**")) && defined(basicInfo.slug.current)] {
      "slug": basicInfo.slug.current,
      _updatedAt
    }
  `;
  
  const features = await client.fetch(featuresQuery);
  
  // Get unique slugs and build paths with dates
  const uniqueSlugs = new Map<string, string>();
  features.forEach((feature: any) => {
    // Exclude 'track' feature
    if (feature.slug && feature.slug !== 'track' && !shouldExcludePath(`phone-system/features/${feature.slug}`)) {
      const existingDate = uniqueSlugs.get(feature.slug);
      // Use the most recent date if duplicate slugs exist
      if (!existingDate || (feature._updatedAt && feature._updatedAt > existingDate)) {
        uniqueSlugs.set(feature.slug, feature._updatedAt || new Date().toISOString());
      }
    }
  });
  
  // Build paths for feature pages with dates
  uniqueSlugs.forEach((date, slug) => {
    pathDates.set(`phone-system/features/${slug}`, date);
  });
  
  return pathDates;
}

async function getNavigationPaths(client: any): Promise<Map<string, string>> {
  const headerQuery = groq`
    *[_type == "homeSettings" && !(_id in path("drafts.**"))] {
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
    *[_type == "footer" && !(_id in path("drafts.**"))] {
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
  
  // Get the most recent update date from headers/footers
  const enHeader = headers.find((h: any) => h.language === 'en' || !h.language);
  const enFooter = footers.find((f: any) => f.language === 'en' || !f.language);
  
  const headerDate = enHeader?._updatedAt || new Date().toISOString();
  const footerDate = enFooter?._updatedAt || new Date().toISOString();
  const mostRecentDate = headerDate > footerDate ? headerDate : footerDate;
  
  // Combine paths with dates
  const pathDates = new Map<string, string>();
  headerPaths.forEach(p => pathDates.set(p, headerDate));
  footerPaths.forEach(p => {
    // Use most recent date if path exists in both
    const existingDate = pathDates.get(p);
    if (!existingDate || footerDate > existingDate) {
      pathDates.set(p, footerDate);
    } else {
      pathDates.set(p, existingDate);
    }
  });
  
  return pathDates;
}

// Fetch page document dates for paths that might have corresponding page documents
async function getPageDocumentDates(client: any, paths: Set<string>): Promise<Map<string, string>> {
  const pathDates = new Map<string, string>();
  
  // Query for page documents that match our paths
  const pageQuery = groq`
    *[_type == "page" && !(_id in path("drafts.**")) && defined(basicInfo.slug.current)] {
      "slug": basicInfo.slug.current,
      language,
      _updatedAt
    }
  `;
  
  const pages = await client.fetch(pageQuery);
  
  // Create a map of path to date
  pages.forEach((page: any) => {
    if (!page.slug) return;
    
    // Build path based on language and slug
    let path = '';
    if (page.language === 'en' || !page.language) {
      path = page.slug;
    } else {
      path = `${page.language}/${page.slug}`;
    }
    
    // Normalize path (remove locale prefix if needed)
    path = cleanPath(path);
    
    if (paths.has(path) && page._updatedAt) {
      const existingDate = pathDates.get(path);
      // Use most recent date if multiple pages match
      if (!existingDate || page._updatedAt > existingDate) {
        pathDates.set(path, page._updatedAt);
      }
    }
  });
  
  return pathDates;
}

function generateSiteMap(navigationPaths: Map<string, string>, featurePaths: Map<string, string>) {
  const locales = siteConfig.locales;
  
  // Combine all paths and dates
  const allPathDates = new Map<string, string>();
  navigationPaths.forEach((date, path) => allPathDates.set(path, date));
  featurePaths.forEach((date, path) => {
    const existingDate = allPathDates.get(path);
    // Use most recent date if path exists in both
    if (!existingDate || date > existingDate) {
      allPathDates.set(path, date);
    }
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // 1. Generate entries for paths WITH hreflang alternates (home, system-requirements)
  PATHS_WITH_ALTERNATES.forEach(path => {
    const lastmod = allPathDates.get(path) || new Date().toISOString();
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

  // 2. Generate entries for other pages (only 'en', no hreflang)
  allPathDates.forEach((date, path) => {
    // Skip paths that already have alternates
    if (PATHS_WITH_ALTERNATES.includes(path)) return;
    const formattedLastmod = formatLastmod(date);
    
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(buildUrl(path, 'en'))}</loc>\n`;
    xml += `    <lastmod>${formattedLastmod}</lastmod>\n`;
    xml += '  </url>\n';
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
    
    // Get page document dates for paths that might have corresponding page documents
    const allPathsSet = new Set<string>();
    navigationPaths.forEach((_, p) => allPathsSet.add(p));
    featurePaths.forEach((_, p) => allPathsSet.add(p));
    
    const pageDates = await getPageDocumentDates(client, allPathsSet);
    
    // Merge page dates into navigation paths (prefer page document dates if available)
    pageDates.forEach((date, path) => {
      const existingDate = navigationPaths.get(path);
      if (!existingDate || date > existingDate) {
        navigationPaths.set(path, date);
      }
    });
    
    const sitemap = generateSiteMap(navigationPaths, featurePaths);
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
