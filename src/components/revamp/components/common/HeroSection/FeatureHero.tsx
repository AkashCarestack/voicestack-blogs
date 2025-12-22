import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import bgStyle from '../../../../../../public/assets/Bg/image 682.png'
import { descriptionComponents, HeroFeatureHeadingComponents, HeroHeadingComponents } from '~/utils/common'

export default function FeatureHero({ data }: { data: any }) {
  const value = data?.heroComponent
  const buttons = value?.bookBtnContent
  const heading = value?.heroheading
  const description = value?.heroDescription
  const title = value?.heroStrip
  return (

    <>
    <Container type="V2" className="md:py-24 py-16 relative overflow-hidden">
      <div className='flex flex-col gap-3 relative z-10'>
        <h2 className="text-center md:text-left text-base font-geist font-medium leading-[150%] tracking-[0.8px] text-gray-950 uppercase">
          {title?.toUpperCase()}
        </h2>
        <PortableText value={heading} components={HeroFeatureHeadingComponents} />
        <PortableText value={description} components={descriptionComponents} />
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
   
    </Container>
            
            { <div className='hidden md:block absolute right-0 top-0 w-[1000px] h-[738px] pointer-events-none z-0'>
              <Image className='w-full h-full object-contain' alt="bgStyle" width={1049} height={738} src={bgStyle.src} />
            </div> }
            </>
  )
}
