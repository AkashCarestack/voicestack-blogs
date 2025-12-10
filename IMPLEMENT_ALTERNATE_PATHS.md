# Implement Alternate Paths (Hreflang) for Multi-Locale SEO

This implementation adds proper hreflang tags and x-default links for multi-locale Next.js applications. It automatically generates alternate language links based on the current page and locale configuration.

## Files to Create/Update

### 1. Create `src/components/utils/alternatePaths.ts`

```typescript
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

export function useAlternatePaths(origin?: string) {
  const router = useRouter();
  const locales = siteConfig.locales || ['en', 'en-GB', 'en-AU'];
  
  // Determine base URL - prioritize origin param, then env var, then current origin, then fallback
  const getBaseUrl = () => {
    let url: string;
    
    if (origin) {
      url = origin;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      // Use NEXT_PUBLIC_BASE_URL if set
      url = process.env.NEXT_PUBLIC_BASE_URL;
    } else if (typeof window !== 'undefined') {
      // In browser, use current origin (works for both dev and prod)
      url = window.location.origin;
    } else {
      // Server-side fallback
      const isProduction = process.env.NODE_ENV === 'production';
      url = isProduction ? 'https://www.yoursite.com' : 'http://localhost:3000';
    }
    
    // Remove trailing slash
    return url.replace(/\/+$/, '');
  };
  
  const baseUrl = getBaseUrl();

  return useMemo(() => {
    const paths: AlternatePath[] = [];
    
    // Get current path from router
    const currentPath = router.asPath.split('?')[0].split('#')[0]; // Remove query params and hash
    const currentLocale = router.locale || 'en';
    
    // Remove locale prefix from path if present
    const pathWithoutLocale = removeLocale(currentPath, locales);
    const cleanPath = pathWithoutLocale.replace(/^\//, '');
    
    // Paths available for all locales (including en-GB and en-AU)
    // UPDATE THIS: Add paths that should be available for all locales
    const PATHS_AVAILABLE_FOR_ALL_LOCALES = ['', 'system-requirements'];
    
    // Locales that should only have root pages (no child pages)
    // UPDATE THIS: Add locales that should be restricted to root pages only
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
```

### 2. Update Your Head Component (e.g., `SimpleHead.tsx` or similar)

```typescript
import Head from 'next/head'
import React from 'react'
import { useAlternatePaths, AlternatePath } from '~/components/utils/alternatePaths'

interface SimpleHeadProps {
  data?: any
}

// Re-export for backward compatibility (optional)
export { useAlternatePaths, formatHreflang, removeLocale, buildUrl } from '~/components/utils/alternatePaths'
export type { AlternatePath } from '~/components/utils/alternatePaths'

export default function SimpleHead({ data }: SimpleHeadProps) {
  const { alternatePaths, defaultUrl } = useAlternatePaths();

  const fullTitle = data?.metaTitle ? `${data?.metaTitle}` : 'Your Default Title';

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={data?.metaDescription || 'Your default description'} />
      {data?.keyWords && <meta name="keywords" content={typeof data?.keyWords === 'string' ? data?.keyWords : data?.keyWords?.join(',')} />}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      {data?.canonical && <link rel="canonical" href={data?.canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={data?.metaDescription || 'Your default description'} />
      <meta name="title" content={fullTitle} />
      
      {/* Alternate language links */}
      {alternatePaths.length > 0 && alternatePaths.map((item: AlternatePath) => (
        <link 
          key={item.path} 
          rel="alternate" 
          href={item.path.replace(/\/home$|\/$/, '').replace(/\/$/, '')} 
          hrefLang={item.locale} 
        />
      ))}
      
      {/* x-default link - Required for SEO */}
      {defaultUrl && (
        <link 
          rel="alternate" 
          href={defaultUrl.replace(/\/home$|\/$/, '').replace(/\/$/, '')} 
          hrefLang="x-default" 
        />
      )}
    </Head>
  )
}
```

### 3. Ensure `config/siteConfig.ts` exists with locales

```typescript
const siteConfig = {
  pageURLs: {
    home: '/',
    // Add your other page URLs
  },
  locales: ['en', 'en-GB', 'en-AU'] // UPDATE: Add your locales
}

export default siteConfig
```

## Configuration Steps

1. **Update locales in `siteConfig.ts`**: Change `['en', 'en-GB', 'en-AU']` to match your locales
2. **Update `PATHS_AVAILABLE_FOR_ALL_LOCALES`**: Add paths that should be available for all locales (e.g., home page, system-requirements)
3. **Update `LOCALES_WITHOUT_CHILD_PAGES`**: Add locales that should only have root pages (no child pages)
4. **Update production URL fallback**: Change `'https://www.yoursite.com'` in `alternatePaths.ts` to your production URL
5. **Update import paths**: Adjust `~/components/utils/alternatePaths` to match your project structure

## Environment Variables

Optional: Set `NEXT_PUBLIC_BASE_URL` in your `.env` file:
```
NEXT_PUBLIC_BASE_URL=https://www.yoursite.com
```

## How It Works

- Automatically detects current page path and locale
- Generates alternate language links for all available locales
- Handles locale restrictions (some locales only get root pages)
- Uses `window.location.origin` in browser (works in dev and prod)
- Falls back to environment variables or production URL
- Adds `x-default` link for SEO (defaults to 'en' if available)

## Testing

1. Check that alternate links appear in page source
2. Verify `x-default` points to correct URL
3. Test on different locales (en, en-GB, en-AU)
4. Verify production URLs (not localhost) in production build




