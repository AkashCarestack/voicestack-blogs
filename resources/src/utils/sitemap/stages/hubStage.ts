import {
  assignAllLocaleVariants,
  createEmptyVariantMatrix,
} from '~/resources/utils/sitemap/variantMatrix'
import { HUB_PATHS } from '~/resources/utils/sitemap/constants'
import type {
  SitemapPipelineContext,
  SitemapPipelineStage,
  SitemapUrlCandidate,
} from '~/resources/utils/sitemap/types'

export class HubUrlStage implements SitemapPipelineStage {
  readonly name = 'hub-url-expansion'

  execute(
    _candidates: SitemapUrlCandidate[],
    context: SitemapPipelineContext,
  ): SitemapUrlCandidate[] {
    const hubCandidates: SitemapUrlCandidate[] = []

    const homeVariants = createEmptyVariantMatrix()
    assignAllLocaleVariants(homeVariants, '', context.locales)
    hubCandidates.push({ variants: homeVariants })

    HUB_PATHS.forEach((path) => {
      const variants = createEmptyVariantMatrix()
      assignAllLocaleVariants(variants, path, context.locales)
      hubCandidates.push({ variants })
    })

    return hubCandidates
  }
}
