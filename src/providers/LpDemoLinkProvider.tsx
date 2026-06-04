import React, { createContext, useContext, useMemo } from 'react'

interface LpDemoLinkProviderProps {
  children: React.ReactNode
  demoLink?: string
}

const LpDemoLinkContext = createContext<string | undefined>(undefined)

export const useLpDemoLink = () => useContext(LpDemoLinkContext)

export default function LpDemoLinkProvider({
  children,
  demoLink,
}: LpDemoLinkProviderProps) {
  const normalizedDemoLink = useMemo(() => {
    const value = demoLink?.trim()
    return value || undefined
  }, [demoLink])

  return (
    <LpDemoLinkContext.Provider value={normalizedDemoLink}>
      {children}
    </LpDemoLinkContext.Provider>
  )
}
