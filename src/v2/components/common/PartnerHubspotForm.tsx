/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface PartnerHubspotFormProps {
  formId: string;
  portalId: string;
  id?: string;
  meetingLink?: string;
  region?: string;
}

const PartnerHubspotForm = ({
  formId,
  portalId,
  id,
  meetingLink,
  region = 'na1'
}: PartnerHubspotFormProps) => {
  const router = useRouter();
  const formContainerId = id && id.length > 0 ? id : "hubspotForm";
  
  useEffect(() => {
    const window2: any = window;
    
    const createForm = () => {
      if (window2.hbspt) {
        window2.hbspt.forms.create({
          portalId,
          region,
          formId,
          target: `#${formContainerId}`,
          inlineMessage:
            'Thank you, a VoiceStack representative will reach out to you shortly.',
         
          onFormSubmit: function (form: any) {
            if (meetingLink) {
              const formData = new FormData(form);
              const params = new URLSearchParams();
              const allowedFields = [
                "email",
                "firstname",
                "lastname",
                "mobilephone",
                "company",
                "locations",
                "yo_message"
              ]; //
              
              // Filter only the allowed fields from the formData
              for (const [key, value] of formData.entries()) {
                if (allowedFields.includes(key)) {
                  params.append(key, value as string);
                }
              }
              
              const meetingUrl = `${meetingLink}?${params.toString()}`;
              router.push(meetingUrl);
            }
            
            
          },
        } as any);
      }
    };

    const loadHubSpotScript = async () => {
      // Ensure script is only fetched once
      if (
        !document.querySelector(`script[src="//js.hsforms.net/forms/v2.js"]`)
      ) {
        const scriptEl = document.createElement('script');
        scriptEl.setAttribute('charset', 'utf-8');
        scriptEl.setAttribute('type', 'text/javascript');
        scriptEl.src = '//js.hsforms.net/forms/v2.js';

        // Append the script to the document body
        document.body.appendChild(scriptEl);

        // Wait for the script to load
        scriptEl.onload = () => {
          createForm();
        };
      } else {
        // Script already exists, create form directly
        createForm();
      }
    };

    loadHubSpotScript();

    // Cleanup the script if necessary
    return () => {
      const hubspotScript = document.querySelector(
        `script[src="//js.hsforms.net/forms/v2.js"]`,
      );
      // Note: We don't remove the script as it might be used by other forms
      // Only remove if this is the last form using it
    };
  }, [formId, portalId, id, meetingLink, region, router, formContainerId]);

  return <div id={formContainerId}></div>;
};

export default PartnerHubspotForm;
