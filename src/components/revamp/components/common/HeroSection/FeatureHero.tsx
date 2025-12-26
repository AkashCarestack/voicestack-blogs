import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import bgStyle from '../../../../../../public/assets/Bg/image 682.png'
import { descriptionComponents, HeroFeatureComponents, HeroFeatureHeadingComponents, HeroHeadingComponents } from '~/utils/common'
import { urlForImage } from '~/lib/sanity.image'

export default function FeatureHero({ data ,type}: { data: any, type?: string }) {
  const value = data?.heroComponent
  const buttons = value?.bookBtnContent
  const heading = value?.heroheading
  const description = value?.heroDescription
  const title = value?.heroStrip
  const image = urlForImage(value?.heroImage)
  return (
    <div className="relative overflow-hidden">
      <Container type="V2" className="md:py-24 py-16 overflow-hidden justify-center flex">
        <div className='flex md:flex-row flex-col md:gap-12  max-w-[1240px] w-full gap-6 relative z-10'>
          <div className="flex flex-col gap-3 relative z-10 flex-1">
            <h2 className="text-center md:text-left text-base font-geist font-medium leading-[150%] tracking-[0.8px] text-gray-950 uppercase">
              {title?.toUpperCase()}
            </h2>
            <PortableText
              value={heading}
              components={type === 'feature' ? HeroFeatureComponents : HeroFeatureHeadingComponents}
            />
            <PortableText
              value={description}
              components={descriptionComponents}
            />
            <div className="flex flex-col md:flex-row md:gap-[18px] items-center md:mt-5 mt-4 gap-3">
              {buttons &&
                buttons.length &&
                buttons.map((button: any) => (
                  <Button
                    key={button._key}
                    type={button.buttonType}
                    link={button.buttonLink}
                  >
                    <span>{button?.buttonText}</span>
                  </Button>
                ))}
            </div>

            {/*  */}
          </div>
          {image && <div className='flex-1 md:block hidden w-full h-full max-w-[481px] max-h-[444px]'>
            <Image className='md:w-[481px] md:h-[444px] w-full h-full object-cover' src={image} alt={heading} width={1000} height={1000} />
          </div>}
        </div>
        <div className="hidden z-0 md:block absolute right-0 bottom-0 w-[1000px] h-[738px] pointer-events-none">
          <Image
            className="w-full h-full object-cover"
            alt="bgStyle"
            width={1049}
            height={738}
            src={bgStyle.src}
          />
        </div>
      </Container>
    </div>
  )
}
