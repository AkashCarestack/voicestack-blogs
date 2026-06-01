import React, { createContext, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'

import {
  DEFAULT_LP_DEMO_CTA,
  LP_MANGO_CTA_LABEL,
  resolveLpCtaText,
  shouldUseMangoLpCopy,
} from '~/utils/lpMangoCta'

interface LpMangoCopyContextValue {
  enabled: boolean
  ctaLabel: string
}

const LpMangoCopyContext = createContext<LpMangoCopyContextValue | null>(null)

interface LpMangoCopyProviderProps {
  children: React.ReactNode
  enabled?: boolean
  slug?: string
  ctaLabel?: string
}

export function useLpMangoCopy() {
  return useContext(LpMangoCopyContext)
}

export function useLpMangoCopyEnabled() {
  const context = useLpMangoCopy()
  const router = useRouter()

  return useMemo(() => {
    if (context?.enabled) return true

    const path = router.asPath || router.pathname || ''
    return shouldUseMangoLpCopy(path)
  }, [context?.enabled, router.asPath, router.pathname])
}

export function useLpCtaText(text?: string) {
  const enabled = useLpMangoCopyEnabled()
  const context = useLpMangoCopy()

  return useMemo(() => {
    const resolved = resolveLpCtaText(text, enabled)
    if (enabled && /book\s*free\s*demo/i.test((text || DEFAULT_LP_DEMO_CTA).trim())) {
      return context?.ctaLabel || LP_MANGO_CTA_LABEL
    }
    return resolved
  }, [context?.ctaLabel, enabled, text])
}

export default function LpMangoCopyProvider({
  children,
  enabled = true,
  slug,
  ctaLabel = LP_MANGO_CTA_LABEL,
}: LpMangoCopyProviderProps) {
  const router = useRouter()
  const path = router.asPath || router.pathname || ''
  const isEnabled =
    enabled &&
    (slug ? shouldUseMangoLpCopy(slug) || shouldUseMangoLpCopy(path) : shouldUseMangoLpCopy(path))

  const value = useMemo(
    () => ({
      enabled: isEnabled,
      ctaLabel,
    }),
    [ctaLabel, isEnabled],
  )

  return (
    <LpMangoCopyContext.Provider value={value}>
      {children}
    </LpMangoCopyContext.Provider>
  )
}
