export function resolveHref(
  documentType?: string,
  slug?: string,
  locale?: string,
): string | undefined {
  const localePrefix = locale && locale !== 'en' ? `/${locale}` : '';
  
  switch (documentType) {
    case 'home':
      return localePrefix || '/'
    case 'page':
      return slug ? `${localePrefix}/${slug}` : undefined
    case 'project':
      return slug ? `${localePrefix}/projects/${slug}` : undefined
    default:
      return undefined
  }
}

// Helper function to preserve locale in URLs
export function preserveLocale(url: string, locale?: string): string {
  if (!locale || locale === 'en') return url;
  
  // If URL doesn't start with locale, add it
  if (!url.startsWith(`/${locale}`)) {
    return `/${locale}${url.startsWith('/') ? url : `/${url}`}`;
  }
  
  return url;
}
