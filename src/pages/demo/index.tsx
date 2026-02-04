import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
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
  
  // Get practiceType from query params, default to "Dental"
  const practiceType = (router.query.practiceType as string) || 'Dental'
  
  // Find the matching form data based on practiceType
  const activeFormData = formData?.demoForms?.find((form) => form.practiceType === practiceType)
  
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

