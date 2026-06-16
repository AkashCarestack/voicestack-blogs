declare global {
  interface Window {
    hbspt?: {
      forms?: {
        create?: (options: {
          portalId: string
          formId: string
          target: string
          onFormReady?: (form: unknown) => void
          onFormSubmit?: (form: unknown) => void
        }) => void
      }
    }
    dataLayer?: Record<string, unknown>[]
  }
}

export {}
