import React from 'react'
import Container from '~/components/structure/Container'
import SectionHeaderV2 from '~/components/revamp/components/common/sectionHeaderV2'
import Section from '~/components/structure/Section'
import GroupedCardsGrid from '~/v2/components/GroupedCardsGrid'
import cardsData from '~/v2/data/cardsData.json'

interface GroupedCardsGridSectionProps {
  data?: {
    ctaListItems: { ctaLink?: string; ctaText?: string; ctaType?: string }[]
    sectionHeadingDynamic?: any
    description?: string
    customText?: string
    items?: Array<{
      _key?: string
      itemHeading?: string
      content?: any
      dynamicSvgCode?: string
      link?: {
        url?: string
      }
    }>
    customListingItems?: Array<{
      _key?: string
      heading?: string
      cardType?: 'numbered' | 'specialty'
      columnCount?: 2 | 3 | 4
      listIconSvgCode?: string
      listItems?: Array<{
        _key?: string
        itemHeading?: string
        content?: any
        dynamicSvgCode?: string
        link?: {
          url?: string
        }
      }>
    }>
  }
  theme?: 'light' | 'dark'
}

export default function GroupedCardsGridSection({ data, theme }: GroupedCardsGridSectionProps) {
  if (!data) return null
  // console.log(data,'data GroupedCardsGridSection')

  const isDark = theme === 'dark'
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200'
  const bgColor = isDark ? 'bg-gray-950' : 'bg-white'
  const textColor = isDark ? 'text-white' : 'text-gray-950'

  return (
    <Section className={bgColor}>
      <Container type="V2" border="t-0" darkTheme={isDark} className="pt-sm md:pt-md lg:pt-lg">
        <div className="flex flex-col w-full">
          {/* Header Section */}
          <div className="flex-col relative w-full flex gap-16">
            <SectionHeaderV2
              heading={data.sectionHeadingDynamic}
              description={data.description || ''}
              className="xl:px-12 md:px-6 px-4"
              isWhite={isDark}
              ctaListItems={data.ctaListItems}
            />
            <div>

              <GroupedCardsGrid
                customListingItems={data.customListingItems}
                theme={theme}
              />

              {/* To show data from listItems or for feature child card */}
              {data.items && data.items.length > 0 && (
                <GroupedCardsGrid
                customListingItems={data.items}
                theme={theme}
                simpleListingData={true}
                  columnCount={4}
                />
              )}
            </div>
            {/* Card Groups */}

            {/* Footer Section */}
            {(() => {
              // Get customText from data level
              const customText = data.customText
              
              return (
                customText && (
                <div className={`border-t ${borderColor} flex gap-3 items-start justify-center leading-0 p-6 text-base tracking-normal w-full`}>
                  
                  <div className={`flex flex-col font-geist font-normal justify-center relative ${textColor}`}>
                    <p className="leading-[24px] [&>span]:text-vs-blue [&>span]:font-medium [&>span]:mr-3" dangerouslySetInnerHTML={{ __html: customText }}  >
                    </p>
                  </div>
                </div>
              ))
            })()}
          </div>

        </div>
      </Container>
    </Section>
  )
}

