import { useMemo } from 'react'
import { useRouter } from 'next/router'
import siteConfig from 'config/siteConfig'

export interface AlternatePath {
  path: string
  locale: string
}

export function formatHreflang(locale: string): string {
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

export function removeLocale(slug: string, locales: string[]): string {
  // Handle empty or root path
  if (!slug || slug === '/' || slug === '') {
    return '/';
  }
  
  // Remove leading slash and split
  const parts = slug.replace(/^\/+/, '').split('/').filter(p => p !== '');
  if (parts.length === 0) {
    return '/';
  }
  
  const firstPart = parts[0];
  
  // Check if first part is a locale or 'home'
  if (firstPart === 'home' || locales?.includes(firstPart)) {
    // Remove the locale/home part and return the rest
    const remaining = parts.slice(1).join('/');
    return remaining ? `/${remaining}` : '/';
  }
  
  // If no locale prefix, return as is (but ensure it starts with /)
  return slug.startsWith('/') ? slug : `/${slug}`;
}

export function buildUrl(path: string, locale: string, baseUrl: string): string {
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
  
  if (locale === 'en' || !locale) {
    return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
  }
  
  return cleanPath ? `${baseUrl}/${locale}/${cleanPath}` : `${baseUrl}/${locale}`;
}

/** Same origin resolution as useAlternatePaths (SSR-safe when window is undefined). */
export function getSiteBaseUrl(origin?: string): string {
  let url: string;

  if (origin) {
    url = origin;
  } else if (process.env.NEXT_PUBLIC_BASE_URL) {
    url = process.env.NEXT_PUBLIC_BASE_URL;
  } else if (typeof window !== 'undefined') {
    url = window.location.origin;
  } else {
    const isProduction = process.env.NODE_ENV === 'production';
    url = isProduction ? 'https://www.voicestack.com' : 'http://localhost:3000';
  }

  return url.replace(/\/+$/, '');
}

export function useAlternatePaths(origin?: string) {
  const router = useRouter();
  const locales = siteConfig.locales || ['en', 'en-GB', 'en-AU'];

  const baseUrl = getSiteBaseUrl(origin);

  return useMemo(() => {
    const paths: AlternatePath[] = [];
    
    // Get current path from router
    const currentPath = router.asPath.split('?')[0].split('#')[0]; // Remove query params and hash
    const currentLocale = router.locale || 'en';
    
    // Remove locale prefix from path if present
    const pathWithoutLocale = removeLocale(currentPath, locales);
    const cleanPath = pathWithoutLocale.replace(/^\//, '');
    
    // Paths available for all locales (including en-GB and en-AU)
    const PATHS_AVAILABLE_FOR_ALL_LOCALES = ['', 'system-requirements'];
    const LOCALES_WITHOUT_CHILD_PAGES = ['en-GB', 'en-AU'];
    
    // Check if this is a root page or available for all locales
    const isRootPage = pathWithoutLocale === '' || pathWithoutLocale === '/';
    const isAllowedForAllLocales = PATHS_AVAILABLE_FOR_ALL_LOCALES.includes(cleanPath);
    const isChildPage = !isRootPage && !isAllowedForAllLocales;
    
    // Generate alternate paths for all locales
    locales.forEach((locale) => {
      // Skip child pages for locales that should only have root pages
      if (isChildPage && LOCALES_WITHOUT_CHILD_PAGES.includes(locale)) {
        return;
      }
      
      const url = buildUrl(cleanPath, locale, baseUrl);
      paths.push({
        path: url,
        locale: formatHreflang(locale)
      });
    });
    
    // Determine default URL (x-default)
    // x-default tells search engines which version to show to users whose language 
    // preference doesn't match any available hreflang tags. It's required for proper SEO.
    // We prefer 'en' as default if available, otherwise use current locale
    const hasEnLocale = paths.some((item: AlternatePath) => item.locale === 'en');
    const defaultUrl = hasEnLocale 
      ? buildUrl(cleanPath, 'en', baseUrl)
      : buildUrl(cleanPath, currentLocale, baseUrl);
    
    return { alternatePaths: paths, defaultUrl };
  }, [router.asPath, router.locale, locales, baseUrl]);
}

