import * as React from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import { getPricingDemoModalCallback } from '~/utils/pricingDemoModal'
import { X } from 'lucide-react'
import { useDemoFormData } from '~/providers/BookDemoProvider'
import { hasSecondaryMeetingLink } from '~/utils/resolveDemoMeetingLink'
import Button from '~/components/common/Button'

export interface PracticeTypeModalProps {
  className?: string
  onClose?: () => void
  locale?: string
  onPracticeTypeSelect?: (practiceType: string) => void
  hideCloseButton?: boolean
}

export const PracticeTypeModal: React.FC<PracticeTypeModalProps> = ({
  className,
  onClose,
  locale,
  onPracticeTypeSelect,
  hideCloseButton = false,
}) => {
  const router = useRouter()
  const { formData } = useDemoFormData()

  const [step, setStep] = React.useState<'practice' | 'locations'>('practice')
  const [selectedPracticeType, setSelectedPracticeType] = React.useState<string | null>(null)
  const [locationsInput, setLocationsInput] = React.useState('')
  const [locationsError, setLocationsError] = React.useState<string | null>(null)

  // Check if we're on a pricing page
  const isPricingPage = React.useMemo(() => {
    const pathname = router.pathname
    const asPath = router.asPath.split('?')[0] // Remove query params
    return pathname === '/pricing' || asPath === '/pricing' || asPath.endsWith('/pricing')
  }, [router.pathname, router.asPath])

  const formsForPage = React.useMemo(() => {
    if (!formData) return []
    const forms = isPricingPage ? formData.pricingDemoForms : formData.demoForms
    return forms && Array.isArray(forms) ? forms : []
  }, [formData, isPricingPage])

  // Get available practice types from form data
  const practiceTypes = React.useMemo(() => {
    return formsForPage
      .map((form) => form?.practiceType)
      .filter((practiceType): practiceType is string => Boolean(practiceType))
  }, [formsForPage])

  const navigateToDemo = (practiceType: string, locations?: number) => {
    const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
    const basePath = `${localePrefix}/demo`

    const currentSearch = router.asPath.includes('?')
      ? router.asPath.split('?')[1].split('#')[0]
      : ''
    const currentParams = new URLSearchParams(currentSearch)

    currentParams.delete('flag')
    currentParams.delete('slug')
    currentParams.set('practiceType', practiceType)

    if (locations !== undefined) {
      currentParams.set('locations', String(locations))
    } else {
      currentParams.delete('locations')
    }

    if (router.query.referrer) {
      currentParams.set('referrer', router.query.referrer as string)
    }

    const queryString = currentParams.toString()
    const finalUrl = queryString ? `${basePath}?${queryString}` : basePath

    router.push(finalUrl)

    if (onClose) {
      onClose()
    }
  }

  const handlePracticeTypeSelect = (practiceType: string) => {
    // If callback prop is provided, use it
    if (onPracticeTypeSelect) {
      if (onClose) {
        onClose()
      }
      onPracticeTypeSelect(practiceType)
      return
    }

    const row = formsForPage.find((f) => f?.practiceType === practiceType)
    if (hasSecondaryMeetingLink(row)) {
      setSelectedPracticeType(practiceType)
      setStep('locations')
      setLocationsInput('')
      setLocationsError(null)
      return
    }

    // If on pricing page and no locations prompt is needed, trigger pricing demo modal.
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

    navigateToDemo(practiceType)
  }

  const handleLocationsContinue = () => {
    if (!selectedPracticeType) return
    const trimmed = locationsInput.trim()
    if (!trimmed) {
      setLocationsError('Please enter the number of locations.')
      return
    }
    const n = parseInt(trimmed, 10)
    if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) {
      setLocationsError('Please enter a valid whole number (1 or greater).')
      return
    }
    setLocationsError(null)

    if (isPricingPage) {
      const pricingDemoCallback = getPricingDemoModalCallback()
      if (pricingDemoCallback) {
        if (onClose) {
          onClose()
        }
        pricingDemoCallback(selectedPracticeType, n)
        return
      }
    }

    navigateToDemo(selectedPracticeType, n)
  }

  const handleBackToPracticeTypes = () => {
    setStep('practice')
    setSelectedPracticeType(null)
    setLocationsInput('')
    setLocationsError(null)
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
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
          >
            <div className="bg-white px-4 pb-8 pt-5 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 px-4 sm:mt-0 sm:text-left w-full flex flex-col gap-6">
                  {/* {step === 'practice' && ( */}
                    <div className="flex mt-4 justify-between w-full">
                      
                      <div className="flex flex-col gap-2">
                        <h3
                          className="text-2xl font-semibold leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Book Free Demo
                        </h3>

                        <p className="text-gray-500">
                          Start your transition to VoiceStack. <br /> Book a demo with us today.
                        </p>
                      </div>

                      {!hideCloseButton && (
                        <button
                        type="button"
                        className="w-10 h-10 flex justify-end items-start cursor-pointer hover:text-gray-950 text-gray-600"
                        onClick={onClose}
                        >
                        <div className="w-5">
                          <X className="w-6 h-6" />
                        </div>
                      </button>
                      )}
                    </div>  
                  {/* )} */}

                  {step === 'practice' && (
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
                          <p className="text-gray-500">
                            No practice types available at this time.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 'locations' && (
                    <div className="mt-2 w-full flex flex-col gap-2">
                      {/* <p className="text-base font-medium text-gray-900">Book A Demo  </p> */}
                      <p className="text-base font-medium text-gray-900">
                        How many locations do you have?
                      </p>
                      <div className="flex flex-col gap-1">
                        <label className="flex flex-col gap-1 text-left text-sm font-medium text-gray-700">
                          {/* Number of locations */}
                          <input
                            type="number"
                            min={1}
                            step={1}
                            inputMode="numeric"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900"
                            value={locationsInput}
                            onChange={(e) => {
                              setLocationsInput(e.target.value)
                              setLocationsError(null)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleLocationsContinue()
                            }}
                          />
                        </label>
                        {locationsError && (
                          <p className="text-sm text-red-600">{locationsError}</p>
                        )}  
                      </div>
                      
                      <div className="flex gap-2 flex-row justify-between mt-4">
                       
                        <Button
                          type="secondary"
                          className="w-fit"
                          onClick={handleBackToPracticeTypes}
                        >
                          <span>
                          Back
                          </span>
                        </Button>
                        <Button
                          type="primary"
                          className="w-fit"
                          onClick={handleLocationsContinue}
                        >
                          <span>Continue</span>
                        </Button>
                      </div>
                    </div>
                  )}
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
