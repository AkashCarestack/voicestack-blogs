import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import siteConfig from 'config/siteConfig'
import { generateHref } from '~/utils/common'
import { getSitemapData } from '~/lib/sanity.queries'

const BASE_URL = "https://www.voicestack.com"

function cleanUrl(url: string): string {
  return url.split(' ')[0].trim().replace(/\/+$/, '');
}

function formatHreflang(locale: string): string {
  const localeMap: { [key: string]: string } = {
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    'EN-US': 'en-US',
    'EN-GB': 'en-GB',
    'EN-AU': 'en-AU',
    'en': 'en-US',
    '': 'en-US'
  };
  return localeMap[locale] || 'en-US';
}

function generateSiteMap(sitemapData: any = {}): string {
  const locales = siteConfig.locales;
  const urlMap = new Map();

  // Define static paths we need to generate
  const staticPaths = ['', 'system-requirements','features'];

  staticPaths.forEach(staticPath => {
    const urlKey = staticPath || 'home';
    const variants = {
      'en-US': staticPath ? `${BASE_URL}/${staticPath}` : BASE_URL,
      'en-GB': `${BASE_URL}/en-GB${staticPath ? `/${staticPath}` : ''}`,
      'en-AU': `${BASE_URL}/en-AU${staticPath ? `/${staticPath}` : ''}`
    };
    urlMap.set(urlKey, variants);
    console.log(urlMap, "urlmap static");
    
  });

  sitemapData?.forEach((post) => {
    if (!post.url || !post.language) return;

    const postLocale = post.language; 
    locales?.forEach((locale) => {
      if (locale !== postLocale) return;
      
      const url = `${BASE_URL}${generateHref(locale, `${post?.contentType}/${post.url}`)}`;
      const cleanedUrl = cleanUrl(url);
      const urlKey = cleanedUrl.replace(BASE_URL, '').replace(/^\/(en-[A-Z]{2}\/)?/, '');
  
      if (!urlMap.has(urlKey)) {
        urlMap.set(urlKey, { [postLocale]: cleanedUrl });
      }      
      
      const variants = urlMap.get(urlKey);
      const formattedLocale = formatHreflang(locale);
      variants[formattedLocale] = cleanedUrl;
    });
  });
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const [_, variants] of urlMap) {
    const uniqueUrls = new Set(Object.values(variants));
    
    if (uniqueUrls.size === 1) {
      const url = [...uniqueUrls][0];
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '  </url>\n';
      continue;
    }

    // Multiple unique URLs
    Object.entries(variants).forEach(([locale, url]) => {
      if (!url) return;
      
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      
      const variantCount = Object.keys(variants).length;
      if (variantCount > 1) {
        Object.entries(variants).forEach(([altLocale, altUrl]) => {
          if (altUrl) {
            xml += `    <xhtml:link rel="alternate" hreflang="${formatHreflang(altLocale)}" href="${altUrl}"/>\n`;
          }
        });
        
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${variants['en-US'] || url}"/>\n`;
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
    const data = await getSitemapData(client);
    
    const sitemap = generateSiteMap(data);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}