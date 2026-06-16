import { isPostDetailContentType } from '~/resources/utils/sitemap/contentTypeRegistry'
import { PAGINATED_SECTIONS } from '~/resources/utils/sitemap/constants'
import {
  assignAllLocaleVariants,
  createEmptyVariantMatrix,
} from '~/resources/utils/sitemap/variantMatrix'
import type {
  SitemapPipelineContext,
  SitemapPipelineStage,
  SitemapUrlCandidate,
} from '~/resources/utils/sitemap/types'

export class PaginationDerivationStage implements SitemapPipelineStage {
  readonly name = 'pagination-derivation'

  execute(
    _candidates: SitemapUrlCandidate[],
    context: SitemapPipelineContext,
  ): SitemapUrlCandidate[] {
    const countMatrix = new Map<string, number>()

    context.rows.forEach((row) => {
      if (!row.contentType || !isPostDetailContentType(row.contentType)) return
      const locale = row.language || 'en'
      const key = `${locale}::${row.contentType}`
      countMatrix.set(key, (countMatrix.get(key) || 0) + 1)
    })

    const paginationCandidates: SitemapUrlCandidate[] = []

    context.locales.forEach((locale) => {
      PAGINATED_SECTIONS.forEach((section) => {
        const count = countMatrix.get(`${locale}::${section}`) || 0
        const totalPages = Math.ceil(count / context.itemsPerPage)
        if (totalPages < 2) return

        for (let page = 2; page <= totalPages; page++) {
          const path = `${section}/page/${page}`
          const variants = createEmptyVariantMatrix()
          assignAllLocaleVariants(variants, path, context.locales)
          paginationCandidates.push({ variants })
        }
      })
    })

    return paginationCandidates
  }
}
