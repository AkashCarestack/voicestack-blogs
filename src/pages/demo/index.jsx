/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { getCssSelectorShort } from '~/helpers/createCSSSelector'
import { useTracking } from 'cs-tracker'
import { getParams } from '~/helpers/getQueryParams'
import { getCookie } from '~/utils/tracker/cookie'
import BookDemoContextProvider from '~/providers/BookDemoProvider'

import { BookDemoContext } from '~/providers/BookDemoProvider'
import H2 from '~/components/typography/H2'
import Paragraph from '~/components/typography/Paragraph'
const BookFreeDemoMeeting = () => {
  const router = useRouter()
  const { trackEvent } = useTracking({}, {})

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
    document.body.appendChild(script)
    window.addEventListener('message', async function (event) {
      if (event.origin != 'https://meetings.hubspot.com') return false
      if (event.data.meetingBookSucceeded) {
        // document.getElementsByClassName(
        //   "meetings-iframe-container"
        // )[0].style.display = "none"; //hiding the meeting iframe
        // document.getElementsByClassName("meeting-confirm")[0].style.display =
        //   "block"; //showing the temporary meeting status (if needed)
        let meetingData = event.data.meetingsPayload.bookingResponse //data
        let organizer = meetingData.postResponse.organizer.name
        let email = meetingData.postResponse.contact.email
        let date = meetingData.event.dateString
        let time = meetingData.event.dateTime
        const urlParams = new URLSearchParams(window.location.search)
        const responseData = await fetch(
          `/api/hs?email=${email}&source=${urlParams.get('utm_source')}&campaign=${urlParams.get('utm_campaign')}&medium=${urlParams.get('utm_medium')}&term=${urlParams.get('utm_term')}`,
        )
        window.localStorage.setItem(
          'demoData',
          JSON.stringify({
            organizer,
            dateString: date,
            dateTime: time,
          }),
        )
        // const element = getCssSelectorShort(event.target);
        const {
          utm_source = null,
          utm_term = null,
          utm_content = null,
          utm_campaign = null,
          utm_medium = null,
          ...params
        } = getParams()

        trackEvent({
          e_name: isRegion,
          e_type: 'meeting-request',
          e_time: new Date(),
          e_path: window?.location.href,
          utm_campaign,
          utm_content,
          utm_source,
          utm_term,
          utm_medium,
          // element,
          url_params: params,
          current_path: window?.location.href,
          base_path: window.location.origin + window.location.pathname,
          domain: window.location.origin,
          destination_url: window.location.origin + '/thank-you',
          referrer_url: window.document.referrer,
        })

        // router.push("/thank-you");
      }
    })
  }, [])

  const [isRegion, setIsRegion] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const meetingCategory = urlParams.get('region')
    setIsRegion(meetingCategory)
  }, [])

  // const { isDemoPopUpShown } = useContext(BookDemoContext);



  return (
    <div className="py-24 px-4">
      <div className="w-full gap-16 flex flex-col items-center">
        <div className="flex flex-col w-full items-center max-w-[780px] text-center gap-4 pb-8">
          
          <div className="max-w-[620px] flex flex-col gap-4">
            <H2>Book A Demo</H2>
            <Paragraph>Please select your preferred date & time and complete the brief form to schedule your free VoiceStack demo!</Paragraph>
          </div>
        </div>
      </div>
      <div
        style={{ textAlign: 'center', padding: '50px', display: 'none' }}
        className="meeting-confirm"
      >
        <p>Hi Please wait while we confirm your booking</p>
      </div>
      {isRegion && isRegion === 'en' && (
        <div
          className="meetings-iframe-container"
          data-src="https://meetings.hubspot.com/carestack-dan/cs-conversations?embed=true"
        ></div>
      )}
      {isRegion && isRegion === 'en-GB' && (
        <div
          className="meetings-iframe-container"
          data-src="https://meetings.hubspot.com/carestack-dan/cs-conversation-website?embed=true"
          // data-src="https://meetings.hubspot.com/marcomm-admin/test-link-harsha?embed=true"
        ></div>
      )}
      {isRegion && isRegion === 'en-AU' && (
        <div
          className="meetings-iframe-container"
          data-src="https://meetings.hubspot.com/carestack-dan/csconv-aus-website?embed=true"
        ></div>
      )}
    </div>
  )
}

// const BookFreeDemoMeetingMain = () => {
//   return (
//     <BookDemoContextProvider>
//       <BookFreeDemoMeeting />
//     </BookDemoContextProvider>
//   );
// };

export default BookFreeDemoMeeting
