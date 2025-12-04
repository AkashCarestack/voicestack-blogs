import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import type { SanityClient } from 'next-sanity'
import { getDemoFormData } from '~/lib/sanity.queries'
import HubSpotForm from '~/components/common/HubspotForm'
import Head from 'next/head'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'

interface DemoPageProps {
  formData: {
    dmeoFormId?: string
    demoMeetingLink?: string
    dmeoFormEventName?: string
  }
  region: string
  draftMode: boolean
  token: string
  initialMeetingsData?: {
    formId?: string
    redirectLink?: string
    schedulerLink?: string
  }
}

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = false,
}) => {
  const region = locale || 'en'
  const currentLocale = locale || 'en'

  const client = getClient(draftMode ? { token: readToken } : undefined) as SanityClient
  const formData = await getDemoFormData(client, region)

  // Fetch meetings data server-side
  let initialMeetingsData = null
  try {
    // Use environment variable for API URL or default to localhost
    const apiUrl = process.env.MEETINGS_API_URL || 'http://localhost:3001/api/meetings'
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const meetingsData = await response.json()
      
      if (meetingsData?.success && meetingsData?.data && Array.isArray(meetingsData.data)) {
        // Find the meeting that matches the current locale
        const matchedMeeting = meetingsData.data.find(
          (meeting: any) => meeting.language === currentLocale
        )
        
        if (matchedMeeting) {
          initialMeetingsData = {
            formId: matchedMeeting.formId || formData?.dmeoFormId,
            redirectLink: matchedMeeting.redirectLink,
            schedulerLink: matchedMeeting.schedulerLink,
          }
        } else if (meetingsData.data[0]) {
          // Fallback to first item if no match found
          initialMeetingsData = {
            formId: meetingsData.data[0].formId || formData?.dmeoFormId,
            redirectLink: meetingsData.data[0].redirectLink,
            schedulerLink: meetingsData.data[0].schedulerLink,
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching meetings in getStaticProps:', error)
    // Continue with formData fallback
  }

  return {
    props: {
      formData: formData || {},
      region,
      draftMode,
      token: draftMode ? readToken : '',
      initialMeetingsData: initialMeetingsData || null,
    },
  }
}

export default function DemoPage({ formData, region, initialMeetingsData }: DemoPageProps) {
  const router = useRouter()
  const currentLocale = router.locale || 'en'
  const [meetingsData, setMeetingsData] = useState<any>(null)
  const [meetingsLoading, setMeetingsLoading] = useState<boolean>(false)
  const [meetingsError, setMeetingsError] = useState<string | null>(null)
  useEffect(() => {
    const fetchMeetings = async () => {
      setMeetingsLoading(true)
      setMeetingsError(null)
      try {
        const response = await fetch('http://localhost:3001/api/meetings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Meetings data:', data)
        setMeetingsData(data)
      } catch (error) {
        console.error('Error fetching meetings:', error)
        setMeetingsError(
          error instanceof Error ? error.message : 'Failed to fetch meetings',
        )
      } finally {
        setMeetingsLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  const { formId, redirectLink, schedulerLink } = useMemo(() => {
    // Use client-side fetched data if available (more up-to-date)
    if (meetingsData?.success && meetingsData?.data && Array.isArray(meetingsData.data)) {
      // Find the meeting that matches the current locale
      const matchedMeeting = meetingsData.data.find(
        (meeting: any) => meeting.language === currentLocale
      )
      
      if (matchedMeeting) {
        return {
          formId: matchedMeeting.formId || formData?.dmeoFormId,
          redirectLink: matchedMeeting.redirectLink,
          schedulerLink: matchedMeeting.schedulerLink,
        }
      }
      
      // Fallback to first item if no match found
      if (meetingsData.data[0]) {
        return {
          formId: meetingsData.data[0].formId || formData?.dmeoFormId,
          redirectLink: meetingsData.data[0].redirectLink,
          schedulerLink: meetingsData.data[0].schedulerLink,
        }
      }
    }
    
    // Use server-side fetched data (initial render)
    if (initialMeetingsData) {
      return {
        formId: initialMeetingsData.formId || formData?.dmeoFormId,
        redirectLink: initialMeetingsData.redirectLink || null,
        schedulerLink: initialMeetingsData.schedulerLink || null,
      }
    }
    
    // Fallback to formData if no API data
    return {
      formId: formData?.dmeoFormId || null,
      redirectLink: null,
      schedulerLink: null,
    }
  }, [meetingsData, initialMeetingsData, currentLocale, formData?.dmeoFormId])

  console.log('Current Locale:', currentLocale)
  console.log('Meetings data:', meetingsData)
  console.log('Form ID:', formId)
  console.log('Redirect Link:', redirectLink)
  console.log('Scheduler Link:', schedulerLink)
  console.log('Meetings loading:', meetingsLoading)

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
          <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-6 min-h-[500px]">
            {(formId || formData?.dmeoFormId) ? (
              <HubSpotForm 
                key={formId || formData?.dmeoFormId} 
                id={formId ? formId : formData?.dmeoFormId} 
                eventName={formData?.dmeoFormEventName} 
                meetingLink={schedulerLink ? schedulerLink : formData?.demoMeetingLink}
              />
            ) : (
              <div className="flex items-center justify-center h-[500px]">
                <p className="text-gray-500">Loading form...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

