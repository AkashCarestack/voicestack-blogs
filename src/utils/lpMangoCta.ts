export const LP_MANGO_CTA_LABEL = 'Make the Switch'
export const DEFAULT_LP_DEMO_CTA = 'Book Free Demo'

export function isMangoLpSlug(slugOrPath?: string) {
  if (!slugOrPath) return false

  const normalized = slugOrPath.toLowerCase()
  return normalized.includes('mango-voice') || normalized.includes('mango')
}

export function shouldUseMangoLpCopy(slugOrPath?: string) {
  return isMangoLpSlug(slugOrPath)
}

export function resolveLpCtaText(text?: string, useMangoCopy = false) {
  const value = (text || DEFAULT_LP_DEMO_CTA).trim()

  if (!useMangoCopy) {
    return value || DEFAULT_LP_DEMO_CTA
  }

  if (/book\s*free\s*demo/i.test(value)) {
    return LP_MANGO_CTA_LABEL
  }

  return value
}
