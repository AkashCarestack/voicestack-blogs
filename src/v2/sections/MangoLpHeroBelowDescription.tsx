import React from 'react'
import Button from '~/components/common/Button'

function MangoPromoBoltIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.9612 1.19624C11.071 1.25736 11.1572 1.3535 11.206 1.46931C11.2548 1.58513 11.2634 1.71395 11.2305 1.83524L9.73647 7.31248H15.1875C15.2971 7.31249 15.4043 7.34453 15.496 7.40466C15.5876 7.46479 15.6597 7.55039 15.7034 7.65094C15.747 7.75149 15.7604 7.86261 15.7417 7.97063C15.7231 8.07866 15.6733 8.17888 15.5985 8.25898L7.72346 16.6965C7.63769 16.7886 7.52351 16.8493 7.39918 16.8688C7.27486 16.8883 7.14757 16.8656 7.03768 16.8043C6.92778 16.7429 6.84164 16.6465 6.79301 16.5304C6.74439 16.4144 6.7361 16.2853 6.76946 16.164L8.26346 10.6875H2.81246C2.70284 10.6875 2.59561 10.6554 2.50396 10.5953C2.4123 10.5352 2.34021 10.4496 2.29654 10.349C2.25288 10.2485 2.23955 10.1374 2.25819 10.0293C2.27683 9.92131 2.32663 9.82109 2.40146 9.74098L10.2765 1.30349C10.3622 1.21172 10.4763 1.1513 10.6004 1.13187C10.7245 1.11243 10.8515 1.13509 10.9612 1.19624Z"
        fill="#EFB100"
      />
    </svg>
  )
}

const MANGO_LP_SUMMARY =
  'You may be losing patients, revenue, and team productivity because of these pain points. Switch to VoiceStack today!'

const MANGO_LP_PROMO = 'Switch today and get 2 months free.'

interface MangoLpHeroBelowDescriptionProps {
  buttons?: any[]
  demoLink?: string
}

export default function MangoLpHeroBelowDescription({
  buttons,
  demoLink = '#demo',
}: MangoLpHeroBelowDescriptionProps) {
  const ctaButtons =
    buttons?.length ? buttons : [{ _key: 'mango-demo', buttonType: 'primary', buttonLink: demoLink, buttonText: 'Book Free Demo' }]

  return (
    <div className="flex flex-col gap-[20px] md:gap-[32px] items-center md:items-start w-full">
      <div className="flex flex-col md:flex-row md:gap-[18px] items-center md:mt-5 mt-4 gap-3 w-full">
        {ctaButtons.map((button: any) => (
          <Button
            key={button._key}
            type={button.buttonType || 'primary'}
            link={button.buttonLink || demoLink}
            className="w-full md:w-auto"
          >
            <span className="text-base md:text-lg font-medium font-geist">
              {button?.buttonText || 'Book Free Demo'}
            </span>
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-4 md:gap-4 items-center md:items-start w-full md:max-w-[559px]">
        <p className="font-geist font-normal text-base md:text-lg leading-[155.55%] text-gray-950 text-center md:text-left w-full">
          {MANGO_LP_SUMMARY}
        </p>
        <div className="font-medium text-gray-950 inline-flex items-center gap-2 py-2 pl-2 pr-4 rounded-[4px] bg-[#fef9c2] border border-[#fff085] self-center md:self-start">
          <MangoPromoBoltIcon className="w-4 h-4 md:w-[18px] md:h-[18px] shrink-0" />
          <span className="font-geist font-medium text-base md:text-lg leading-[150%] text-gray-950 text-center md:text-left">
            {MANGO_LP_PROMO}
          </span>
        </div>
      </div>
    </div>
  )
}
