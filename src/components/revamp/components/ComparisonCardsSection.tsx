import React from 'react'
import Container from '~/components/structure/Container'
import SectionHeader from './common/sectionHeader'
import Image from 'next/image'
import { Link } from 'lucide-react'
import Anchor from '~/components/common/anchor'
import CornerAccent from 'public/assets/purple-corner-accent.png'



const ComparisonCardsSection = ({ data }: any) => {
  // Default data based on Figma design
  // const defaultCards: ComparisonCard[] = [
  //   { _key: '1', title: 'Mango Voice' },
  //   { _key: '2', title: 'Peerlogic' },
  //   { _key: '3', title: 'Patient Prism' },
  //   { _key: '4', title: 'Mango Voice' },
  //   { _key: '5', title: 'Peerlogic' },
  //   { _key: '6', title: 'Mango Voice' },
  //   { _key: '7', title: 'Ring Central' },
  //   { _key: '8', title: 'Patient Prism' },
  // ]

  // const heading = data?.heading || 'Discover Why VoiceStack Excels in Business Phones'
  // const description = data?.description || 'Deliver first-touchpoint resolutions by automatically routing calls to relevant teams and agents.'
  // const cards = data?.cards || defaultCards

  return (
    <div className="w-full px-4 xl:px-12 bg-[#F9F9F9]">
      <div className="rounded-[24px] justify-center relative overflow-hidden bg-[linear-gradient(288deg,_#E0DDFF_0.48%,_#4A3CE1_98.9%)]">
        <Container className="w-full lg:py-24 py-16 px-6">
          <div className="w-full">
            {/* Background Image */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-[1000px] flex items-center justify-end pointer-events-none">
              <Image
                src={CornerAccent}
                alt="Background pattern"
                fill
                className="object-cover blur-[7.5px]"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full flex flex-col items-center gap-16">
              {/* Hero Section */}
              <SectionHeader
                heading={data?.heading}
                description={data?.description}
                isWhite={true}
                className="lg:!w-[630px]"
              />

              {/* Cards Grid */}
              <div className="w-full max-w-[1240px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {data?.items?.map((card:any, index:number) => (
                    <Anchor href={card.link?.url || '#'} key={card._key || index}>
                    <div
                      className="bg-[#f4f3fa] rounded-xl p-8 flex flex-col gap-8 min-h-[120px] hover:bg-[#e8e6f0] transition-colors duration-200"
                    >
                        <div className="flex flex-col gap-0.5">
                          <p className="font-geist font-normal text-[14px] text-gray-950 opacity-70 tracking-[0.8px] uppercase leading-[20px]">
                            VoiceStack vs.
                          </p>
                          <h3 className="font-manrope font-bold text-[24px] text-gray-950 leading-[32px]">
                            {card.heading}
                          </h3>
                          {/* {card.subtitle && (
                            <p className="font-geist font-normal text-[16px] text-gray-700 leading-[24px] mt-2">
                              {card.subtitle}
                            </p>
                          )} */}
                        </div>
                    </div>
                      </Anchor>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default ComparisonCardsSection
