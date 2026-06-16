import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { descriptionComponents, HeroHeadingComponents } from '~/utils/common'

export default function HeroAU({
  image,
  heading,
  description,
  heroStrip,
  buttons,
}: {
  image: any
  heroStrip: string
  heading: any
  description: any
  buttons: Array<any>
}) {
  const router = useRouter()
  const isUSLocale = router.locale === 'en'

  const ThunderSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M2.66699 9.33328C2.54083 9.33371 2.41714 9.29833 2.31029 9.23126C2.20344 9.1642 2.11781 9.06818 2.06335 8.95438C2.0089 8.84059 1.98785 8.71367 2.00265 8.58838C2.01746 8.4631 2.06751 8.34459 2.14699 8.24661L8.74699 1.44661C8.7965 1.38947 8.86396 1.35085 8.93831 1.3371C9.01266 1.32335 9.08947 1.33529 9.15614 1.37095C9.22281 1.40661 9.27538 1.46388 9.30521 1.53335C9.33504 1.60283 9.34037 1.68038 9.32032 1.75328L8.04032 5.76661C8.00258 5.86763 7.9899 5.97629 8.00338 6.08328C8.01686 6.19028 8.05609 6.2924 8.11771 6.3809C8.17933 6.46939 8.2615 6.54162 8.35717 6.59139C8.45284 6.64115 8.55915 6.66696 8.66699 6.66661H13.3337C13.4598 6.66618 13.5835 6.70156 13.6904 6.76863C13.7972 6.8357 13.8828 6.93171 13.9373 7.04551C13.9917 7.15931 14.0128 7.28622 13.998 7.41151C13.9832 7.53679 13.9331 7.65531 13.8537 7.75328L7.25365 14.5533C7.20415 14.6104 7.13668 14.649 7.06233 14.6628C6.98798 14.6765 6.91117 14.6646 6.8445 14.6289C6.77783 14.5933 6.72526 14.536 6.69543 14.4665C6.6656 14.3971 6.66027 14.3195 6.68032 14.2466L7.96032 10.2333C7.99806 10.1323 8.01074 10.0236 7.99726 9.91661C7.98378 9.80962 7.94455 9.70749 7.88293 9.619C7.82131 9.5305 7.73914 9.45827 7.64347 9.40851C7.5478 9.35874 7.44149 9.33293 7.33365 9.33328H2.66699Z"
          stroke="#030712"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }

  return (
    <Section  className='border-b bg-gray-50 overflow-hidden'>
      <Container type="V2" className=" md:py-[136px] py-[64px] md:pl-12 gap-12">
        <div className='flex md:flex-row relative '>
          {/* <video
            className='hidden lg:block absolute w-full h-full object-cover z-0'
            autoPlay
            loop
            muted
            playsInline
            style={{ 
              '--tw-translate-x': '91px',
              transform: 'rotate(143deg) scale(1.1)',
              transformOrigin: 'center center',
              right: '-25rem',
              mixBlendMode: 'multiply'
            } as React.CSSProperties}
          >
            <source src="https://cdn.sanity.io/files/76tr0pyh/develop/afbf5be56052d1634405ab6b95302674d38298c8.mp4" type="video/mp4" />
          </video> */}
          
          <div className='flex flex-col gap-4 flex-1 md:max-w-[606px] relative '>
          <div className='flex justify-center items-center md:justify-start'>
            <h1 className='px-3.5 py-[9px] flex items-center gap-1.5 rounded-full border w-fit border-[#AEA0FF] bg-white/20 shadow-glow' ><ThunderSvg />
            <span className="font-geist text-sm text-gray-950 font-normal leading-4 tracking-normal capitalize">{heroStrip}</span>
            </h1>
            </div>
            <div className='flex flex-col gap-4 flex-1'>
              {isUSLocale ? (
                <>
                  <h2 className="text-gray-950  md:max-w-[607px] w-full font-manrope xl:text-6xl md:text-5xl text-center md:text-left text-3xl font-bold !leading-[116.667%] md:tracking-[-1.8px] tracking-normal">
                    <span className="block">Did You Know?</span>
                    <p className='xl:text-[40px] md:text-3xl text-2xl !leading-[120%]'>
                      <span className=" text-vs-purple">
                        3 out of 10 Incoming Calls <br />
                      </span>
                      <span className="">
                        Are Missed At Dental Offices
                      </span>
                    </p>
                  </h2>
                  <p className="md:text-left text-center md:text-lg text-base text-gray-950 leading-normal max-w-[470px] font-normal">
                    VoiceStack helps you reduce missed calls, re-engage lost opportunities, and measure your staff performance, unlocking up to $50,000 every month.
                  </p>
                </>
              ) : (
                <>
                  <PortableText value={heading} components={HeroHeadingComponents} />
                  <PortableText value={description} components={descriptionComponents} />
                </>
              )}
            </div>
            <div className='flex flex-col md:flex-row md:gap-[18px] items-center md:mt-8 mt-6 gap-3'>
            {buttons &&
              buttons.length &&
              buttons.map((button) => (
                <Button
                  key={button._key}
                  type={button.buttonType}
                  link={button.buttonLink}
                >
                  <span>{button?.buttonText}</span>
                </Button>
              ))}
              </div>
          </div>
          <div className='hidden md:block md:relative flex-1 z-10'>
        <div className='flex-1 md:ml-auto md:absolute w-[1024px] h-[679px] left-[20px]'>
          {/* Image overlay */}
          {image?.url && <Image className='relative w-full h-full flex-1 object-contain z-10' alt={heading} width={1024} height={679} src={image.url} />}
        </div>
      </div>
      </div>
    </Container>
  </Section>
)
}
