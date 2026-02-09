import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getCookie } from '~/utils/tracker/cookie'
// import { usePricingModal } from './PricingModalContext'

const HubSpotMeeting = ({
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
        // document.getElementsByClassName(
        //   "meetings-iframe-container"
        // )[0].style.display = "none"; //hiding the meeting iframe
        // document.getElementsByClassName("meeting-confirm")[0].style.display =
        //   "block"; //showing the temporary meeting status (if needed)
        let meetingData = event.data.meetingsPayload.bookingResponse; //data
        let organizer = meetingData.postResponse.organizer.name;
        let date = meetingData.event.dateString;
        let time = meetingData.event.dateTime;
        let email = meetingData.postResponse.contact.email;
        const urlParams = new URLSearchParams(window.location.search);

        window2.dataLayer.push({
          email: email,
          event: eventName,
          form: formDetails,
        });

        window.localStorage.setItem(
          "demoMeetingData",
          JSON.stringify({
            organizer,
            dateString: date,
            dateTime: time,
          })
        );

        const params = new URLSearchParams();
        // const eventName = `demo_meeting_submission_${router.locale}`
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
          const responseData = await fetch(
            `/api/hs?email=${email}&source=${urlParams.get("utm_source")}&campaign=${urlParams.get("utm_campaign")}&medium=${urlParams.get("utm_medium")}&term=${urlParams.get("utm_term")}&lead_source=${urlParams.get("lead_source")}`
          );
          var redirectBase = "/demo/thank-you/";
          var wholeUrl = redirectBase + "?email=" + email + "&meeting=true";
          router.push(wholeUrl);
        }, 1000)

      }
    });
  }, []);

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
        // data-src="https://meetings.hubspot.com/carestack-dan/voicestack-us-website-pricing-demo?embed=true"
        data-src={meetingLink ? `${meetingLink}?embed=true` : undefined}
        // data-src="https://meetings.hubspot.com/marcomm-admin/test-link-harsha?embed=true"
      ></div>
    </>
  );
};


export default HubSpotMeeting

