import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import PillsBg from 'public/assets/Pattern.png'
import { ComparisonHeroDescriptionComponents, ComparisonHeroH2 } from '~/utils/common'

export default function ComparisonHero({
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

  return (
    <Section  
     style={{background:'linear-gradient(258deg, #D3C6FB 0%, #393CC0 100%)'}}
     className=' bg-gray-50 overflow-hidden relative'>
        <Image src={PillsBg} alt='Pills Background' className="absolute bottom-0 right-0 h-full w-auto hidden md:block"
        width={727}
        height={727}
        />
      <Container type="V2" className=" md:py-[136px] py-[64px] md:pl-12 gap-12">
        <div className='flex md:flex-row static '>
       
          
          <div className='flex flex-col gap-4 flex-1 md:max-w-[606px] relative '>
          <div className='flex justify-center items-center md:justify-start'>
            <h1 className='text-white/50 font-geist text-base font-medium leading-[150%] tracking-[0.8px] uppercase' >
            {heroStrip}
            </h1>
            </div>
            <div className='flex flex-col gap-4 flex-1'>
            <PortableText value={heading} components={ComparisonHeroH2} />
            <PortableText value={description} components={ComparisonHeroDescriptionComponents} />
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
        <div className='flex-1 md:ml-auto md:absolute w-[1024px] h-[640px]'>
          {/* Image overlay */}
          {image?.length && <Image className='relative w-full h-full flex-1 object-contain z-10' alt={heading} width={1024} height={640} src={image} />}
        </div>
      </div>
      </div>
    </Container>
  </Section>
)
}
