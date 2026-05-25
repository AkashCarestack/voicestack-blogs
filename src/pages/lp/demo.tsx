import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import LpHubspotMeeting from '~/v2/components/common/LpHubspotMeeting'

const getFirstQueryValue = (value: string | string[] | undefined): string | undefined => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value[0]
  return undefined
}

export default function LpDemoPage() {
  const router = useRouter()

  const meetingLink = useMemo(() => {
    const queryValue = getFirstQueryValue(router.query.meetingLink)
    if (!queryValue) return undefined

    try {
      return decodeURIComponent(queryValue)
    } catch {
      return queryValue
    }
  }, [router.query.meetingLink])

  return (
    <>
      <Head>
        <title>Book Demo | VoiceStack</title>
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

          {meetingLink ? (
            <div className="w-full min-h-[500px]">
              <LpHubspotMeeting
                meetingLink={meetingLink}
                eventName="demo_submission"
                formDetails={`lp_demo_${router.locale || 'en'}`}
              />
            </div>
          ) : (
            <div className="text-gray-600 text-sm">
              Missing meeting link. Please open this page with a valid `meetingLink` query parameter.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
