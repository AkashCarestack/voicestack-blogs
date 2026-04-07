import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { capturePosthogDemoPage } from '~/components/utils/common'
import { readToken } from '~/lib/sanity.api'
import { useDemoFormData } from '~/providers/BookDemoProvider'
import HubSpotForm from '~/v2/components/common/HubspotForm'
import HubSpotMeeting from '~/v2/components/common/HubspotMeeting'
import demoTrackingNames from '~/v2/data/demoTrackingNames.json'
import {
  DSO_LOCATION_THRESHOLD,
  needsLocationPrompt,
  parseLocationsParam,
  resolveDemoMeetingLink,
} from '~/utils/resolveDemoMeetingLink'

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
  const [locationsInput, setLocationsInput] = useState('')
  const [locationsError, setLocationsError] = useState<string | null>(null)

  // Check for referrer query param and override demo forms
  // Use useMemo to recalculate when router.query or formData changes
  const activeFormData = useMemo(() => {
    const referrer = router.query.referrer as string | undefined

    // Check for override form first
    if (referrer && formData?.overrideDemoForms) {
      // Search for matching override form by referralName
      const overrideForm = formData.overrideDemoForms.find(
        (form) => form.referralName === referrer
      )
      if (overrideForm) {
        // Use override form - it should have either demoFormId OR demoMeetingLink (not both)
        return overrideForm
      }
    }

    // If no override form found, use normal demoForms logic
    // Work exactly like US version: read practiceType from query params, default to "Dental"
    const practiceType = (router.query.practiceType as string) || 'Dental'
    // Find the matching form data based on practiceType
    let form = formData?.demoForms?.find((form) => form.practiceType === practiceType)

    // Fallback: if no match found, use first form or default
    if (!form) {
      form =
        formData?.demoForms?.[0] ||
        (formData?.demoFormId
          ? {
              demoFormId: formData.demoFormId,
              demoMeetingLink: formData.demoMeetingLink,
              demoMeetingLink2: formData.demoMeetingLink2,
              practiceType: 'Dental',
            }
          : null)
    }

    return form
  }, [router.query.referrer, router.query.practiceType, formData])

  const parsedLocations = useMemo(
    () => parseLocationsParam(router.query.locations),
    [router.query.locations]
  )

  const showLocationPrompt = useMemo(
    () => needsLocationPrompt(activeFormData, parsedLocations),
    [activeFormData, parsedLocations]
  )

  const resolvedMeetingLink = useMemo(
    () => resolveDemoMeetingLink(activeFormData, parsedLocations),
    [activeFormData, parsedLocations]
  )

  // Use activeFormData if found, otherwise fall back to default formData
  const formId = activeFormData?.demoFormId
  const practiceType =
    activeFormData?.practiceType || (router.query.practiceType as string) || 'Dental'
  const practiceTypeSlug = practiceType?.toLowerCase().replace(' ', '_')

  // Map region to tracking name key
  const regionKey = region === 'en-GB' ? 'uk' : region === 'en-AU' ? 'au' : 'us'
  const eventName =
    demoTrackingNames[regionKey as keyof typeof demoTrackingNames] || demoTrackingNames.us
  const formDetails = `${practiceTypeSlug}_${router.locale}`

  const applyLocationsToUrl = () => {
    const n = parseInt(locationsInput.trim(), 10)
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
      setLocationsError('Please enter a valid whole number (0 or greater).')
      return
    }
    setLocationsError(null)
    const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
    const basePath = `${localePrefix}/demo`
    const currentSearch = router.asPath.includes('?')
      ? router.asPath.split('?')[1].split('#')[0]
      : ''
    const queryParams = new URLSearchParams(currentSearch)
    queryParams.set('locations', String(n))
    const queryString = queryParams.toString()
    const finalUrl = queryString ? `${basePath}?${queryString}` : basePath
    router.replace(finalUrl, undefined, { shallow: true })
  }

  // For en-AU and en-GB, remove only practiceType query param from URL if present, preserve others
  // This ensures practiceType is not shown in URL for AU and UK (since only one is available)
  useEffect(() => {
    if ((region === 'en-AU' || region === 'en-GB') && router.query.practiceType) {
      const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
      const basePath = `${localePrefix}/demo`

      // Get the current query string from the URL
      const currentSearch = router.asPath.includes('?')
        ? router.asPath.split('?')[1].split('#')[0]
        : ''

      // Parse existing query params
      const queryParams = new URLSearchParams(currentSearch)

      // Remove only practiceType
      queryParams.delete('practiceType')

      // Build final URL with remaining query params
      const queryString = queryParams.toString()
      const finalUrl = queryString ? `${basePath}?${queryString}` : basePath

      router.replace(finalUrl, undefined, { shallow: true })
    }
  }, [region, router])

  useEffect(() => {
    capturePosthogDemoPage('demo_page_viewed', {
      practiceType: practiceType,
      region: region,
      formId: formId,
      meetingLink: resolvedMeetingLink,
      formDetails: formDetails,
    })
  }, [practiceType, region, formId, resolvedMeetingLink, formDetails])

  // Show loading state if router is not ready
  if (!router.isReady) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Demo | Book A Free No-Obligation VoiceStack® Demo Today</title>
        <meta
          name="description"
          content="Request a free, no-obligation demonstration of VoiceStack's AI-powered dental phone system to receive a personalized walkthrough with one of our experts."
        />
        <meta
          name="keywords"
          content="voicestack demo, voicestack demo request, voicestack visual overview"
        />
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

          {showLocationPrompt && (
            <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-900">How many locations?</h2>
              <p className="text-sm text-gray-500">
                We use this to connect you with the right scheduling flow. Practices with more than{' '}
                {DSO_LOCATION_THRESHOLD} locations use a dedicated calendar.
              </p>
              <label className="flex flex-col gap-1 text-left text-sm font-medium text-gray-700">
                Number of locations
                <input
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  value={locationsInput}
                  onChange={(e) => {
                    setLocationsInput(e.target.value)
                    setLocationsError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyLocationsToUrl()
                  }}
                />
              </label>
              {locationsError && <p className="text-sm text-red-600">{locationsError}</p>}
              <button
                type="button"
                onClick={applyLocationsToUrl}
                className="w-full rounded-lg bg-gray-900 px-4 py-3 text-white font-medium hover:bg-gray-800"
              >
                Continue
              </button>
            </div>
          )}

          {!showLocationPrompt && formId && (
            <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-6 min-h-[500px]">
              <HubSpotForm
                id={formId}
                eventName={eventName}
                formDetails={formDetails}
                followUpMeetingLink={formData?.demoMeetingLink || ''}
              />
            </div>
          )}
          {!showLocationPrompt && resolvedMeetingLink && (
            <div className="w-full min-h-[500px]">
              <HubSpotMeeting
                meetingLink={resolvedMeetingLink}
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
