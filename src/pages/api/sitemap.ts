import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
// import { getSitemapData } from '~/lib/sanity.queries'
import siteConfig from 'config/siteConfig'
import { generateHref } from '~/utils/common'

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const BASE_URL = "https://www.voicestack.com"

function cleanUrl(url: string): string {
  // return url.split(' ')[0].trim();
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

function generateSiteMap() {
  const locales = siteConfig.locales;
  const urlMap = new Map();

  // Define static paths we need to generate
  const staticPaths = ['', 'system-requirements'];

  // Generate URL map
  staticPaths.forEach(staticPath => {
    const urlKey = staticPath || 'home';
    const variants = {
      'en-US': staticPath ? `${BASE_URL}/${staticPath}` : BASE_URL,
      'en-GB': `${BASE_URL}/en-GB${staticPath ? `/${staticPath}` : ''}`,
      'en-AU': `${BASE_URL}/en-AU${staticPath ? `/${staticPath}` : ''}`
    };
    urlMap.set(urlKey, variants);
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Generate XML
  for (const [_, variants] of urlMap) {
    Object.entries(variants).forEach(([locale, url]) => {
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;

      // Add all alternates
      Object.entries(variants).forEach(([altLocale, altUrl]) => {
        xml += `    <xhtml:link rel="alternate" hreflang="${formatHreflang(altLocale)}" href="${altUrl}"/>\n`;
      });

      // Add x-default (using en-US version)
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${variants['en-US']}"/>\n`;

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
    // const data = await getSitemapData(client);
    const sitemap = generateSiteMap();
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(sitemap);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}