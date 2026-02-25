import React from 'react'
import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getCookie } from '~/utils/tracker/cookie'
import { usePostHog } from 'posthog-js/react'

const PricingHubspotMeeting: React.FC<{
  meetingLink?: string
  eventName?: string
  formDetails?: string
}> = ({
  meetingLink,
  eventName,
  formDetails,
}) => {
  const { trackEvent } = useTracking({}, {})
  const router = useRouter()
  const posthog = usePostHog();
  useEffect(() => {
    const window2: any = window
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    document.body.appendChild(script);
    window.addEventListener("message", async function (event) {
      if (event.origin != "https://meetings.hubspot.com") return false;

      if (event.data.meetingBookSucceeded) {
        let meetingData = event.data.meetingsPayload.bookingResponse; //data
        let organizer = meetingData.postResponse.organizer.name;
        let date = meetingData.event.dateString;
        let time = meetingData.event.dateTime;
        let email = meetingData.postResponse.contact.email;
        const urlParams = new URLSearchParams(window.location.search);
        posthog.capture(eventName, {
          email: email,
          formDetails,
          ...urlParams,
          base_path: window.location.origin + window.location.pathname,
          domain: window.location.origin,
          destination_url: null,
          referrer_url: window.document.referrer,
        });

        window2.dataLayer.push({
          email: email,
          event: eventName,
          form: formDetails,
        });
        
        window.localStorage.setItem(
          "pricingDemoMeetingData",
          JSON.stringify({
            organizer,
            dateString: date,
            dateTime: time,
          })
        );

        const params = new URLSearchParams();
        trackEvent({
          e_name: eventName,
          e_type: "form-submission",
          e_time: new Date(),
          e_path: window?.location.href,
          user_segment:getCookie("__cs_vs"),
          url_params: { email, ...params },
          current_path: window?.location.href,
          base_path: window.location.origin + window.location.pathname,
          domain: window.location.origin,
          destination_url: null,
          referrer_url: window.document.referrer,
          element_id: formDetails,
        });
        setTimeout(async () => {
          // Read current URL params (in case user navigated) and sessionStorage
          const currentUrlParams = new URLSearchParams(window.location.search);
          const apiParams = new URLSearchParams({ email });
          const utmMap = { utm_source: "source", utm_campaign: "campaign", utm_medium: "medium", utm_term: "term", lead_source: "lead_source" };
          
          Object.entries(utmMap).forEach(([key, param]) => {
            // Try current URL first, then sessionStorage (carry forward from any previous page)
            const value = currentUrlParams.get(key) || sessionStorage.getItem(key);
            if (value) apiParams.append(param, value);
          });
          
          await fetch(`/api/hs?${apiParams.toString()}`);
          var redirectBase = "/pricing/thank-you/";
          var wholeUrl = redirectBase + "?email=" + email + "&meeting=true";
          router.push(wholeUrl);
        }, 3000) // Wait 3 seconds to give HubSpot time to create the contact

      }
    });
  }, [meetingLink, eventName, router]);

  return (
    <>
      <div
        style={{ textAlign: "center", padding: "50px", display: "none" }}
        className="meeting-confirm"
      >
        <p>Hi Please wait while we confirm your booking</p>
      </div>
      <div
        className="meetings-iframe-container"
        data-src={meetingLink ? `${meetingLink}?embed=true` : undefined}
        // data-src="https://meetings.hubspot.com/marcomm-admin/test-link-harsha?embed=true"
      ></div>
    </>
  );
};


export default PricingHubspotMeeting

