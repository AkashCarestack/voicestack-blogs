/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'

import HubSpotForm from '~/components/common/HubspotForm'
import HubspotFormLegal from '~/components/common/HubspotLegalForm'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import HubspotGenericForm from './hubspotGeneric'

interface PartnerReferralProps {
  data: any
  theme?: string
}

const PartnersReferralSection: React.FC<PartnerReferralProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const formId = '51a58c21-d24f-41fc-b744-b0d23011da45'
    const loadHubSpotForm = () => {
      const scriptId = 'hubspot-script-partners'
      const formTargetId = 'partners-hubspot-form'
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script')
        script.src = '//js.hsforms.net/forms/v2.js'
        script.type = 'text/javascript'
        script.id = scriptId
        script.onload = () => {
          if (window.hbspt) {
            window.hbspt.forms.create({
              portalId: '4832409',
              formId: formId,
              target: `#${formTargetId}`,
            })
          }
        }
        document.body.appendChild(script)
      } else {
        if (window.hbspt) {
          window.hbspt.forms.create({
            portalId: '4832409',
            formId: formId,
            target: `#${formTargetId}`,
          })
        }
      }
    }

    loadHubSpotForm()
  }, [])

  return (
    <Section className="py-sm md:py-md lg:py-lg bg-[#F9F9F9]">
      <Container>
        <div id="referral" className="font-sans" ref={containerRef}>
          <div className="flex flex-col lg:flex-row bg-white rounded-[20px] overflow-hidden">
            {/* Left: Image and Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 bg-[#4A3CE1] md:py-12 md:px-16 py-8 px-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Refer a Client
              </h2>

              <div className="w-full h-[257px] rounded-[20px] overflow-hidden">
                <ImageLoader
                  image="/assets/refer-a-client.png"
                  alt="Partner referral image"
                  className="w-full h-auto object-cover"
                />
              </div>

              <p className="text-base md:text-lg text-white/90 leading-relaxed">
                Complete this form to refer your clients to us. Our team will be
                in touch within minutes to schedule their personalized demo.
              </p>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-1/2 md:py-12 md:px-16 py-8 px-4">
              {/* <div className="w-full" id="partners-form">
                <div id="partners-hubspot-form" ref={formRef}></div>
              </div> */}
              <HubspotGenericForm
                formId="51a58c21-d24f-41fc-b744-b0d23011da45"
                portalId="4832409"
              />
                 <style jsx global>
                  {`
                  #hubspotForm form {
                    gap: 0;
                  }
                    .hs-form-field {
                      margin-bottom: 25px;
                      position: relative;
                    }
                    .form-popup .hs-form-field {
                      margin-bottom: 16px;
                    }
                    .popup-form .hs-form-field {
                      margin-bottom: 20px;
                      position: relative;
                    }
                    .hs-form-field > label {
                      font-weight: 400;
                      font-size: 14px;
                      line-height: 19px;
                      color: #4B5563;
                      margin-bottom: 8px;
                      display: inline-block;
                    }
                    .hs-form-field > label .hs-form-required {
                      font-size: 14px;
                      color: #ca6458;
                    }
                    .hs-submit {
                      padding-top: 7px;
                      display: flex;
                      align-self: flex-start;
                      justify-content: center;
                      width: 100%;
                    }
                    .hs-input{
                        width:100% ! important;
                    }
                    .hs_firstname{

                    }
                    .form-popup .hs-submit {
                      margin-top: 8px;
                    }
                    
                    .form-popup .hs-submit .actions {
                      width: 100%;
                    }
                    .actions{
                        width:100%
                    }
                    .hs_error_rollup {
                      font-size: 12px;
                      color: #ff0000;
                      margin-bottom: 8px;
                      display: none;
                    }
                    .hs-error-msgs {
                      margin: 0;
                      list-style-type: none;
                      position:absolute;
                    }
                    .hs-error-msgs li {
                      line-height: 1;
                    }
                    .hs-error-msgs .hs-error-msg {
                      // position: absolute;
                      color: #ca6458;
                      font-size: 12px;
                      display: inline-block;
                      margin-top: 8px;
                    }
                    .hs-main-font-element {
                      color: #ff0000;
                      font-size: 12px;
                    }
                    .hs-company {
                      width: 100% !important;
                    }
                    .submitted-message {
                      padding: 48px 24px 24px;
                      background-color: #f0f9f4;
                      border-radius: 4px;
                      text-align: center;
                      background: url(/tickGreenBg.svg) no-repeat center 18px /
                        20px auto #f0f9f4;
                    }
                    .submitted-message p {
                      font-weight: 400;
                      font-size: 16px;
                      line-height: 24px;
                      color: #2d353e;
                      display: inline-flex;
                      text-align: center;
                      // font-family: '__Inter_304c0d', '__Inter_Fallback_304c0d';
                    }
                    .submitted-message p strong {
                      font-weight: 600;
                      font-size: 18px;
                    }

                    @media (min-width: 768px){
                        form.hs-form-private{
                          display: flex;
                          flex-wrap: wrap;
                          justify-content: space-between;
                          column-gap: 14px;
                        }
                        .hs-form-field {
                          width: 48%;
                          flex-grow: 1;
                        }
                        .hs-yo_message{
                          width: 100%;
                        }
                        .submitted-message p{
                          font-size: 18px;
                          line-height: 24px;
                        }
                        .submitted-message p strong{
                          font-size: 20px;
                        }
                      }

                    .hs-fieldtype-radio {
                      width: 100%;
                    }

                    .hs-fieldtype-radio ul {
                      display: flex;
                      align-items: center;
                      gap: 48px;
                    }

                    .hs-fieldtype-radio ul li span {
                      font-size: 14px;
                      color: #38424d;
                    }
                    .hs-button.primary.large {
                    margin-top: 32px !important;
                      padding: 10px 24px;
                      border-radius: 8px;
                      background-color: #B5EB92 !important;
                      border: 1px solid #92D96A !important;
                      color: #030712 !important;
                      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-weight: 500 !important;
                      font-size: 16px !important;
                      line-height: 24px !important;
                      transition: all 0.3s ease-linear !important;
                      cursor: pointer !important;
                      display: inline-flex !important;
                      align-items: center !important;
                      justify-content: center !important;
                      white-space: nowrap !important;
                      letter-spacing: 0.025em !important;
                      text-align: center !important;
                    }
                    .hs-button.primary.large:hover {
                      background-color: #A5DB82 !important;
                      border-color: #82C96A !important;
                    }
                    .hs-button.primary.large:focus {
                      outline: none !important;
                      box-shadow: 0 0 0 2px rgba(146, 217, 106, 0.3) !important;
                    }
                  `}
                </style>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default PartnersReferralSection
