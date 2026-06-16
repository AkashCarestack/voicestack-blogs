import React, { createContext, useCallback, useContext, useMemo } from 'react'

const DEFAULT_LP_DEMO_CTA = 'Book Free Demo'

interface LpDemoLinkProviderProps {
  children: React.ReactNode
  demoLink?: string
  buttonText?: string
}

interface LpDemoLinkContextValue {
  demoLink?: string
  buttonText?: string
}

const LpDemoLinkContext = createContext<LpDemoLinkContextValue | undefined>(undefined)

export const useLpDemoLink = () => useContext(LpDemoLinkContext)?.demoLink

export function resolveLpCtaText(text?: string, buttonText?: string) {
  const value = (text || DEFAULT_LP_DEMO_CTA).trim()
  const fallback = value || DEFAULT_LP_DEMO_CTA

  if (!buttonText) {
    return fallback
  }

  return /book\s*free\s*demo/i.test(fallback) ? buttonText : fallback
}

export function useLpCtaTextResolver() {
  const context = useContext(LpDemoLinkContext)

  return useCallback(
    (text?: string) => resolveLpCtaText(text, context?.buttonText),
    [context?.buttonText],
  )
}

export default function LpDemoLinkProvider({
  children,
  demoLink,
  buttonText,
}: LpDemoLinkProviderProps) {
  const normalizedDemoLink = useMemo(() => {
    const value = demoLink?.trim()
    return value || undefined
  }, [demoLink])

  const normalizedButtonText = useMemo(() => {
    const value = buttonText?.trim()
    return value || undefined
  }, [buttonText])

  const value = useMemo(
    () => ({
      demoLink: normalizedDemoLink,
      buttonText: normalizedButtonText,
    }),
    [normalizedButtonText, normalizedDemoLink],
  )

  return (
    <LpDemoLinkContext.Provider value={value}>
      {children}
    </LpDemoLinkContext.Provider>
  )
}
