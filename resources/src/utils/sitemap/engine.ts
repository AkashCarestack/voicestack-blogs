import siteConfig from '~/resources-config/siteConfig'

import type { SitemapRow } from '~/resources/lib/sanity.queries'
import { SITE_LOCALES } from '~/resources/utils/sitemap/constants'
import { SanityContentAggregationStage } from '~/resources/utils/sitemap/stages/contentStage'
import {
  filterEntriesForSiteLocale,
  flattenCandidatesToEntries,
} from '~/resources/utils/sitemap/stages/entryFlattenStage'
import { HubUrlStage } from '~/resources/utils/sitemap/stages/hubStage'
import { PaginationDerivationStage } from '~/resources/utils/sitemap/stages/paginationStage'
import type {
  ResourcesSitemapEntry,
  SiteLocale,
  SitemapPipelineContext,
  SitemapPipelineStage,
  SitemapUrlCandidate,
} from '~/resources/utils/sitemap/types'

const DEFAULT_PIPELINE: readonly SitemapPipelineStage[] = [
  new HubUrlStage(),
  new SanityContentAggregationStage(),
  new PaginationDerivationStage(),
]

function createPipelineContext(rows: SitemapRow[]): SitemapPipelineContext {
  return {
    rows,
    itemsPerPage: siteConfig.pagination.childItemsPerPage,
    locales: SITE_LOCALES,
  }
}

function runCandidatePipeline(
  stages: readonly SitemapPipelineStage[],
  context: SitemapPipelineContext,
): SitemapUrlCandidate[] {
  const candidateBatches: SitemapUrlCandidate[][] = stages.map((stage) =>
    stage.execute([], context),
  )
  return candidateBatches.flat()
}


export class ResourcesSitemapMappingEngine {
  private readonly stages: readonly SitemapPipelineStage[]

  constructor(stages: readonly SitemapPipelineStage[] = DEFAULT_PIPELINE) {
    this.stages = stages
  }

  buildCandidates(rows: SitemapRow[]): SitemapUrlCandidate[] {
    return runCandidatePipeline(this.stages, createPipelineContext(rows))
  }

  buildEntries(rows: SitemapRow[]): ResourcesSitemapEntry[] {
    const candidates = this.buildCandidates(rows)
    return flattenCandidatesToEntries(candidates, SITE_LOCALES)
  }

  buildEntriesForLocale(
    rows: SitemapRow[],
    locale: SiteLocale,
  ): ResourcesSitemapEntry[] {
    return filterEntriesForSiteLocale(this.buildEntries(rows), locale)
  }
}

export const defaultResourcesSitemapEngine = new ResourcesSitemapMappingEngine()

export function buildResourcesSitemapEntries(
  rows: SitemapRow[],
): ResourcesSitemapEntry[] {
  return defaultResourcesSitemapEngine.buildEntries(rows)
}

export function buildResourcesSitemapEntriesForLocale(
  rows: SitemapRow[],
  locale: SiteLocale,
): ResourcesSitemapEntry[] {
  return defaultResourcesSitemapEngine.buildEntriesForLocale(rows, locale)
}
