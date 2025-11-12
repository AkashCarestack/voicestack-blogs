import React, { useEffect, useRef } from 'react'

import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

interface PartnerReferralProps {
  data: any
  theme?: string
}

const PartnersReferralSection: React.FC<PartnerReferralProps> = ({
  data,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!data?.formId) return

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
              formId: data.formId,
              target: `#${formTargetId}`,
            })
          }
        }
        document.body.appendChild(script)
      } else {
        if (window.hbspt) {
          window.hbspt.forms.create({
            portalId: '4832409',
            formId: data.formId,
            target: `#${formTargetId}`,
          })
        }
      }
    }

    loadHubSpotForm()
  }, [data?.formId])

  return (
    <Section className="py-sm md:py-md lg:py-lg bg-white">
      <Container>
        <div id="referral" className="font-sans" ref={containerRef}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left: Image and Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              {data?.heading && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {data.heading}
                </h2>
              )}

              {data?.image && data.image.url && (
                <div className="w-full">
                  <ImageLoader
                    image={data.image.url}
                    alt={data.image.altText || 'Partner referral image'}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}

              {data?.description && (
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {data.description}
                </p>
              )}
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-1/2">
              <div className="w-full" id="partners-form">
                <div id="partners-hubspot-form" ref={formRef}></div>
              </div>
            </div>
          </div>

          <style jsx global>{`
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
              color: #4b5563;
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
            .hs-input {
              width: 100% !important;
            }
            .form-popup .hs-submit {
              margin-top: 8px;
            }
            .form-popup .hs-submit .actions {
              width: 100%;
            }
            .actions {
              width: 100%;
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
              position: absolute;
            }
            .hs-error-msgs li {
              line-height: 1;
            }
            .hs-error-msgs .hs-error-msg {
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
              background: url(/tickGreenBg.svg) no-repeat center 18px / 20px auto
                #f0f9f4;
            }
            .submitted-message p {
              font-weight: 400;
              font-size: 16px;
              line-height: 24px;
              color: #2d353e;
              display: inline-flex;
              text-align: center;
            }
            .submitted-message p strong {
              font-weight: 600;
              font-size: 18px;
            }

            @media (min-width: 768px) {
              form.hs-form-private {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                column-gap: 14px;
              }
              .hs-form-field {
                width: 48%;
                flex-grow: 1;
              }
              .hs-yo_message {
                width: 100%;
              }
              .submitted-message p {
                font-size: 18px;
                line-height: 24px;
              }
              .submitted-message p strong {
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
              background-color: #c8f46e;
              color: #000;
              transition: all 0.3s ease;
            }
            .hs-button.primary.large:hover {
              background-color: #b8e45e;
              color: #000;
            }
          `}</style>
        </div>
      </Container>
    </Section>
  )
}

export default PartnersReferralSection
