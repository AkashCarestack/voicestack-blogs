import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import SectionHeader from './common/sectionHeader'
import Image from 'next/image'
import WorldMap from 'public/assets/world-map.png'

const StatisticsSection = () => {
  const statistics = [
    {
      value: "1500+",
      label: "Practices Globally"
    },
    {
      value: "$80,000",
      label: "Average Additional Revenue Per Location"
    },
    {
      value: "84%",
      label: "Call Conversion Rate"
    },
    {
      value: "100,000+",
      label: "Calls Handled Every Day"
    }
  ]

  return (
    <div className='w-full px-4 xl:px-12'>
      <div className={`rounded-[24px] bg-[linear-gradient(288deg,_#E0DDFF_0.48%,_#4A3CE1_98.9%)] justify-center relative`}>
        <Container className='w-full lg:py-24 py-16 px-6'>
          <div className="relative w-full flex gap-16">
            {/* Main Content */}
            <div className="relative z-10 max-w-[645px] w-full flex flex-col gap-12 flex-grow">
             
              <SectionHeader
                isLeftAlign={true} 
                isWhite={true}
                heading={'The Most Advanced AI Phone System for Dentists Globally.'}
                description={"VoiceStack is the fastest-growing AI phone system preferred by growth-focused dental practices across the US, UK, and Australia. From single offices to DSOs with hundreds of locations, brands rely upon VoiceStack's superior AI models, guaranteed reliability, and ease of use to create delightful patient experiences and sustained growth."}
              />
              
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                {statistics.map((stat, index) => (
                  <div key={index} className="">
                    <div className='flex flex-col gap-1 border-l-2 border-white/30 md:px-6 px-3'>
                      <span className="text-2xl font-semibold text-white md:text-3xl lg:text-4xl font-manrope">
                        {stat.value}
                      </span>
                      <span className="text-sm text-white md:text-base lg:text-base leading-normal">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            
              
              <div className="flex justify-center md:justify-start">
                <Button
                  type="primary"
                  className="w-fit"
                  link="/demo"
                >
                  <span>
                    {'Book Free Demo'}
                  </span>
                </Button>
              </div>
            </div>

          </div>
        </Container>
        <div className="absolute bottom-0 right-0 w-[50%] max-w-[727px] lg:block hidden">
          <Image src={WorldMap} alt='World Map' className="h-auto w-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default StatisticsSection
