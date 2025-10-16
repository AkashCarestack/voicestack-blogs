import React from 'react'
import Container from '~/components/structure/Container'
import SectionHeader from './common/sectionHeader'
import Image from 'next/image'

interface ComparisonCard {
  _key?: string
  title: string
  subtitle?: string
}

interface VoiceStackComparisonCardsProps {
  data?: {
    heading?: string
    description?: string
    cards?: ComparisonCard[]
  }
}

const VoiceStackComparisonCards = ({ data }: VoiceStackComparisonCardsProps) => {
  // Default data based on Figma design
  const defaultCards: ComparisonCard[] = [
    { _key: '1', title: 'Mango Voice' },
    { _key: '2', title: 'Peerlogic' },
    { _key: '3', title: 'Patient Prism' },
    { _key: '4', title: 'Mango Voice' },
    { _key: '5', title: 'Peerlogic' },
    { _key: '6', title: 'Mango Voice' },
    { _key: '7', title: 'Ring Central' },
    { _key: '8', title: 'Patient Prism' },
  ]

  const heading = data?.heading || 'Discover Why VoiceStack Excels in Business Phones'
  const description = data?.description || 'Deliver first-touchpoint resolutions by automatically routing calls to relevant teams and agents.'
  const cards = data?.cards || defaultCards

  return (
    <div className="w-full px-4 xl:px-12 bg-[#F9F9F9]">
      <div className="rounded-[24px] justify-center relative overflow-hidden">
        <Container className="w-full lg:py-24 py-16 px-6">
          <div className="relative w-full">
            {/* Background Image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[104.21deg] opacity-20">
                <div className="w-[1247px] h-[1247px] relative">
                  <Image
                    src="https://www.figma.com/api/mcp/asset/d0e1faf4-f2fe-437a-a2dd-20ff6a3d8107"
                    alt="Background pattern"
                    fill
                    className="object-cover blur-[7.5px]"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full flex flex-col items-center gap-16">
              {/* Hero Section */}
              <SectionHeader
                heading={heading}
                description={description}
                className="max-w-[620px]"
              />

              {/* Cards Grid */}
              <div className="w-full max-w-[1240px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {cards.map((card, index) => (
                    <div
                      key={card._key || index}
                      className="bg-[#f4f3fa] rounded-xl p-8 flex flex-col gap-8 min-h-[120px] hover:bg-[#e8e6f0] transition-colors duration-200"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="font-geist font-normal text-[14px] text-gray-950 opacity-70 tracking-[0.8px] uppercase leading-[20px]">
                          VoiceStack vs.
                        </p>
                        <h3 className="font-manrope font-bold text-[24px] text-gray-950 leading-[32px]">
                          {card.title}
                        </h3>
                        {card.subtitle && (
                          <p className="font-geist font-normal text-[16px] text-gray-700 leading-[24px] mt-2">
                            {card.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
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

export default VoiceStackComparisonCards
