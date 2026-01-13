/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

interface HubpostGenericProps {
  formId: string;
  portalId: string;
  onFormSubmit?: any;
  onFormReady?: any;
  id?: string;
  meetingLink?: string;
}

const HubspotGenericForm = ({
  formId,
  portalId,
  onFormSubmit,
  onFormReady,
  id,
  meetingLink
}: HubpostGenericProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hsforms.net/forms/embed/v2.js";
    document.body.appendChild(script);

    script.addEventListener("load", () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId,
          formId,
          target: `#${id && id.length > 0 ? id : "hubspotForm"}`,
         
        });
      }
    });
  }, []);

  return <div id={id && id.length > 0 ? id : "hubspotForm"}></div>;
};

export default HubspotGenericForm;
