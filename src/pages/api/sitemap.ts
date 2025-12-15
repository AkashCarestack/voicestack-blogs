import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import groq from 'groq'
import siteConfig from 'config/siteConfig'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.voicestack.com"

// Exclude list for test pages and patterns
const EXCLUDED_PATHS = [
  'who-we-serve/test-shakir',
  'who-we-serve/ref',
  'test2',
  'en-GB/test',
  'test',
  'search',
];

// Locales that should only have root pages (no child pages)
// This can be easily modified later if needed
const LOCALES_WITHOUT_CHILD_PAGES = ['en-GB', 'en-AU'];

// Paths that should be available for all locales (including en-GB and en-AU)
const PATHS_AVAILABLE_FOR_ALL_LOCALES = ['', 'system-requirements'];

interface SitemapPage {
  slug: string
  language: string | null
  _type: string
  _updatedAt?: string
}

function formatHreflang(locale: string): string {
  const localeMap: { [key: string]: string } = {
    'en': 'en',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    'EN': 'en',
    'EN-GB': 'en-GB',
    'EN-AU': 'en-AU',
    '': 'en'
  };
  return localeMap[locale] || 'en';
}

function getPathForPage(page: SitemapPage): string {
  const slug = page.slug || '';
  
  if (slug === 'landing') {
    if (page._type === 'whoWeServe' || page._type === 'whoWeServePage' || page._type === 'whyVoicestack') {
      return 'who-we-serve';
    }
    return '';
  }
  
  if (page._type === 'whoWeServe' || page._type === 'whoWeServePage') {
    return `who-we-serve/${slug}`;
  } else if (page._type === 'whyVoicestack') {
    return `who-we-serve/${slug}`;
  } else if (page._type === 'features') {
    return `dental-phones/features/${slug}`;
  } else if (page._type === 'page') {
    return slug;
  } else if (page._type === 'footerLink') {
    // Footer links are already in the correct format
    return slug;
  }
  
  return slug;
}

function shouldExcludePath(path: string): boolean {
  // Check exact matches
  if (EXCLUDED_PATHS.includes(path)) {
    return true;
  }
  
  // Check if path starts with any excluded path
  for (const excluded of EXCLUDED_PATHS) {
    if (path.startsWith(excluded + '/') || path === excluded) {
      return true;
    }
  }
  
  // Exclude all feature child pages (features/*)
  if (path.startsWith('dental-phones/features/')) {
    return true;
  }
  
  // Exclude paths that start with 'test'
  if (path.startsWith('test') || path.includes('/test')) {
    return true;
  }
  
  return false;
}

