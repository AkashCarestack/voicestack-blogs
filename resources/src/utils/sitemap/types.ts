import type { SitemapRow } from '~/resources/lib/sanity.queries'

export type SiteLocale = 'en' | 'en-GB' | 'en-AU'

export type HreflangKey = 'en-US' | 'en-GB' | 'en-AU'

export type SitemapContentGroup = 'resources'

/** How hreflang alternates are expanded for a given content type. */
export type VariantExpansionPolicy =
  | 'all-locales' /** hub, post detail, browse, topic */
  | 'default-only' /** author pages — en-US only */
  | 'none'

export interface ContentTypePolicy {
  contentType: string
  expansion: VariantExpansionPolicy
  /** Count toward paginated section totals when language is present on row. */
  countsForPagination: boolean
  /** Included in static hub url generation. */
  isHubSection: boolean
}

export interface HreflangAlternate {
  hreflang: HreflangKey | 'x-default'
  href: string
}

export interface SitemapVariantMatrix {
  variants: Partial<Record<HreflangKey, string>>
  lastmod?: string
  localeNeutral?: boolean
}

export interface SitemapUrlCandidate extends SitemapVariantMatrix {
  /** Stable dedupe key when aggregating Sanity rows. */
  aggregateKey?: string
  contentType?: string
  slug?: string
}

export interface ResourcesSitemapEntry {
  loc: string
  lastmod?: string
  alternates: HreflangAlternate[]
  locale: SiteLocale
  group: SitemapContentGroup
}

export interface SitemapPipelineContext {
  rows: SitemapRow[]
  itemsPerPage: number
  locales: readonly SiteLocale[]
}

export interface SitemapPipelineStage {
  readonly name: string
  execute(
    candidates: SitemapUrlCandidate[],
    context: SitemapPipelineContext,
  ): SitemapUrlCandidate[]
}

export interface RegionalSitemapSlice {
  hreflang: HreflangKey
  siteLocale: SiteLocale
  entries: ResourcesSitemapEntry[]
}
