import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import groq from 'groq'
import siteConfig from 'config/siteConfig'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.voicestack.com"

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
    } else if (page._type === 'dentalSoftware') {
      return 'dental-software';
    }
    return '';
  }
  
  if (page._type === 'whoWeServe' || page._type === 'whoWeServePage') {
    return `who-we-serve/${slug}`;
  } else if (page._type === 'dentalSoftware') {
    return `dental-software/${slug}`;
  } else if (page._type === 'whyVoicestack') {
    return `who-we-serve/${slug}`;
  } else if (page._type === 'features') {
    return `dental-phones/features/${slug}`;
  } else if (page._type === 'page') {
    return slug;
  }
  
  return slug;
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
    *[_type in ["whoWeServe", "whoWeServePage", "dentalSoftware", "whyVoicestack"] 
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
  
  const [pages1, pages2] = await Promise.all([
    client.fetch(query1),
    client.fetch(query2)
  ]);
  
  return [...pages1, ...pages2];
}

function normalizeLanguage(language: string | null | undefined): string {
  if (!language || language === '') {
    return 'en';
  }
  return language;
}

function generateSiteMap(pages: SitemapPage[]) {
  const urlMap = new Map<string, { [locale: string]: string }>();
  const locales = siteConfig.locales;

  const staticPaths = [
    { path: '', key: 'home' },
    { path: 'system-requirements', key: 'system-requirements' },
    { path: 'dental-phones', key: 'dental-phones' },
    { path: 'dental-software', key: 'dental-software' },
    { path: 'who-we-serve', key: 'who-we-serve' },
    { path: 'pricing', key: 'pricing' },
  ];

  staticPaths.forEach(({ path, key }) => {
    const variants: { [locale: string]: string } = {};
    locales.forEach(locale => {
      variants[locale] = buildUrl(path, locale);
    });
    urlMap.set(key, variants);
  });

  const pagesByPath = new Map<string, SitemapPage[]>();
  
  pages.forEach(page => {
    const path = getPathForPage(page);
    if (!pagesByPath.has(path)) {
      pagesByPath.set(path, []);
    }
    pagesByPath.get(path)!.push(page);
  });

  pagesByPath.forEach((pageVariants, path) => {
    const variants: { [locale: string]: string } = {};
    const availableLocales = new Set<string>();
    
    pageVariants.forEach(page => {
      const pageLocale = normalizeLanguage(page.language);
      if (locales.includes(pageLocale)) {
        availableLocales.add(pageLocale);
        variants[pageLocale] = buildUrl(path, pageLocale);
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
    
    Object.entries(variants).forEach(([locale, url]) => {
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;

      availableLocales.forEach(altLocale => {
        if (variants[altLocale]) {
          xml += `    <xhtml:link rel="alternate" hreflang="${formatHreflang(altLocale)}" href="${variants[altLocale]}"/>\n`;
        }
      });

      if (variants[defaultLocale]) {
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${variants[defaultLocale]}"/>\n`;
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