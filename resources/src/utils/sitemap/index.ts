export type {
  ContentTypePolicy,
  HreflangAlternate,
  HreflangKey,
  RegionalSitemapSlice,
  ResourcesSitemapEntry,
  SiteLocale,
  SitemapPipelineContext,
  SitemapPipelineStage,
  SitemapUrlCandidate,
  VariantExpansionPolicy,
} from '~/resources/utils/sitemap/types'

export {
  getContentTypePolicy,
  isLocaleNeutralContentType,
  isPostDetailContentType,
  shouldExpandAllLocales,
} from '~/resources/utils/sitemap/contentTypeRegistry'

export {
  buildResourcesSitemapEntries,
  buildResourcesSitemapEntriesForLocale,
  defaultResourcesSitemapEngine,
  ResourcesSitemapMappingEngine,
} from '~/resources/utils/sitemap/engine'

export {
  filterEntriesForSiteLocale,
  flattenCandidatesToEntries,
  sortEntriesByLocaleAndLoc,
} from '~/resources/utils/sitemap/stages/entryFlattenStage'

export {
  buildResourcesContentPath,
  inferSiteLocaleFromAbsoluteUrl,
} from '~/resources/utils/sitemap/localeRules'

export {
  escapeSitemapXml,
  serializeUrlBlock,
  serializeUrlBlocksToXml,
} from '~/resources/utils/sitemap/xmlSerializer'
