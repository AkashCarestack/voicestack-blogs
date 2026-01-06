import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Image from 'next/image'
import WorldMap from 'public/assets/world-map.png'
import WorldMapV2 from 'public/assets/world-map-v2.png'
import Section from '~/components/structure/Section'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'

interface StatisticsSectionProps {
  bgColor?: string
}

const StatisticsSection = ({ bgColor }: StatisticsSectionProps = {}) => {
  const statistics = [
    {
      heading: "Used in",
      value: "1500+",
      label: "Practices Globally"
    },
    {
      heading: "Average",
      value: "$80,000",
      label: "Additional Revenue Per Location"
    },
    {
      heading: "Average",
      value: "84%",
      label: "Call Conversion Rate"
    },
    {
      heading: "Every Day",
      value: "100,000+",
      label: "Calls Handled"
    }
  ]

  return (
    <Section className='bg-gray-50 relative overflow-hidden' border="y">
      <Container className='border-l border-r lg:border-r-0 border-gray-200' type="V2" innerPadding>
        <div className="flex">
          <div className="max-w-[850px] md:py-24 py-16">
            <div className="flex-col relative w-full flex gap-8">

              <SectionHeaderV2 isLeftAlign={true} className=''
                heading={"Advanced AI phone system for dentists globally."}
                // heading={pageData['how-voicestack-works2'].componentData.heading}
                description={"From single offices to DSOs with hundreds of offices, brands rely upon VoiceStack’s superior AI models, guaranteed reliability and ease of use to create delightful patient experiences and sustained growth."}
              />

              <div className="flex justify-start">
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

              <div className="grid grid-cols-2 gap-6 md:gap-8">
                {statistics.map((stat, index) => (
                  <div key={index} className="">
                    <div className='flex flex-col gap-1 border-l border-dashed border-gray-300 md:px-6 px-3'>
                      <span className="text-sm text-vs-blue md:text-base leading-normal">
                        {stat.heading}
                      </span>
                      <span className="text-2xl font-semibold text-gray-950 font-manrope">
                        {stat.value}
                      </span>
                      <span className="text-sm text-gray-950 md:text-base leading-normal">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-[50%] max-w-[727px] lg:block hidden">
            <Image src={WorldMapV2} alt='World Map' className="h-auto w-full object-cover" />
          </div>
          

        </div>
        
      </Container>
    </Section>
  )
}

export default StatisticsSection
