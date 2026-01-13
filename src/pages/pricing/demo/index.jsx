/* eslint-disable react-hooks/exhaustive-deps */
import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { getCookie } from '~/utils/tracker/cookie'

import React, { useEffect, useState } from "react";


const BookFreeDemo = () => {
  const router = useRouter();
  const { trackEvent } = useTracking({}, {});
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    document.body.appendChild(script);
    window.addEventListener("message", async function (event) {
      if (event.origin != "https://meetings.hubspot.com") return false;

      if (event.data.meetingBookSucceeded) {
        document.getElementsByClassName(
          "meetings-iframe-container"
        )[0].style.display = "none"; //hiding the meeting iframe
        document.getElementsByClassName("meeting-confirm")[0].style.display =
          "block"; //showing the temporary meeting status (if needed)
        let meetingData = event.data.meetingsPayload.bookingResponse; //data
        let organizer = meetingData.postResponse.organizer.name;
        let date = meetingData.event.dateString;
        let time = meetingData.event.dateTime;
        let email = meetingData.postResponse.contact.email;
        const urlParams = new URLSearchParams(window.location.search);
        window.localStorage.setItem(
          "pricingDemoData",
          JSON.stringify({
            organizer,
            dateString: date,
            dateTime: time,
          })
        );

        const params = new URLSearchParams();

        trackEvent({
          e_name: 'demo_submission_uk',
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
        });
        setTimeout(async () => {
          // const responseData = await fetch(
          //   `/api/hs?email=${email}&source=${urlParams.get("utm_source")}&campaign=${urlParams.get("utm_campaign")}&medium=${urlParams.get("utm_medium")}&term=${urlParams.get("utm_term")}&lead_source=${urlParams.get("lead_source")}`
          // );
          var redirectBase = "/pricing/demo/thank-you/";
          var wholeUrl = redirectBase + "?email=" + email;
          router.push(wholeUrl);
          // router.push("/pricing/demo/thank-you");
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
        className="meetings-iframe-container md:py-24 py-16"
        data-src="https://meetings.hubspot.com/carestack-dan/voicestack-us-website-pricing-demo?embed=true"
        // data-src="https://meetings.hubspot.com/marcomm-admin/test-link-harsha?embed=true"
      ></div>
    </>
  );
};

export default BookFreeDemo;
