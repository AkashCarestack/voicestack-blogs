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

async function getFeaturePaths(client: any): Promise<Set<string>> {
  const paths = new Set<string>();
  
  const featuresQuery = groq`
    *[_type == "features" && !(_id in path("drafts.**")) && defined(basicInfo.slug.current)] {
      "slug": basicInfo.slug.current
    }
  `;
  
  const features = await client.fetch(featuresQuery);
  
  // Get unique slugs and build paths
  const uniqueSlugs = new Set<string>();
  features.forEach((feature: any) => {
    // Exclude 'track' feature
    if (feature.slug && feature.slug !== 'track' && !shouldExcludePath(`phone-system/features/${feature.slug}`)) {
      uniqueSlugs.add(feature.slug);
    }
  });
  
  // Build paths for feature pages
  uniqueSlugs.forEach(slug => {
    paths.add(`phone-system/features/${slug}`);
  });
  
  return paths;
}

async function getNavigationPaths(client: any): Promise<Set<string>> {
  const headerQuery = groq`
    *[_type == "homeSettings" && !(_id in path("drafts.**"))] {
      language,
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
  
  // Combine paths
  const allPaths = new Set<string>();
  headerPaths.forEach(p => allPaths.add(p));
  footerPaths.forEach(p => allPaths.add(p));
  
  return allPaths;
}

function generateSiteMap(navigationPaths: Set<string>) {
  const locales = siteConfig.locales;

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // 1. Generate entries for paths WITH hreflang alternates (home, system-requirements)
  PATHS_WITH_ALTERNATES.forEach(path => {
    locales.forEach(locale => {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(buildUrl(path, locale))}</loc>\n`;

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
  navigationPaths.forEach(path => {
    // Skip paths that already have alternates
    if (PATHS_WITH_ALTERNATES.includes(path)) return;
    
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(buildUrl(path, 'en'))}</loc>\n`;
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
    
    // Combine all paths
    const allPaths = new Set<string>();
    navigationPaths.forEach(p => allPaths.add(p));
    featurePaths.forEach(p => allPaths.add(p));
    
    const sitemap = generateSiteMap(allPaths);
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
