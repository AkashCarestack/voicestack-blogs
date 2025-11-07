import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import type { SanityClient } from 'next-sanity'
import { getDemoFormData } from '~/lib/sanity.queries'
import HubSpotForm from '~/components/common/HubspotForm'
import Head from 'next/head'

interface DemoPageProps {
  formData: {
    dmeoFormId?: string
    demoMeetingLink?: string
    dmeoFormEventName?: string
  }
  region: string
  draftMode: boolean
  token: string
}

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = false,
}) => {
  const region = locale || 'en'

  const client = getClient(draftMode ? { token: readToken } : undefined) as SanityClient
  const formData = await getDemoFormData(client, region)

  return {
    props: {
      formData: formData || {},
      region,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

export default function DemoPage({ formData, region }: DemoPageProps) {
  return (
    <>
      <Head>
        <title>Book Free Demo | VoiceStack</title>
        <meta name="description" content="Book a free demo with VoiceStack today. Start your transition to VoiceStack." />
      </Head>
      <div className="py-24 px-4">
        <div className="w-full gap-16 flex flex-col items-center">
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
            <HubSpotForm 
              id={formData?.dmeoFormId} 
              eventName={formData?.dmeoFormEventName} 
              meetingLink={formData?.demoMeetingLink}
            />
          </div>
        </div>
      </div>
    </>
  )
}

