
import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getCookie } from '~/utils/tracker/cookie'
import { capturePosthogEvent } from '~/components/utils/common'

const HubSpotForm = ({
  id,
  eventName,
  meetingLink,
  formDetails,
  followUpMeetingLink
}: {
  id?: string
  eventName?: string
  meetingLink?: string
  formDetails?: string
  followUpMeetingLink?: string
}) => {
  const { trackEvent } = useTracking({}, {});
  const router = useRouter();
  useEffect(() => {
    const window2: any = window
    const loadHubSpotScript = async () => {
      // Ensure script is only fetched once
      if (
        !document.querySelector(`script[src="//js.hsforms.net/forms/v2.js"]`)
      ) {
        const scriptEl = document.createElement('script')
        scriptEl.setAttribute('charset', 'utf-8')
        scriptEl.setAttribute('type', 'text/javascript')
        scriptEl.src = '//js.hsforms.net/forms/v2.js'

        // Append the script to the document body
        document.body.appendChild(scriptEl)

        // Wait for the script to load
        scriptEl.onload = () => {
          if (window.hbspt) {
            // Create the form
            window.hbspt.forms.create({
              portalId: '4832409',
              region: 'na1',
              formId: id ,
              // formId: "f2fbfea3-a1e5-4e17-a506-a9d341a45458",
              
              target: '#hubspotForm',
              inlineMessage:
                'We are confirming your demo request..',
              onFormReady: function ($form, ctx) {
                // Prefill email from localStorage if available
                const savedEmail = localStorage.getItem('email')
                if (savedEmail) {
                  const emailInput = $form.querySelector('input[name="email"]')
                  if (emailInput) {
                    emailInput.value = savedEmail
                    emailInput.focus()
                  }
                }
              },
              onFormSubmit: function (form) {
                const emailValue = form.querySelector('input[name="email"]').value;
                const formData = new FormData(form); // Extract all form values
                const allowedFields = [
                  "email",
                  "company",
                  "firstname",
                  "lastname",
                  "mobilephone"
                ]; // List of valid form field names
                const params = new URLSearchParams();
               
                capturePosthogEvent(eventName, {
                  email: emailValue,
                  formDetails,
                  ...params,
                  base_path: window.location.origin + window.location.pathname,
                  domain: window.location.origin,
                  destination_url: null,
                  referrer_url: window.document.referrer,
                  form_submission: 'form_submission',
                });
              
                // Filter only the allowed fields from the formData
                for (const [key, value] of formData.entries()) {
                  if (allowedFields.includes(key)) {
                    params.append(key, value as string);
                  }
                }

                const email = form.querySelector('input[name="email"]').value;

                if (eventName === 'demo_submission' && window2.lintrk) {
                  window2.lintrk('track', { conversion_id: 25412508 });
                }

                window2.dataLayer.push({
                  email: email,
                  event: eventName || 'demo_submission_uk',
                  form: formDetails,
                });

                window.localStorage.setItem(
                  "demoData",
                  JSON.stringify({
                    firstname: form.querySelector('input[name="firstname"]').value,
                    lastname: form.querySelector('input[name="lastname"]').value,
                    email: email,
                    // meetingLink: meetingLink || null,
                  })
                );
                
                // if(meetingLink){
                  document.getElementById("successMessage").style.display = "block";
                // }
                
                trackEvent({
                  e_name: eventName || 'demo_submission_uk',
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
                  const urlParams = new URLSearchParams(window.location.search);
                  const apiParams = new URLSearchParams({ email });
                  const utmMap = { utm_source: "source", utm_campaign: "campaign", utm_medium: "medium", utm_term: "term", utm_content: "content", lead_source: "lead_source" };
                  
                  // Try URL first, then sessionStorage (same logic as HubspotMeeting)
                  Object.entries(utmMap).forEach(([key, param]) => {
                    const value = urlParams.get(key) || sessionStorage.getItem(key);
                    if (value) apiParams.append(param, value);
                  });
                  
                  const responseData = await fetch(`/api/hs?${apiParams.toString()}`);
                  // document.getElementById("successMessage").innerHTML = "Thank you, a VoiceStack representative will reach out to you shortly."; 
                  // Commented out meeting redirect - now redirecting to thank-you page instead
                  // if(meetingLink){
                  //   var meetingUrl = `${meetingLink}?${params.toString()}`;
                  //   router.push(meetingUrl);
                  // }
                  var redirectBase = "/demo/thank-you/";
                  var wholeUrl = redirectBase + "?email=" + email;
                  if (followUpMeetingLink) {
                    // Append form values to the meeting link URL
                    const meetingUrlWithParams = `${followUpMeetingLink}${followUpMeetingLink.includes('?') ? '&' : '?'}${params.toString()}`;
                    wholeUrl += "&meeting_link=" + encodeURIComponent(meetingUrlWithParams);
                  }
                  router.push(wholeUrl);
                  // router.push('/demo/thank-you');
                   
                }, 2000)
              },
              
            } as any)
          }
        }
      }
    }

    loadHubSpotScript()

    // Cleanup the script if necessary
    return () => {
      const hubspotScript = document.querySelector(
        `script[src="//js.hsforms.net/forms/v2.js"]`,
      )
      if (hubspotScript) hubspotScript.remove()
    }
  }, [id, eventName, router])

  return (
    <>
      <div id="hubspotForm"></div>
      <div id="successMessage" style={{display: 'none', marginTop: '20px'}}>
        Please wait..
      </div>
      <style jsx global>{`
        #hubspotForm .submitted-message {
          display: ${meetingLink ? 'none' : 'block'};
        }
        
      `}</style>
    </>
  )
}

export default HubSpotForm
