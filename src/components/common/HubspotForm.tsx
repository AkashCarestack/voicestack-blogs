
import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getCookie } from '~/utils/tracker/cookie'

const HubSpotForm = ({
  id,
  eventName,
  meetingLink
}: {
  id?: string
  eventName?: string
  meetingLink?: string

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
              formId: id || '6b2d6906-028e-4d65-9cd1-34d528e0d5c0',
              // formId: "f2fbfea3-a1e5-4e17-a506-a9d341a45458",
              
              target: '#hubspotForm',
              inlineMessage:
                'Thank you, a VoiceStack representative will reach out to you shortly.',
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
                const formData = new FormData(form); // Extract all form values
                const allowedFields = [
                  "email",
                  "company",
                  "firstname",
                  "lastname",
                  "mobilephone"
                ]; // List of valid form field names
                const params = new URLSearchParams();
              
                // Filter only the allowed fields from the formData
                for (const [key, value] of formData.entries()) {
                  if (allowedFields.includes(key)) {
                    params.append(key, value as string);
                  }
                }

                const email = form.querySelector('input[name="email"]').value;

                window.localStorage.setItem(
                  "demoData",
                  JSON.stringify({
                    firstname: form.querySelector('input[name="firstname"]').value,
                    lastname: form.querySelector('input[name="lastname"]').value,
                    email: email,
                    meetingLink: meetingLink || null,
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
                });
                
                setTimeout(async () => {
                  const urlParams = new URLSearchParams(window.location.search);
                  const responseData = await fetch(
                    `/api/hs?email=${email}&source=${urlParams.get("utm_source")}&campaign=${urlParams.get("utm_campaign")}&medium=${urlParams.get("utm_medium")}&term=${urlParams.get("utm_term")}&lead_source=${urlParams.get("lead_source")}`
                  ); 
                  // document.getElementById("successMessage").innerHTML = "Thank you, a VoiceStack representative will reach out to you shortly."; 
                  // Commented out meeting redirect - now redirecting to thank-you page instead
                  // if(meetingLink){
                  //   var meetingUrl = `${meetingLink}?${params.toString()}`;
                  //   router.push(meetingUrl);
                  // }
                  router.push('/demo/thank-you');
                   
                }, 3000)
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
