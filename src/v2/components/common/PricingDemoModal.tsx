import * as React from 'react'
import { useRouter } from 'next/router'
import PricingHubspotForm from './PricingHubspotForm'
import PricingHubspotMeeting from './PricingHubspotMeeting'
import pricingDemoTrackingNames from '~/v2/data/pricingDemoTrackingNames.json'
import { X } from 'lucide-react'
import { useDemoFormData } from '~/providers/BookDemoProvider'
import { resolveDemoMeetingLink } from '~/utils/resolveDemoMeetingLink'

export interface PricingDemoModalProps {
  className?: string
  onClose?: () => void
  initialPracticeType: string
  initialLocationCount?: number
}

const PricingDemoModal: React.FC<PricingDemoModalProps> = ({
  className,
  onClose,
  initialPracticeType,
  initialLocationCount,
}) => {
  const router = useRouter()
  const { formData, region } = useDemoFormData()

  const [locationCount, setLocationCount] = React.useState<number | undefined>(initialLocationCount)

  React.useEffect(() => {
    setLocationCount(initialLocationCount)
  }, [initialPracticeType, initialLocationCount])

  // Find the matching form data based on selected practice type
  const activeFormData = formData?.pricingDemoForms?.find(
    (form) => form.practiceType === initialPracticeType
  )

  const formId = activeFormData?.demoFormId
  const practiceTypeSlug = activeFormData?.practiceType?.toLowerCase().replace(' ', '_')

  const regionKey = region === 'en-GB' ? 'uk' : region === 'en-AU' ? 'au' : 'us'
  const eventName =
    pricingDemoTrackingNames[regionKey as keyof typeof pricingDemoTrackingNames] ||
    pricingDemoTrackingNames.us
  const formDetails = practiceTypeSlug ? `${practiceTypeSlug}_${router.locale}` : undefined

  const resolvedMeetingLink = resolveDemoMeetingLink(activeFormData, locationCount)

  const hasMeetingLink =
    resolvedMeetingLink && typeof resolvedMeetingLink === 'string' && resolvedMeetingLink.trim()

  return (
    <div
      className={`relative z-[1000] ${className || ''}`}
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
          className="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
        >
          <div
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full 
              ${hasMeetingLink
                ? 'sm:min-w-[950px] sm:max-w-[950px]'
                : 'sm:max-w-lg'}
              min-h-[670px]
            `}
          >
            <div className={`bg-white pb-4 pt-5 sm:p-6 sm:pb-4 ${hasMeetingLink ? 'px-0' : 'px-4'}`}>
              <div className="sm:flex sm:items-start">
                <div
                  className={`sm:mt-0 sm:text-left w-full flex flex-col gap-0
                
                ${hasMeetingLink ? 'px-1' : 'px-4'}
                `}
                >
                  <div className={`flex mt-4 justify-between w-full ${hasMeetingLink ? 'px-4' : 'px-0'}`}>
                    <div className="flex flex-col gap-2"></div>

                    <button
                      type="button"
                      className="w-10 h-10 flex justify-end items-start cursor-pointer hover:text-gray-950 text-gray-600"
                      onClick={onClose}
                    >
                      <div className="w-5">
                        <X className="w-6 h-6" />
                      </div>
                    </button>
                  </div>

                  <div className="mt-2 w-full mb-8">
                    {(() => {
                      if (resolvedMeetingLink && typeof resolvedMeetingLink === 'string' && resolvedMeetingLink.trim()) {
                        return (
                          <div className="w-full min-h-[500px]">
                            <PricingHubspotMeeting
                              meetingLink={resolvedMeetingLink.trim()}
                              locations={locationCount}
                              eventName={eventName}
                              formDetails={formDetails}
                            />
                          </div>
                        )
                      }
                      if (formId && typeof formId === 'string' && formId.trim()) {
                        return (
                          <div className="w-full">
                            <PricingHubspotForm
                              id={formId.trim()}
                              eventName={eventName}
                              formDetails={formDetails}
                              followUpMeetingLink={formData?.demoMeetingLink || ''}
                            />
                          </div>
                        )
                      }
                      return (
                        <div className="w-full text-center py-8">
                          <p className="text-gray-500">
                            No form or meeting link available for this practice type.
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingDemoModal
