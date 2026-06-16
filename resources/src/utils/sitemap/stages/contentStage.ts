import {
  isLocaleNeutralContentType,
  shouldExpandAllLocales,
} from '~/resources/utils/sitemap/contentTypeRegistry'
import {
  buildResourcesContentPath,
  formatSitemapLastmod,
  mergeLastmod,
} from '~/resources/utils/sitemap/localeRules'
import {
  createEmptyVariantMatrix,
  expandVariantsForContentType,
} from '~/resources/utils/sitemap/variantMatrix'
import type {
  SitemapPipelineContext,
  SitemapPipelineStage,
  SitemapUrlCandidate,
} from '~/resources/utils/sitemap/types'

export class SanityContentAggregationStage implements SitemapPipelineStage {
  readonly name = 'sanity-content-aggregation'

  execute(
    _candidates: SitemapUrlCandidate[],
    context: SitemapPipelineContext,
  ): SitemapUrlCandidate[] {
    const aggregate = new Map<string, SitemapUrlCandidate>()

    context.rows.forEach((row) => {
      if (!row.url || !row.contentType) return

      const aggregateKey = `${row.contentType}::${row.url}`

      if (!aggregate.has(aggregateKey)) {
        aggregate.set(aggregateKey, {
          aggregateKey,
          contentType: row.contentType,
          slug: row.url,
          variants: createEmptyVariantMatrix(),
          localeNeutral: isLocaleNeutralContentType(row.contentType),
        })
      }

      const candidate = aggregate.get(aggregateKey)!
      candidate.lastmod = mergeLastmod(
        candidate.lastmod,
        formatSitemapLastmod(row._updatedAt),
      )
    })

    aggregate.forEach((candidate) => {
      const path = buildResourcesContentPath(
        candidate.contentType!,
        candidate.slug!,
      )

      const contentType = candidate.contentType!
      if (
        isLocaleNeutralContentType(contentType) ||
        shouldExpandAllLocales(contentType)
      ) {
        expandVariantsForContentType(candidate, path, context.locales)
      }
    })

    return Array.from(aggregate.values())
  }
}
