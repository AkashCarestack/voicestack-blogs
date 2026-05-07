import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { capturePosthogDemoPage } from '~/components/utils/common'
import { readToken } from '~/lib/sanity.api'
import { useDemoFormData } from '~/providers/BookDemoProvider'
import HubSpotForm from '~/v2/components/common/HubspotForm'
import HubSpotMeeting from '~/v2/components/common/HubspotMeeting'
import { PracticeTypeModal } from '~/v2/components/common/PracticeTypeModal'
import demoTrackingNames from '~/v2/data/demoTrackingNames.json'
import {
  hasSecondaryMeetingLink,
  LOC_QUERY_PARAM,
  parseLocParam,
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
  const [showPracticeTypeModal, setShowPracticeTypeModal] = useState(false)

  const firstQueryValue = (value: unknown): string | undefined => {
    if (typeof value === 'string') return value
    if (Array.isArray(value)) {
      const first = value[0]
      return typeof first === 'string' ? first : undefined
    }
    return undefined
  }

  const isLinkedinPaidUS = useMemo(() => {
    if (!router.isReady) return false
    if ((router.locale ?? 'en') !== 'en') return false
    return (
      firstQueryValue(router.query.utm_source) === 'linkedin' &&
      firstQueryValue(router.query.utm_medium) === 'paid'
    )
  }, [router.isReady, router.locale, router.query.utm_source, router.query.utm_medium])

  const availablePracticeTypes = useMemo(() => {
    return (formData?.demoForms || [])
      .map((form) => form?.practiceType?.trim())
      .filter((practiceType): practiceType is string => Boolean(practiceType))
  }, [formData?.demoForms])

  const hasReferrerOverride = useMemo(() => {
    const referrer = router.query.referrer
    if (typeof referrer !== 'string' || !referrer || !formData?.overrideDemoForms) {
      return false
    }
    return formData.overrideDemoForms.some((form) => form.referralName === referrer)
  }, [router.query.referrer, formData?.overrideDemoForms])

  const hasPracticeTypeQueryParam = useMemo(() => {
    const practiceTypeQuery = router.query.practiceType
    if (typeof practiceTypeQuery === 'string') {
      return practiceTypeQuery.trim().length > 0
    }
    if (Array.isArray(practiceTypeQuery)) {
      return practiceTypeQuery.some((value) => value.trim().length > 0)
    }
    return false
  }, [router.query.practiceType])

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

  const parsedLoc = useMemo(
    () => parseLocParam(router.query[LOC_QUERY_PARAM]),
    [router.query]
  )

  // LinkedIn paid traffic (US) should go straight to Dental demo with default loc
  useEffect(() => {
    if (!router.isReady) return
    if (!isLinkedinPaidUS) return

    const currentSearch = router.asPath.includes('?')
      ? router.asPath.split('?')[1].split('#')[0]
      : ''
    const currentParams = new URLSearchParams(currentSearch)

    const hasPracticeType =
      typeof router.query.practiceType === 'string'
        ? router.query.practiceType.trim().length > 0
        : Array.isArray(router.query.practiceType)
          ? router.query.practiceType.some((v) => v.trim().length > 0)
          : false

    const hasLoc = Boolean(parseLocParam(router.query[LOC_QUERY_PARAM]))

    if (hasPracticeType && hasLoc) return

    currentParams.delete('flag')
    currentParams.delete('slug')
    currentParams.delete('locations')

    if (!hasPracticeType) currentParams.set('practiceType', 'Dental')
    if (!hasLoc) currentParams.set(LOC_QUERY_PARAM, 'lt15')

    const queryString = currentParams.toString()
    const finalUrl = queryString ? `/demo?${queryString}` : '/demo'
    router.replace(finalUrl, undefined, { shallow: true })
  }, [router, isLinkedinPaidUS])

  const shouldAutoShowPracticeTypeModal = useMemo(() => {
    if (!router.isReady) return false
    if (hasReferrerOverride) return false
    if (isLinkedinPaidUS) return false
    return (
      (!hasPracticeTypeQueryParam && availablePracticeTypes.length > 1) ||
      (hasSecondaryMeetingLink(activeFormData) && !parsedLoc)
    )
  }, [
    router.isReady,
    hasReferrerOverride,
    isLinkedinPaidUS,
    hasPracticeTypeQueryParam,
    availablePracticeTypes.length,
    activeFormData,
    parsedLoc,
  ])

  useEffect(() => {
    setShowPracticeTypeModal(shouldAutoShowPracticeTypeModal)
  }, [shouldAutoShowPracticeTypeModal])

  const resolvedMeetingLink = useMemo(
    () => resolveDemoMeetingLink(activeFormData, parsedLoc),
    [activeFormData, parsedLoc]
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

          {!showPracticeTypeModal && formId && (
            <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-6 min-h-[500px]">
              <HubSpotForm
                id={formId}
                eventName={eventName}
                formDetails={formDetails}
                followUpMeetingLink={formData?.demoMeetingLink || ''}
              />
            </div>
          )}
          {!showPracticeTypeModal && resolvedMeetingLink && (
            <div className="w-full min-h-[500px]">
              <HubSpotMeeting
                meetingLink={resolvedMeetingLink}
                eventName={eventName}
                formDetails={formDetails}
              />
            </div>
          )}

          {showPracticeTypeModal && (
            <PracticeTypeModal
              hideCloseButton={true}
            />
          )}
        </div>
      </div>
    </>
  )
}
