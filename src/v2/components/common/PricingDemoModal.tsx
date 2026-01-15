import * as React from 'react'
import { useRouter } from 'next/router'
import { CloseIcon } from '@sanity/icons'
import PricingHubspotForm from './PricingHubspotForm'
import PricingHubspotMeeting from './PricingHubspotMeeting'
import demoTrackingNames from '~/v2/data/demoTrackingNames.json'
import { Cross, X } from 'lucide-react'

export interface PricingDemoModalProps {
  className?: string
  onClose?: () => void
  formData?: {
    pricingDemoForms?: Array<{
      practiceType?: string
      demoFormId?: string
      demoMeetingLink?: string
    }>
  }
  region?: string
  initialPracticeType?: string
}

// Hardcoded practice types matching the Sanity schema
const PRACTICE_TYPES = ['Dental', 'Optometry', 'Physical Therapy', 'Veterinary']

const PricingDemoModal: React.FC<PricingDemoModalProps> = ({
  className,
  onClose,
  formData,
  region = 'en',
  initialPracticeType,
}) => {
  const router = useRouter()
  const [selectedPracticeType, setSelectedPracticeType] = React.useState<string | null>(
    initialPracticeType || null
  )

  // Find the matching form data based on selected practice type
  const activeFormData = selectedPracticeType
    ? formData?.pricingDemoForms?.find((form) => form.practiceType === selectedPracticeType)
    : null

  // Use activeFormData if found
  const formId = activeFormData?.demoFormId
  const meetingLink = activeFormData?.demoMeetingLink
  const practiceTypeSlug = activeFormData?.practiceType?.toLowerCase().replace(' ', '_')
  
  // Map region to tracking name key
  const regionKey = region === 'en-GB' ? 'uk' : region === 'en-AU' ? 'au' : 'us'
  const eventName = demoTrackingNames[regionKey as keyof typeof demoTrackingNames] || demoTrackingNames.us
  const formDetails = practiceTypeSlug ? `${practiceTypeSlug}_${router.locale}` : undefined

  const handlePracticeTypeSelect = (practiceType: string) => {
    setSelectedPracticeType(practiceType)
  }

  // Show practice type selection if no practice type is selected
  const showPracticeTypeSelection = !selectedPracticeType

  // Check if we have a meeting link (for wider modal)
  const hasMeetingLink = meetingLink && typeof meetingLink === 'string' && meetingLink.trim()

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
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8  min-h-[670px] w-full ${
              hasMeetingLink 
                ? 'sm:min-w-[950px] sm:max-w-[950px]' 
                : 'sm:max-w-lg'
            }`}
          >
            <div className={`bg-white pb-4 pt-5 sm:p-6 sm:pb-4 ${hasMeetingLink ? 'px-0' : 'px-4'}`}>
              <div className="sm:flex sm:items-start">
                <div className={`sm:mt-0 sm:text-left w-full flex flex-col gap-0
                
                ${hasMeetingLink ? 'px-1' : 'px-4'}
                `}>
                  <div className={`flex mt-4 justify-between w-full ${hasMeetingLink ? 'px-4' : 'px-0'}`}>
                  {/* {hasMeetingLink ? (
                      <></>
                      ):( */}
                    <div className="flex flex-col gap-2">
                      {/* <h3
                        className="text-2xl font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        {showPracticeTypeSelection ? 'Book Free Demo' : 'Book Free Demo'}
                      </h3>
                     
                        <p className="text-gray-500">
                          {showPracticeTypeSelection
                            ? 'Start your transition to VoiceStack. Book a demo with us today.'
                            : 'Start your transition to VoiceStack. Book a demo with us today.'}
                        </p> */}
                    </div>
                      {/* )} */}

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

                  {showPracticeTypeSelection ? (
                    <div className="mt-2 w-full">
                      <p className="text-base font-medium text-gray-900 mb-4">
                        Choose your practice type
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        {PRACTICE_TYPES.map((practiceType) => (
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
                    </div>
                  ) : (
                    <div className="mt-2 w-full mb-8">
                      {(() => {
                        // Render meeting if meetingLink exists and is valid (prioritize meeting over form)
                        if (meetingLink && typeof meetingLink === 'string' && meetingLink.trim()) {
                          return (
                            <div className="w-full min-h-[500px]">
                              <PricingHubspotMeeting 
                                meetingLink={meetingLink.trim()}
                                eventName={eventName}
                                formDetails={formDetails}
                              />
                            </div>
                          )
                        }
                        // Render form if formId exists and is valid
                        if (formId && typeof formId === 'string' && formId.trim()) {
                          return (
                            <div className="w-full">
                              <PricingHubspotForm 
                                id={formId.trim()} 
                                eventName={eventName} 
                                formDetails={formDetails}
                                // meetingLink={meetingLink}
                              />
                            </div>
                          )
                        }
                        // No form or meeting available
                        return (
                          <div className="w-full text-center py-8">
                            <p className="text-gray-500">No form or meeting link available for this practice type.</p>
                          </div>
                        )
                      })()}
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
}

export default PricingDemoModal
