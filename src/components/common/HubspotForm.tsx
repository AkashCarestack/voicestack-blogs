
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
    if (!id) return; // Don't create form if no id provided

    // Use unique target ID based on formId to avoid HubSpot caching
    const targetId = `hubspotForm-${id}`;

    // Function to create the HubSpot form
    const createForm = () => {
      if (!window.hbspt) return;

      // Get or create the target container
      const mainContainer = document.getElementById('hubspotForm');
      if (!mainContainer) return;

      // Clear main container and create new unique container
      mainContainer.innerHTML = '';
      const formContainer = document.createElement('div');
      formContainer.id = targetId;
      mainContainer.appendChild(formContainer);

      // Create the form with unique target
      window.hbspt.forms.create({
        portalId: '4832409',
        region: 'na1',
        formId: id || '6b2d6906-028e-4d65-9cd1-34d528e0d5c0',
        target: `#${targetId}`,
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
          
          document.getElementById("successMessage")!.style.display = "block";
          
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
            router.push('/thank-you');
          }, 3000)
        },
      } as any)
    }

    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="//js.hsforms.net/forms/v2.js"]`)
    
    if (existingScript) {
      // Script already loaded, create form directly
      if (window.hbspt) {
        createForm()
      } else {
        // Wait for script to be ready
        const checkHbspt = setInterval(() => {
          if (window.hbspt) {
            clearInterval(checkHbspt)
            createForm()
          }
        }, 100)
        
        // Cleanup interval after 5 seconds
        setTimeout(() => clearInterval(checkHbspt), 5000)
      }
    } else {
      // Script not loaded, load it first
      const scriptEl = document.createElement('script')
      scriptEl.setAttribute('charset', 'utf-8')
      scriptEl.setAttribute('type', 'text/javascript')
      scriptEl.src = '//js.hsforms.net/forms/v2.js'
      document.body.appendChild(scriptEl)

      scriptEl.onload = () => {
        createForm()
      }
    }

    // Cleanup: clear form when id changes
    return () => {
      // Remove the specific form container
      const targetContainer = document.getElementById(targetId);
      if (targetContainer) {
        targetContainer.innerHTML = '';
        targetContainer.remove();
      }
      // Also clear main container
      const mainContainer = document.getElementById('hubspotForm');
      if (mainContainer) {
        mainContainer.innerHTML = '';
      }
    }
  }, [id, eventName, meetingLink, router, trackEvent])

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
