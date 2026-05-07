import { useTracking } from 'cs-tracker'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getCookie } from '~/utils/tracker/cookie'
import { usePricingModal } from './PricingModalContext'
import { capturePosthogEvent } from '~/components/utils/common'

const PricingHubSpotForm = ({
  id,
  locale = 'en',
}: {
  id?: string
  locale?: string
}) => {
  const { trackEvent } = useTracking({}, {})
  const router = useRouter()
  const { closePricingModal } = usePricingModal()
  // Hardcoded form ID for US, structure ready for locale-based IDs
  const getFormId = () => {
    // For now, use hardcoded US form ID
    // Future: can add locale-based logic here
    // if (locale === 'au') return 'au-form-id'
    // if (locale === 'uk') return 'uk-form-id'
    return id || 'a28e5858-ce77-4b10-9c4b-4099cc6f1cef'
  }

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
              formId: getFormId(),
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
                const formData = new FormData(form) // Extract all form values
                const allowedFields = [
                  'email',
                  'company',
                  'firstname',
                  'lastname',
                  'mobilephone',
                ] // List of valid form field names
                const params = new URLSearchParams()

                // Filter only the allowed fields from the formData
                for (const [key, value] of formData.entries()) {
                  if (allowedFields.includes(key)) {
                    params.append(key, value as string)
                  }
                }

                const email = form.querySelector('input[name="email"]').value

                window.localStorage.setItem(
                  'pricingData',
                  JSON.stringify({
                    firstname: form.querySelector('input[name="firstname"]')
                      .value,
                    lastname: form.querySelector('input[name="lastname"]').value,
                    email: email,
                  }),
                )

                document.getElementById('pricingSuccessMessage').style.display =
                  'block'

                const eventName = `pricing_form_submission_${locale || 'en'}`
                capturePosthogEvent(eventName, {
                  email,
                  base_path: window?.location?.href,
                  path: window?.location?.pathname,
                  domain: window?.location?.origin,
                  referrer_url: window?.document?.referrer,
                  form_submission: 'pricing_demo_submission',
                })

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
                })

                setTimeout(async () => {
                  const urlParams = new URLSearchParams(window.location.search)
                  const apiParams = new URLSearchParams({ email });
                  const utmMap = { utm_source: "source", utm_campaign: "campaign", utm_medium: "medium", utm_term: "term", lead_source: "lead_source" };
                  
                  // Try URL first, then sessionStorage (same logic as HubspotMeeting)
                  Object.entries(utmMap).forEach(([key, param]) => {
                    const value = urlParams.get(key) || sessionStorage.getItem(key);
                    if (value) apiParams.append(param, value);
                  });
                  
                  const responseData = await fetch(`/api/hs?${apiParams.toString()}`);
                  closePricingModal()
                  router.push('/pricing/thank-you')
                }, 1000)
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
  }, [id, locale, router])

  return (
    <>
      <div id="hubspotForm"></div>
      <div
        id="pricingSuccessMessage"
        style={{ display: 'none', marginTop: '20px' }}
      >
        Please wait..
      </div>
      <style jsx global>{`
        #hubspotForm .submitted-message {
          display: block;
        }
      `}</style>
    </>
  )
}

export default PricingHubSpotForm

