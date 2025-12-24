import React from 'react'
import Container from '~/components/structure/Container'
import SectionHeaderV2 from './common/sectionHeaderV2'
import Section from '~/components/structure/Section'
import GroupedCardsGrid from './common/GroupedCardsGrid'

interface GroupedCardsGridSectionProps {
  data?: {
    sectionHeadingDynamic?: any
    description?: string
    customText?: string
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
      }>
    }>
  }
  theme?: 'light' | 'dark'
}

export default function GroupedCardsGridSection({ data, theme }: GroupedCardsGridSectionProps) {
  if (!data) return null

  const isDark = theme === 'dark'
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200'
  const bgColor = isDark ? 'bg-gray-950' : 'bg-white'
  const textColor = isDark ? 'text-white' : 'text-gray-950'

  return (
    <Section className={bgColor} border="b">
      <Container type="V2" border="t-0" darkTheme={isDark}>
        <div className="flex flex-col w-full">
          {/* Header Section */}
          <div className="flex flex-col gap-8 items-center justify-center py-16 px-0">
            <SectionHeaderV2
              heading={data.sectionHeadingDynamic}
              description={data.description || ''}
              className="xl:px-12 md:px-6 px-4"
              isWhite={isDark}
            />
          </div>

          {/* Card Groups */}
          <GroupedCardsGrid
            customListingItems={data.customListingItems}
            theme={theme}
          />

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
      </Container>
    </Section>
  )
}

