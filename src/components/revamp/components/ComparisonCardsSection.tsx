import React from 'react'
import Container from '~/components/structure/Container'
import SectionHeader from './common/sectionHeader'
import Image from 'next/image'
import { Link } from 'lucide-react'
import Anchor from '~/components/common/anchor'
import CornerAccent from 'public/assets/purple-corner-accent.png'



const ComparisonCardsSection = ({ data }: any) => {

  if (!data) return null

  return (
    <div className="w-full px-4 xl:px-12 bg-[#F9F9F9]">
      <div className="md:rounded-[24px] rounded-xl justify-center relative overflow-hidden bg-[linear-gradient(288deg,_#E0DDFF_0.48%,_#4A3CE1_98.9%)]">
        <Container className="w-full lg:py-24 py-16 md:px-6 px-4">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {data?.items?.map((card:any, index:number) => (
                    <Anchor href={card.link?.url || '#'} key={card._key || index}>
                    <div
                      className="bg-[#f4f3fa] h-full rounded-xl md:p-8 p-4 flex flex-col gap-8 min-h-[100px] justify-center md:min-h-[120px] hover:bg-[#e8e6f0] transition-colors duration-200"
                    >
                        <div className="flex flex-col gap-0.5">
                          <p className="font-geist font-normal md:text-[14px] text-xs text-gray-950 opacity-70 tracking-[0.8px] uppercase">
                            VoiceStack vs.
                          </p>
                          <h3 className="font-manrope font-bold md:text-[24px] text-lg text-gray-950 leading-normal">
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
