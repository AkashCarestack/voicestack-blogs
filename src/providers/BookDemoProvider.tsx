import React, { createContext, useContext, useEffect, useState } from 'react'

interface DemoFormData {
  demoFormId?: string
  demoMeetingLink?: string
  dmeoFormEventName?: string
  redirectLink?: string
  schedulerLink?: string
  demoForms?: Array<{
    practiceType?: string
    demoFormId?: string
    demoMeetingLink?: string
  }>
  pricingDemoForms?: Array<{
    practiceType?: string
    demoFormId?: string
    demoMeetingLink?: string
  }>
}

interface BookDemoContextType {
  // Existing
  isDemoPopUpShown: boolean
  setIsDemoPopUpShown: (value: boolean) => void
  // New
  formData: DemoFormData | null
  region: string
  loading: boolean
  error: string | null
}

const BookDemoContext = createContext<BookDemoContextType>({
  isDemoPopUpShown: false,
  setIsDemoPopUpShown: () => {},
  formData: null,
  region: 'en',
  loading: true,
  error: null,
})

export const useBookDemo = () => {
  const context = useContext(BookDemoContext)
  if (!context) {
    throw new Error('useBookDemo must be used within a BookDemoContextProvider')
  }
  return context
}

export const useDemoFormData = () => {
  const context = useContext(BookDemoContext)
  if (!context) {
    throw new Error('useDemoFormData must be used within a BookDemoContextProvider')
  }
  return {
    formData: context.formData,
    region: context.region,
    loading: context.loading,
    error: context.error,
  }
}

interface BookDemoContextProviderProps {
  children: React.ReactNode
  initialFormData?: DemoFormData | null
  region?: string
}

export default function BookDemoContextProvider({
  children,
  initialFormData = null,
  region = 'en',
}: BookDemoContextProviderProps) {
  const [isDemoPopUpShown, setIsDemoPopUpShown] = useState(false)
  const [formData, setFormData] = useState<DemoFormData | null>(initialFormData)
  const [loading, setLoading] = useState(!initialFormData)
  const [error, setError] = useState<string | null>(null)

  // Sync props to state when they change (important for client-side navigation)
  useEffect(() => {
    if (initialFormData !== null && initialFormData !== undefined) {
      setFormData(initialFormData)
      setLoading(false)
      setError(null)
    }
  }, [initialFormData])

  return (
    <BookDemoContext.Provider
      value={{
        isDemoPopUpShown,
        setIsDemoPopUpShown,
        formData,
        region,
        loading,
        error,
      }}
    >
      {children}
    </BookDemoContext.Provider>
  )
}
