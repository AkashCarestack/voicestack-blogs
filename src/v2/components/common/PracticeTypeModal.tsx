import * as React from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import { GeistSans } from 'geist/font/sans'
import { Manrope } from 'next/font/google'
import { getPricingDemoModalCallback } from '~/utils/pricingDemoModal'
import { X } from 'lucide-react'
import { useDemoFormData } from '~/providers/BookDemoProvider'
import {
  LOC_QUERY_PARAM,
  type LocCategory,
} from '~/utils/resolveDemoMeetingLink'
import Button from '~/components/common/Button'
import ButtonRadioGroup from './ButtonRadioGroup'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

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
  onPracticeTypeSelect,
  hideCloseButton = false,
}) => {
  const router = useRouter()
  const { formData } = useDemoFormData()

  const [selectedPracticeType, setSelectedPracticeType] = React.useState<string | null>(null)
  const [selectedLoc, setSelectedLoc] = React.useState<LocCategory>('lt15')

  const isPricingPage = React.useMemo(() => {
    const pathname = router.pathname
    const asPath = router.asPath.split('?')[0]
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

  const defaultPracticeType = React.useMemo(() => {
    if (!practiceTypes.length) return null
    const dental = practiceTypes.find((practiceType) => practiceType === 'Dental')
    return dental || practiceTypes[0]
  }, [practiceTypes])

  React.useEffect(() => {
    setSelectedPracticeType(defaultPracticeType)
  }, [defaultPracticeType])

  const navigateToDemo = (practiceType: string, loc: LocCategory) => {
    const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
    const basePath = `${localePrefix}/demo`

    const currentSearch = router.asPath.includes('?')
      ? router.asPath.split('?')[1].split('#')[0]
      : ''
    const currentParams = new URLSearchParams(currentSearch)

    currentParams.delete('flag')
    currentParams.delete('slug')
    currentParams.set('practiceType', practiceType)
    currentParams.delete('locations')
    currentParams.set(LOC_QUERY_PARAM, loc)

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

  const handleContinue = () => {
    if (!selectedPracticeType) return

    if (onPracticeTypeSelect) {
      if (onClose) {
        onClose()
      }
      onPracticeTypeSelect(selectedPracticeType)
      return
    }

    if (isPricingPage) {
      const pricingDemoCallback = getPricingDemoModalCallback()
      if (pricingDemoCallback) {
        if (onClose) {
          onClose()
        }
        pricingDemoCallback(selectedPracticeType, selectedLoc)
        return
      }
    }

    navigateToDemo(selectedPracticeType, selectedLoc)
  }

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] ${GeistSans.variable} ${manrope.variable} ${className || ''}`}
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
            className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-[520px]"
          >
            <div className="bg-white px-6 pt-8 pb-8 sm:px-8 font-geist">
              <div className="sm:flex sm:items-start">
                <div className="sm:mt-0 sm:text-left w-full flex flex-col gap-9">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="md:text-3xl text-2xl font-semibold leading-snug text-gray-900 font-manrope" id="modal-title">
                        Book Free Demo
                      </h3>
                      <p className="text-lg leading-7 text-gray-700">
                        Start your transition to VoiceStack.
                        <br />
                        Book a demo with us today.
                      </p>
                    </div>

                    {!hideCloseButton && (
                      <button
                        type="button"
                        className="w-10 h-10 flex justify-end items-start cursor-pointer hover:text-gray-950 text-gray-400"
                        onClick={onClose}
                      >
                        <div className="w-5">
                          <X className="w-6 h-6" />
                        </div>
                      </button>
                    )}
                  </div>

                  {!selectedPracticeType ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No practice types available at this time.</p>
                    </div>
                  ) : (
                    <>
                      {practiceTypes.length > 1 && (
                        <div className="w-full flex flex-col gap-3">
                          <p className="text-base font-geist font-medium text-gray-950">
                            What is your practice type?
                          </p>
                          <ButtonRadioGroup
                            name="practiceType"
                            value={selectedPracticeType}
                            onChange={setSelectedPracticeType}
                            options={practiceTypes.map((practiceType) => ({
                              value: practiceType,
                              label: practiceType,
                            }))}
                          />
                        </div>
                      )}

                      <div className="w-full flex flex-col gap-3">
                        <p className="text-base font-medium text-gray-950">
                          How many locations do you have?
                        </p>
                        <ButtonRadioGroup
                          name="locations"
                          value={selectedLoc}
                          onChange={(value) => setSelectedLoc(value as LocCategory)}
                          options={[
                            { value: 'lt15', label: 'Less than 15' },
                            { value: '15plus', label: '15 or more' },
                          ]}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-100 border-t border-gray-100 px-6 py-8 flex justify-center">
              <Button
                type="primary"
                className="w-full sm:w-auto"
                disabled={!selectedPracticeType}
                onClick={handleContinue}
              >
                <span>Continue &amp; Schedule Demo</span>
              </Button>
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
