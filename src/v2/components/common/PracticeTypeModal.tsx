import * as React from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import { getPricingDemoModalCallback } from '~/utils/pricingDemoModal'
import { X } from 'lucide-react'
import { useDemoFormData } from '~/providers/BookDemoProvider'

export interface PracticeTypeModalProps {
  className?: string
  onClose?: () => void
  locale?: string
  onPracticeTypeSelect?: (practiceType: string) => void
}

export const PracticeTypeModal: React.FC<PracticeTypeModalProps> = ({
  className,
  onClose,
  locale,
  onPracticeTypeSelect,
}) => {
  const router = useRouter()
  const { formData } = useDemoFormData()

  // Check if we're on a pricing page
  const isPricingPage = React.useMemo(() => {
    const pathname = router.pathname
    const asPath = router.asPath.split('?')[0] // Remove query params
    return pathname === '/pricing' || asPath === '/pricing' || asPath.endsWith('/pricing')
  }, [router.pathname, router.asPath])
  
  // Get available practice types from form data
  const practiceTypes = React.useMemo(() => {
    if (!formData) return []
    
    // On pricing page, use pricingDemoForms; otherwise use demoForms
    const forms = isPricingPage ? formData.pricingDemoForms : formData.demoForms
    
    if (!forms || !Array.isArray(forms)) return []
    
    // Extract practice types, filtering out null/undefined
    return forms
      .map((form) => form?.practiceType)
      .filter((practiceType): practiceType is string => Boolean(practiceType))
  }, [formData, isPricingPage])

  const handlePracticeTypeSelect = (practiceType: string) => {
    // If callback prop is provided, use it
    if (onPracticeTypeSelect) {
      if (onClose) {
        onClose()
      }
      onPracticeTypeSelect(practiceType)
      return
    }

    // If on pricing page, try to use the global callback
    if (isPricingPage) {
      const pricingDemoCallback = getPricingDemoModalCallback()
      if (pricingDemoCallback) {
        if (onClose) {
          onClose()
        }
        pricingDemoCallback(practiceType)
        return
      }
    }

    // Otherwise, navigate to demo page (existing behavior)
    // Get current query params from router.asPath
    const asPath = router.asPath.split('?')[0] // Get path without query
    const currentSearch = router.asPath.includes('?') 
      ? router.asPath.split('?')[1].split('#')[0] 
      : ''
    const currentParams = new URLSearchParams(currentSearch)
    
    // Add or update practiceType param (use exact value from schema: Dental, Optometry, Physical Therapy, Veterinary)
    currentParams.set('practiceType', practiceType)
    
    // Remove internal params that shouldn't be in URL
    currentParams.delete('flag')
    currentParams.delete('slug')
    
    // Build the demo URL with locale
    const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
    const basePath = `${localePrefix}/demo`
    
    // Build final URL with query string
    const queryString = currentParams.toString()
    const finalUrl = queryString ? `${basePath}?${queryString}` : basePath
    
    // Navigate to demo page with practiceType
    router.push(finalUrl)
    
    // Close modal
    if (onClose) {
      onClose()
    }
  }

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] ${className || ''}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-950 bg-opacity-60 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="bg-white px-4 pb-8 pt-5 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 px-4 sm:mt-0 sm:text-left w-full flex flex-col gap-6">
                  <div className="flex mt-4 justify-between w-full">
                    <div className="flex flex-col gap-2">
                      <h3
                        className="text-2xl font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Book Free Demo
                      </h3>

                      <p className="text-gray-500">
                        Start your transition to VoiceStack. <br/> Book a demo with us today.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="w-10 h-10 flex justify-end items-start cursor-pointer hover:text-gray-950 text-gray-600"
                      onClick={onClose}
                    >
                      <div className="w-5">
                        {/* <CloseIcon></CloseIcon> */}
                        <X className="w-6 h-6" />
                      </div>
                    </button>
                  </div>

                  <div className="mt-2 w-full">
                    <p className="text-base font-medium text-gray-900 mb-4">
                      Choose your practice type
                    </p>
                    
                    {practiceTypes.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {practiceTypes.map((practiceType) => (
                          <button
                            key={practiceType}
                            type="button"
                            onClick={() => handlePracticeTypeSelect(practiceType)}
                            className="w-full px-4 py-3 bg-gray-100 hover:bg-vs-lemon-green rounded-lg transition-colors text-gray-950 font-medium text-center"
                          >
                            {practiceType}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No practice types available at this time.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Use portal to render modal to body, ensuring it's always on top
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}

