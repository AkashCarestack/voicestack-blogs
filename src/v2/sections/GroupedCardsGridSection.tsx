import React from 'react'
import Container from '~/components/structure/Container'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'
import Section from '~/components/structure/Section'
import GroupedCardsGrid from '~/v2/components/GroupedCardsGrid'
import cardsData from '~/v2/data/cardsData.json'
import AiSectionGraphic from 'public/assets/ai-section-graphic.png'
import Image from 'next/image'

interface GroupedCardsGridSectionProps {
  data?: {
    ctaListItems?: { ctaLink?: string; ctaText?: string; ctaType?: string }[]
    sectionHeadingDynamic?: any
    description?: string
    customText?: string
    useReference?: boolean
    blocksListingDataCustom?: any
    blocksListingData?: any
    items?: Array<{
      _key?: string
      heading?: string
      subheading?: string
      description?: string
      link?: {
        url?: string
        text?: string
        buttonType?: string
      }
      dynamicSvg?: string
      image?: any
      icon?: any
    }>
    // customListingItems?: Array<{
    //   _key?: string
    //   heading?: string
    //   cardType?: 'numbered' | 'specialty'
    //   columnCount?: 2 | 3 | 4
    //   listIconSvgCode?: string
    //   listItems?: Array<{
    //     _key?: string
    //     itemHeading?: string
    //     content?: any
    //     dynamicSvgCode?: string
    //     link?: {
    //       url?: string
    //     }
    //   }>
    // }>
    customListingItems?: any[]
    columnCount?: 2 | 3 | 4
  }
  theme?: 'light' | 'dark'
  aiSection?: boolean
  sectionBorder?: 'b' | 't' | 'y' | 'none'
  sectionSpacing?: 'pt-sm' | 'pt-md' | 'pt-lg' | 'py-0'
  noLink?: boolean
  demoCta?: boolean
}



export default function GroupedCardsGridSection({ data, theme, aiSection=false, sectionBorder='y', sectionSpacing, noLink=false, demoCta=false}: GroupedCardsGridSectionProps) {

  // console.log('data GroupedCardsGridSection', data)
  if (!data) return null

  const blocksListingData = data?.blocksListingData 
  const useReferenceData = data?.useReference && blocksListingData
  const displayData = useReferenceData ? blocksListingData : data
  const isDark = theme === 'dark'
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200'
  const bgColor = isDark ? 'bg-gray-950' : 'bg-white'
  const textColor = isDark ? 'text-white' : 'text-gray-950'
  const labelColor = isDark ? '[&>span]:text-vs-lemon-green' : '[&>span]:text-vs-blue'
  const headingSplitColor = isDark ? 'text-vs-blue' : 'text-gray-400'
  const topPaddingSm = sectionSpacing && sectionSpacing == "pt-sm";
  const pyNoPadding = sectionSpacing && sectionSpacing == "py-0";
  // console.log('displayData GroupedCardsGridSection',displayData);
  const customDescription = data.description || ''
  

  return (
    <Section className={bgColor} border={sectionBorder} isDark={isDark}>
      <Container type="V2" border="y-0" darkTheme={isDark} className={` ${topPaddingSm ? '' : 'md:pt-md lg:pt-lg'} ${pyNoPadding ? '!py-0' : 'pt-sm pb-sm'}`}>
        <div className={`flex flex-col w-full border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          {/* Header Section */}
          <div className="flex-col relative w-full flex gap-16">
            {aiSection || displayData.sectionHeadingDynamic || displayData.heading ? (
              <div>
                {aiSection ? (
                  <>
                    <div className="h-[290px] mb-12">
                      <Image src={AiSectionGraphic} alt="AI Section Graphic"
                      className="w-full h-full object-cover"
                      width={1332} height={400} />
                    </div>
                    <div className="flex justify-center">
                      <h3 className="font-semibold lg:text-3xl text-xl leading-[1.5] text-white mb-1 tracking-normal font-manrope">VoiceStack AI</h3>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <SectionHeaderV2
                  heading={displayData.sectionHeadingDynamic || displayData.heading}
                  description={customDescription || displayData.description || ''}
                  className="xl:px-12 md:px-6 px-4"
                  isWhite={isDark}
                  ctaListItems={displayData.ctaListItems}
                  aiSection={aiSection} 
                  demoButton={demoCta}
                />
              </div>
            ):(
              <></>
            )}
            <div>
              <div>

                <GroupedCardsGrid
                  customListingItems={displayData.customListingItems}
                  theme={theme}
                  noLink={noLink}
                />

                {/* To show data from listItems or for feature child card */}
                {displayData.items && displayData.items.length > 0 && (
                  <GroupedCardsGrid
                    customListingItems={displayData.items}
                    theme={theme}
                    simpleListingData={true}
                    columnCount={displayData.columnCount || 4}
                  />
                )}
              </div>
              {/* Card Groups */}

              {/* Footer Section */}
              {(() => {
                // Get customText from data level
                const customText = displayData.customText
                
                return (
                  customText && (
                  <div className={`border-t ${borderColor} flex gap-3 items-start justify-center leading-0 p-6 text-base tracking-normal w-full`}>
                    
                    <div className={`flex flex-col font-geist font-normal justify-center relative ${textColor}`}>
                      <p className={`leading-[24px] ${labelColor} [&>span]:font-medium [&>span]:mr-3`} dangerouslySetInnerHTML={{ __html: customText }}  >
                      </p>
                    </div>
                  </div>
                ))
              })()}

            </div>
          </div>

        </div>
      </Container>
    </Section>
  )
}

