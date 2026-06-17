import React, { createContext, useContext, useState } from 'react'

interface HeaderContextType {
  showTopStrip: boolean
  setShowTopStrip: (show: boolean) => void
  showMainHeader: boolean
  setShowMainHeader: (show: boolean) => void
  resourcesHeaderTop: number
  setResourcesHeaderTop: (top: number) => void
  showResourceCtas: boolean
  setShowResourceCtas: (show: boolean) => void
  isResourcesPage: boolean
  setIsResourcesPage: (isResources: boolean) => void
  hasRegionStrip: boolean
  setHasRegionStrip: (show: boolean) => void
}

const HeaderContext = createContext<HeaderContextType>({
  showTopStrip: true,
  setShowTopStrip: () => {},
  showMainHeader: true,
  setShowMainHeader: () => {},
  resourcesHeaderTop: 0,
  setResourcesHeaderTop: () => {},
  showResourceCtas: false,
  setShowResourceCtas: () => {},
  isResourcesPage: false,
  setIsResourcesPage: () => {},
  hasRegionStrip: false,
  setHasRegionStrip: () => {},
})

export const useHeaderContext = () => {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeaderContext must be used within a HeaderContextProvider')
  }
  return context
}

interface HeaderContextProviderProps {
  children: React.ReactNode
}

export default function HeaderContextProvider({ children }: HeaderContextProviderProps) {
  const [showTopStrip, setShowTopStrip] = useState(true)
  const [showMainHeader, setShowMainHeader] = useState(true)
  const [resourcesHeaderTop, setResourcesHeaderTop] = useState(0)
  const [showResourceCtas, setShowResourceCtas] = useState(false)
  const [isResourcesPage, setIsResourcesPage] = useState(false)
  const [hasRegionStrip, setHasRegionStrip] = useState(false)

  return (
    <HeaderContext.Provider
      value={{
        showTopStrip,
        setShowTopStrip,
        showMainHeader,
        setShowMainHeader,
        resourcesHeaderTop,
        setResourcesHeaderTop,
        showResourceCtas,
        setShowResourceCtas,
        isResourcesPage,
        setIsResourcesPage,
        hasRegionStrip,
        setHasRegionStrip,
      }}
    >
      {children}
    </HeaderContext.Provider>
  )
}
