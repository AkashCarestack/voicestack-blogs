declare global {
  interface Window {
    __resourcesRegionalUrl?: string
    __resourcesRestoreRegionalUrl?: () => void
    __resourcesRegionalUrlTimer?: number | null
  }
}

export {}
