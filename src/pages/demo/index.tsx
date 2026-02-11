import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { readToken } from '~/lib/sanity.api'
import HubSpotForm from '~/v2/components/common/HubspotForm'
import Head from 'next/head'
import HubSpotMeeting from '~/v2/components/common/HubspotMeeting'
import demoTrackingNames from '~/v2/data/demoTrackingNames.json'
import { useDemoFormData } from '~/providers/BookDemoProvider'

interface DemoPageProps {
  draftMode: boolean
  token: string
}

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = false,
}) => {
  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}


export default function DemoPage({}: DemoPageProps) {
  const router = useRouter()
  const { formData, region } = useDemoFormData()
  
  // For en-AU, remove only practiceType param from URL, keep all other params (like UTM)
  useEffect(() => {
    if (region === 'en-AU' && router.query.practiceType) {
      const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
      const currentParams = new URLSearchParams(window.location.search)
      
      // Remove only practiceType, keep all other params
      currentParams.delete('practiceType')
      
      // Build new URL with remaining params
      const remainingParams = currentParams.toString()
      const newUrl = remainingParams 
        ? `${localePrefix}/demo?${remainingParams}`
        : `${localePrefix}/demo`
      
      router.replace(newUrl, undefined, { shallow: true })
    }
  }, [region, router])
  
  // For en-AU, use the first form without query params
  // For other regions, use practiceType from query params
  let activeFormData
  if (region === 'en-AU') {
    // Use the first form from demoForms array, or fall back to default formData
    activeFormData = formData?.demoForms?.[0] || (formData?.demoFormId ? {
      demoFormId: formData.demoFormId,
      demoMeetingLink: formData.demoMeetingLink,
      practiceType: 'Dental'
    } : null)
  } else {
    // Get practiceType from query params, default to "Dental"
    const practiceType = (router.query.practiceType as string) || 'Dental'
    // Find the matching form data based on practiceType
    activeFormData = formData?.demoForms?.find((form) => form.practiceType === practiceType)
  }
  
  // Use activeFormData if found, otherwise fall back to default formData
  const formId = activeFormData?.demoFormId
  const meetingLink = activeFormData?.demoMeetingLink
  const practiceTypeSlug = activeFormData?.practiceType?.toLowerCase().replace(' ', '_')
  
  // Map region to tracking name key
  const regionKey = region === 'en-GB' ? 'uk' : region === 'en-AU' ? 'au' : 'us'
  const eventName = demoTrackingNames[regionKey as keyof typeof demoTrackingNames] || demoTrackingNames.us
  const formDetails = `${practiceTypeSlug}_${router.locale}`; 
  
  return (
    <>
      <Head>
        <title>Demo | Book A Free No-Obligation VoiceStack® Demo Today</title>
        <meta name="description" content="Request a free, no-obligation demonstration of VoiceStack's AI-powered dental phone system to receive a personalized walkthrough with one of our experts." />
        <meta name="keywords" content="voicestack demo, voicestack demo request, voicestack visual overview" />
      </Head>
      <div className="py-24 px-4">
        <div className="w-full gap-4 flex flex-col items-center">
          <div className="flex flex-col w-full items-center max-w-[780px] text-center gap-4 pb-8">
            <div className="max-w-[620px] flex flex-col gap-4">
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                Book Free Demo
              </h1>
              <p className="text-gray-500">
                Start your transition to VoiceStack. <br /> Book a demo with us today.
              </p>
            </div>
          </div>
          {formId && (
            <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-6 min-h-[500px]">
                <HubSpotForm 
                  id={formId} 
                  eventName={eventName} 
                  formDetails={formDetails}
                />
            </div>
          )}
          {meetingLink && (
            <div className="w-full min-h-[500px]">
              <HubSpotMeeting 
                meetingLink={meetingLink}
                eventName={eventName}
                formDetails={formDetails}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

