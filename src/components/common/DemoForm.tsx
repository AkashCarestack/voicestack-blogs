import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getCookie } from '~/utils/tracker/cookie'
import { tracker } from 'cs_posthog';

interface DemoFormProps {
  formId?: string
  eventName?: string
  meetingLink?: string
  redirectLink?: string
}

const DemoForm = ({
  formId,
  eventName,
  meetingLink,
  redirectLink
}: DemoFormProps) => {
  const { trackEvent } = useTracking({}, {});
  const router = useRouter();

  useEffect(() => {
    // Only load form if formId is provided from CMS
    if (!formId) {
      return;
    }

    // Helper function to create the HubSpot form
    const createForm = () => {
      if (!window.hbspt) return;

      window.hbspt.forms.create({
        portalId: '4832409',
        region: 'na1',
        formId: formId,
        target: '#demoForm',
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
          const formData = new FormData(form);
          const allowedFields = [
            "email",
            "company",
            "firstname",
            "lastname",
            "mobilephone"
          ];
          const params = new URLSearchParams();
        
          // Filter only the allowed fields from the formData
          for (const [key, value] of formData.entries()) {
            if (allowedFields.includes(key)) {
              params.append(key, value as string);
            }
          }

          const email = form.querySelector('input[name="email"]').value;

          // Save demo data to localStorage
          window.localStorage.setItem(
            "demoData",
            JSON.stringify({
              firstname: form.querySelector('input[name="firstname"]').value,
              lastname: form.querySelector('input[name="lastname"]').value,
              email: email,
              meetingLink: meetingLink || null,
            })
          );
          
          // Show success message
          const successMessageEl = document.getElementById("demoSuccessMessage");
          if (successMessageEl) {
            successMessageEl.style.display = "block";
          }
          
          // Track the form submission event
          trackEvent({
            e_name: eventName || 'demo_submission',
            e_type: "form-submission",
            e_time: new Date(),
            e_path: window?.location.href,
            user_segment: getCookie("__cs_vs"),
            url_params: { email, ...params },
            current_path: window?.location.href,
            base_path: window.location.origin + window.location.pathname,
            domain: window.location.origin,
            destination_url: null,
            referrer_url: window.document.referrer,
          });
          
          tracker.trackConversion({
            e_name: eventName || 'demo_submission',
            e_type: "form-submission",
            e_time: new Date(),
            e_path: window?.location.href,
            user_segment: getCookie("__cs_vs"),
            url_params: { email, ...params },
            current_path: window?.location.href,
            base_path: window.location.origin + window.location.pathname,
            domain: window.location.origin,
            destination_url: null,
            referrer_url: window.document.referrer,
          });

        
          // Redirect after 3 seconds
          setTimeout(async () => {
            const urlParams = new URLSearchParams(window.location.search);
            await fetch(
              `/api/hs?email=${email}&source=${urlParams.get("utm_source")}&campaign=${urlParams.get("utm_campaign")}&medium=${urlParams.get("utm_medium")}&term=${urlParams.get("utm_term")}&lead_source=${urlParams.get("lead_source")}`
            ); 
            
            // Use redirectLink from CMS if provided, otherwise default to thank-you page
            const redirectUrl = redirectLink || 'demo/thank-you';
            router.push(redirectUrl);
          }, 3000)
        },
      } as any)
    }

    const loadHubSpotScript = async () => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="//js.hsforms.net/forms/v2.js"]`)
      
      if (!existingScript) {
        // Script doesn't exist, create and load it
        const scriptEl = document.createElement('script')
        scriptEl.setAttribute('charset', 'utf-8')
        scriptEl.setAttribute('type', 'text/javascript')
        scriptEl.src = '//js.hsforms.net/forms/v2.js'

        // Append the script to the document body
        document.body.appendChild(scriptEl)

        // Wait for the script to load, then create form
        scriptEl.onload = () => {
          createForm()
        }
      } else {
        // Script already exists, create form immediately
        createForm()
      }
    }

    loadHubSpotScript()
  }, [formId, eventName, meetingLink, redirectLink, router])

  // Don't render form container if no formId provided
  if (!formId) {
    return null;
  }

  return (
    <>
      <div id="demoForm"></div>
      <div id="demoSuccessMessage" style={{display: 'none', marginTop: '20px'}}>
        Please wait..
      </div>
      <style jsx global>{`
        #demoForm .submitted-message {
          display: ${meetingLink ? 'none' : 'block'};
        }
      `}</style>
    </>
  )
}

export default DemoForm