function buildUrl(path: string, locale: string): string {
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
  
  if (locale === 'en' || !locale) {
    return cleanPath ? `${BASE_URL}/${cleanPath}` : BASE_URL;
  }
  
  return cleanPath ? `${BASE_URL}/${locale}/${cleanPath}` : `${BASE_URL}/${locale}`;
}
async function getSitemapData(client: any): Promise<SitemapPage[]> {
  const query1 = groq`
    *[_type in ["whoWeServe", "whoWeServePage", "whyVoicestack"] 
      && defined(basicInfo.slug.current) 
      && !(_id in path("drafts.**"))] {
      _type,
      "slug": basicInfo.slug.current,
      language,
      _updatedAt
    }
  `;
  
  const query2 = groq`
    *[_type in ["page", "features"] 
      && defined(slug.current) 
      && !(_id in path("drafts.**"))] {
      _type,
      "slug": slug.current,
      language,
      _updatedAt
    }
  `;
  
  const footerQuery = groq`
    *[_type == "footer" && !(_id in path("drafts.**"))] {
      language,
      footerColumns[] {
        links[] {
          link,
          text
        }
      },
      bottomLinks[] {
        link,
        text
      }
    }
  `;
  
  const [pages1, pages2, footers] = await Promise.all([
    client.fetch(query1),
    client.fetch(query2),
    client.fetch(footerQuery)
  ]);
  
  const footerPages: SitemapPage[] = [];
  footers.forEach((footer: any) => {
    if (footer.footerColumns) {
      footer.footerColumns.forEach((column: any) => {
        if (column.links) {
          column.links.forEach((link: any) => {
            if (link.link && !link.link.startsWith('http') && !link.link.startsWith('mailto:') && !link.link.startsWith('tel:')) {
              const path = link.link.replace(/^\//, '').replace(/^(en-GB|en-AU)\//, '');
              if (path) {
                footerPages.push({
                  slug: path,
                  language: footer.language || 'en',
                  _type: 'footerLink',
                  _updatedAt: new Date().toISOString()
                });
              }
            }
          });
        }
      });
    }
    
    if (footer.bottomLinks) {
      footer.bottomLinks.forEach((link: any) => {
        if (link.link && !link.link.startsWith('http') && !link.link.startsWith('mailto:') && !link.link.startsWith('tel:')) {
          const path = link.link.replace(/^\//, '').replace(/^(en-GB|en-AU)\//, '');
          if (path) {
            footerPages.push({
              slug: path,
              language: footer.language || 'en',
              _type: 'footerLink',
              _updatedAt: new Date().toISOString()
            });
          }
        }
      });
    }
  });
  
  return [...pages1, ...pages2, ...footerPages];
}

function normalizeLanguage(language: string | null | undefined): string {
  if (!language || language === '') {
    return 'en';
  }
  return language;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSiteMap(pages: SitemapPage[]) {
  const urlMap = new Map<string, { [locale: string]: { url: string; lastmod: string } }>();
  const locales = siteConfig.locales;
  const processedUrls = new Set<string>(); // Track processed URLs to avoid duplicates

  const staticPaths = [
    { path: '', key: 'home' },
    { path: 'system-requirements', key: 'system-requirements' },
    { path: 'dental-phones', key: 'dental-phones' },
    { path: 'who-we-serve', key: 'who-we-serve' },
    // { path: 'pricing', key: 'pricing' },
  ];

  staticPaths.forEach(({ path, key }) => {
    const variants: { [locale: string]: { url: string; lastmod: string } } = {};
    locales.forEach(locale => {
      // Allow all locales for home and system-requirements, but exclude en-GB and en-AU for other paths
      const isAllowedForAllLocales = PATHS_AVAILABLE_FOR_ALL_LOCALES.includes(path);
      if (!isAllowedForAllLocales && LOCALES_WITHOUT_CHILD_PAGES.includes(locale)) {
        return;
      }
      const url = buildUrl(path, locale);
      if (!processedUrls.has(url)) {
        variants[locale] = {
          url,
          lastmod: new Date().toISOString()
        };
        processedUrls.add(url);
      }
    });
    if (Object.keys(variants).length > 0) {
      urlMap.set(key, variants);
    }
  });

  const pagesByPath = new Map<string, SitemapPage[]>();
  
  // Filter out excluded pages
  const filteredPages = pages.filter(page => {
    const path = getPathForPage(page);
    return !shouldExcludePath(path);
  });
  
  filteredPages.forEach(page => {
    const path = getPathForPage(page);
    if (!pagesByPath.has(path)) {
      pagesByPath.set(path, []);
    }
    pagesByPath.get(path)!.push(page);
  });

  pagesByPath.forEach((pageVariants, path) => {
    // Skip if path should be excluded
    if (shouldExcludePath(path)) {
      return;
    }
    
    // Identify root-level static paths and paths available for all locales
    const staticPathKeys = staticPaths.map(sp => sp.key);
    const isRootPage = path === '' || staticPathKeys.includes(path);
    const isAllowedForAllLocales = PATHS_AVAILABLE_FOR_ALL_LOCALES.includes(path);
    const isChildPage = !isRootPage && !isAllowedForAllLocales;
    
    // Filter out child pages for locales that should only have root pages
    // But allow paths that are available for all locales (like system-requirements)
    if (isChildPage) {
      pageVariants = pageVariants.filter(page => {
        const pageLocale = normalizeLanguage(page.language);
        return !LOCALES_WITHOUT_CHILD_PAGES.includes(pageLocale);
      });
      
      // If no variants remain after filtering, skip this path entirely
      if (pageVariants.length === 0) {
        return;
      }
    }
    
    const variants: { [locale: string]: { url: string; lastmod: string } } = {};
    const availableLocales = new Set<string>();
    
    pageVariants.forEach(page => {
      const pageLocale = normalizeLanguage(page.language);
      if (locales.includes(pageLocale)) {
        // Final safety check: don't add child pages for restricted locales
        // But allow paths that are available for all locales
        if (isChildPage && LOCALES_WITHOUT_CHILD_PAGES.includes(pageLocale)) {
          return;
        }
        
        const url = buildUrl(path, pageLocale);
        // Only add if URL hasn't been processed yet
        if (!processedUrls.has(url)) {
          availableLocales.add(pageLocale);
          variants[pageLocale] = {
            url,
            lastmod: page._updatedAt || new Date().toISOString()
          };
          processedUrls.add(url);
        }
      }
    });
    
    if (availableLocales.size > 0) {
      urlMap.set(path, variants);
    }
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const [path, variants] of urlMap) {
    const availableLocales = Object.keys(variants);
    const defaultLocale = availableLocales.includes('en') ? 'en' : availableLocales[0];
    
    Object.entries(variants).forEach(([locale, urlData]) => {
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(urlData.url)}</loc>\n`;
      xml += `    <lastmod>${escapeXml(urlData.lastmod)}</lastmod>\n`;

      availableLocales.forEach(altLocale => {
        if (variants[altLocale]) {
          xml += `    <xhtml:link rel="alternate" hreflang="${formatHreflang(altLocale)}" href="${escapeXml(variants[altLocale].url)}"/>\n`;
        }
      });

      if (variants[defaultLocale]) {
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(variants[defaultLocale].url)}"/>\n`;
      }

      xml += '  </url>\n';
    });
  }

  xml += '</urlset>';
  return xml;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = getClient(req?.preview ? { token: readToken } : undefined);
    const pages = await getSitemapData(client);
    const sitemap = generateSiteMap(pages);
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}