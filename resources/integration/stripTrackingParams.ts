const TRACKING_QUERY_PARAMS = new Set([
  'gclid',
  'fbclid',
  'msclkid',
  'mc_cid',
  'mc_eid',
  '__hstc',
  '__hssc',
  '__hsfp',
  'refer',
  'ref',
  'session',
  'user',
  'timestamp',
  'brand_id',
  'locale_id',
  'return_to',
  'lead_source',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
])

export function isTrackingQueryParam(key: string): boolean {
  const lower = key.toLowerCase()
  if (lower.startsWith('utm_')) return true
  return TRACKING_QUERY_PARAMS.has(lower)
}

/** Params allowed on internal links (demo / thank-you flows only). */
export const ALLOWED_INTERNAL_QUERY_PARAMS = new Set([
  'practiceType',
  'locations',
  'loc',
  'flag',
])

export function stripTrackingParams(url: string): string {
  if (!url || !url.includes('?')) return url.replace(/\/$/, '') || url

  const [path, query = ''] = url.split('?')
  const hashIndex = query.indexOf('#')
  const queryOnly = hashIndex >= 0 ? query.slice(0, hashIndex) : query
  const hash = hashIndex >= 0 ? query.slice(hashIndex) : ''

  const params = new URLSearchParams(queryOnly)
  Array.from(params.keys()).forEach((key) => {
    if (isTrackingQueryParam(key)) {
      params.delete(key)
    }
  })

  const cleanedQuery = params.toString()
  const cleanPath = path.replace(/\/$/, '') || path
  return cleanedQuery ? `${cleanPath}?${cleanedQuery}${hash}` : `${cleanPath}${hash}`
}

export function getCleanPath(pathOrUrl: string): string {
  const withoutHash = pathOrUrl.split('#')[0]
  const withoutQuery = withoutHash.split('?')[0]
  return withoutQuery.replace(/\/$/, '') || withoutQuery
}

export function filterInternalLinkQuery(
  query: Record<string, string | string[] | undefined>,
  options: { isThankYouPage: boolean; isDemoDestination: boolean },
): Record<string, string> {
  const result: Record<string, string> = {}

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || key === 'flag' || key === 'slug') return
    if (isTrackingQueryParam(key)) return

    if (key === 'practiceType' && !options.isThankYouPage) return
    if ((key === 'locations' || key === 'loc') && !options.isDemoDestination) return
    if (!ALLOWED_INTERNAL_QUERY_PARAMS.has(key) && key !== 'practiceType' && key !== 'locations' && key !== 'loc') {
      return
    }

    result[key] = Array.isArray(value) ? value[0] : value.toString()
  })

  return result
}
