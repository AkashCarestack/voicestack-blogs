import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { capturePosthogEvent } from '~/components/utils/common'
import { getCookie } from '~/utils/tracker/cookie'

const LpHubspotMeeting = ({
  meetingLink,
  eventName,
  formDetails,
}: {
  meetingLink?: string
  eventName?: string
  formDetails?: string
}) => {
  const { trackEvent } = useTracking({}, {})
  const router = useRouter()

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search)
    const utmKeys = [
      'utm_source',
      'utm_campaign',
      'utm_medium',
      'utm_term',
      'utm_content',
      'lead_source',
    ]

    utmKeys.forEach((key) => {
      const value = currentParams.get(key)
      if (value) {
        sessionStorage.setItem(key, value)
      }
    })

    const window2: any = window
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
    document.body.appendChild(script)

    window.addEventListener('message', async function (event) {
      if (event.origin != 'https://meetings.hubspot.com') return false

      if (event.data.meetingBookSucceeded) {
        const meetingData = event.data.meetingsPayload.bookingResponse
        const organizer = meetingData.postResponse.organizer.name
        const date = meetingData.event.dateString
        const time = meetingData.event.dateTime
        const email = meetingData.postResponse.contact.email
        const params = new URLSearchParams()

        capturePosthogEvent(eventName, {
          email: email,
          formDetails,
          ...params,
          base_path: window.location.origin + window.location.pathname,
          domain: window.location.origin,
          destination_url: null,
          referrer_url: window.document.referrer,
        })

        if (eventName === 'demo_submission' && window2.lintrk) {
          window2.lintrk('track', { conversion_id: 25412508 })
        }

        window2.dataLayer.push({
          email: email,
          event: eventName,
          form: formDetails,
        })

        window.localStorage.setItem(
          'demoMeetingData',
          JSON.stringify({
            organizer,
            dateString: date,
            dateTime: time,
          })
        )

        trackEvent({
          e_name: eventName,
          e_type: 'form-submission',
          e_time: new Date(),
          e_path: window?.location.href,
          user_segment: getCookie('__cs_vs'),
          url_params: { email, ...params },
          current_path: window?.location.href,
          base_path: window.location.origin + window.location.pathname,
          domain: window.location.origin,
          destination_url: null,
          referrer_url: window.document.referrer,
          element_id: formDetails,
        })

        setTimeout(async () => {
          const currentUrlParams = new URLSearchParams(window.location.search)
          const apiParams = new URLSearchParams({ email })
          const utmMap = {
            utm_source: 'source',
            utm_campaign: 'campaign',
            utm_medium: 'medium',
            utm_term: 'term',
            utm_content: 'content',
            lead_source: 'lead_source',
          }

          Object.entries(utmMap).forEach(([key, param]) => {
            const value = currentUrlParams.get(key) || sessionStorage.getItem(key)
            if (value) apiParams.append(param, value)
          })

          await fetch(`/api/hs?${apiParams.toString()}`)
          const redirectBase = '/demo/thank-you/'
          const wholeUrl = redirectBase + '?email=' + email + '&meeting=true'
          router.push(wholeUrl)
        }, 3000)
      }
    })
  }, [eventName, formDetails, router, trackEvent])

  return (
    <>
      <div
        style={{ textAlign: 'center', padding: '50px', display: 'none' }}
        className="meeting-confirm"
      >
        <p>Hi Please wait while we confirm your booking</p>
      </div>
      <div
        className="meetings-iframe-container"
        data-src={meetingLink ? `${meetingLink}?embed=true` : undefined}
      ></div>
    </>
  )
}

export default LpHubspotMeeting
