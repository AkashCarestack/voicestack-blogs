import React from 'react'
import { PortableText } from '@portabletext/react'
import { PortableTextReactComponents } from '@portabletext/react'
import Container from '~/components/structure/Container'
import SectionHeaderV2 from './common/sectionHeaderV2'
import Section from '~/components/structure/Section'

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
  const descriptionColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const gridBgColor = isDark ? 'bg-gray-800' : 'bg-gray-200'
  const cardBgColor = isDark ? 'bg-gray-950' : 'bg-white'
  const headerBgColor = isDark ? 'bg-gray-950' : 'bg-gray-50'
  const contentTextColor = isDark ? 'text-gray-300' : 'text-gray-700'
  const svgStrokeColor = isDark ? '#D1D5DB' : '#6A7282' // gray-300 for dark, original for light

  // Portable text components for numbered cards (simple text)
  const numberedCardComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: ({ children }) => (
        <p className={`font-geist font-medium text-lg leading-[1.55] ${textColor} tracking-normal`}>
          {children}
        </p>
      ),
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
    },
  }

  // Portable text components for specialty cards (with bullet lists)
  const specialtyCardComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: ({ children }) => (
        <p className={`font-geist font-normal text-base leading-[24px] ${contentTextColor} tracking-normal`}>
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="flex flex-col gap-1 ml-[-24px]">{children}</ul>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="flex gap-2 items-start">
          <div className="flex items-center pt-1 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="#6A7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={`flex-1 font-normal text-base leading-normal ${contentTextColor} tracking-normal`}>
            {children}
          </div>
        </li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      highlight: ({ children }) => <span className={` ${contentTextColor} font-medium flex flex-col gap-[6px] pt-3 md:pt-6 [&>strong]:text-vs-lemon-green [&>strong]:font-medium  `}>{children}</span>,
    },
  }

  const customListingItems = data.customListingItems || []

  // Function to process SVG code and update stroke colors for dark theme
  const processSvgCode = (svgCode: string): string => {
    if (!isDark || !svgCode) return svgCode
    // Replace common stroke colors with gray-300 (#D1D5DB) for dark theme
    return svgCode
      .replace(/stroke="#030712"/gi, 'stroke="#FFFFFF"') // Original gray to gray-300 (case insensitive)
      .replace(/stroke="#6A7282"/gi, 'stroke="#D1D5DB"') // Original gray to gray-300 (case insensitive)
      .replace(/stroke="rgb\(106,\s*114,\s*130\)"/gi, 'stroke="#D1D5DB"') // RGB variant with optional spaces
      .replace(/stroke="rgba\(106,\s*114,\s*130[^)]*\)"/gi, 'stroke="#D1D5DB"') // RGBA variant
      .replace(/stroke='#6A7282'/gi, "stroke='#D1D5DB'") // Single quotes (case insensitive)
      .replace(/stroke=#6A7282/gi, 'stroke="#D1D5DB"') // No quotes variant
  }

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
          {customListingItems.map((group, groupIndex) => {
            // Default to 'specialty' if cardType is not set (backward compatibility)
            const isNumberedCards = group.cardType === 'numbered'

            return (
              <div key={group._key || groupIndex} className={`flex flex-col w-full ${!group.heading ? `border-t ${borderColor}` : ""}`}>
                {/* Group Header */}
                {group.heading && (
                  <div className={`${headerBgColor} border-t border-b ${borderColor} flex items-center justify-center px-12 py-8`}>
                    <h3 className={`font-geist font-medium text-xl leading-[1.4] ${textColor} tracking-normal whitespace-nowrap`}>
                        {group.heading}
                      </h3>
                  </div>
                )}

                {/* Cards Grid */}
                <div
                  className={`${gridBgColor} grid gap-px ${
                    (() => {
                      const columns = group.columnCount || 3
                      const gridClasses: Record<number, string> = {
                        2: 'grid-cols-1 md:grid-cols-2',
                        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
                      }
                      return gridClasses[columns] || gridClasses[3]
                    })()
                  }`}
                >
                  {group.listItems?.map((item, itemIndex) => (
                    <div
                      key={item._key || itemIndex}
                      className={`${cardBgColor} flex flex-col items-start pb-6 pt-0 px-0 min-h-0 min-w-0`}
                    >
                      <div className="flex flex-col gap-8 items-start pb-3 pt-9 px-12 w-full">
                        {/* Icon (for specialty cards) */}
                        {!isNumberedCards && item.dynamicSvgCode && (
                          <div
                            className="overflow-clip relative shrink-0 w-8 h-8"
                            dangerouslySetInnerHTML={{ __html: processSvgCode(item.dynamicSvgCode) }}
                          />
                        )}

                        <div className="flex flex-col gap-1.5 items-start justify-end w-full">
                          {/* Item Heading */}
                          {isNumberedCards ? (
                            <p className={`font-geist font-medium text-lg leading-[1.4] ${descriptionColor} tracking-normal w-full whitespace-pre-wrap`}>
                              {item.itemHeading}.
                            </p>
                          ) : (
                            <div className="flex flex-col items-start pb-0 pt-0 px-0 w-full">
                              <div className="flex flex-col gap-1 items-start mb-[-1px] w-full">
                                <p className={`font-geist font-medium text-xl leading-[1.4] ${textColor} tracking-normal w-full whitespace-pre-wrap`}>
                                  {item.itemHeading}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex flex-col items-start pb-0 pt-0 px-0 w-full">
                            {item.content && (
                              <div className="flex flex-col gap-1 items-start mb-[-1px] w-full">
                                {isNumberedCards ? (
                                  <PortableText
                                    value={item.content}
                                    components={numberedCardComponents}
                                  />
                                ) : (
                                  <div className="flex flex-col items-start pb-3 pt-0 w-full">
                                    {item.content.map((block: any, blockIndex: number) => {
                                      // Check if this is a bullet list item
                                      if (block.listItem === 'bullet') {
                                        return (
                                          <div
                                            key={block._key || blockIndex}
                                            className="flex gap-2 items-start px-0 py-1 w-full"
                                          >
                                           
                                            <div className={`flex-1 font-geist font-normal text-base leading-[24px] ${contentTextColor} tracking-normal`}>
                                              <PortableText
                                                value={[block]}
                                                components={specialtyCardComponents}
                                              />
                                            </div>
                                          </div>
                                        )
                                      }
                                      // Regular block
                                      return (
                                        <PortableText
                                          key={block._key || blockIndex}
                                          value={[block]}
                                          components={specialtyCardComponents}
                                        />
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Footer Section */}
          {(() => {
            // Get customText from data level
            const customText = data.customText
            
            return (
              customText && (
              <div className={`border-t ${borderColor} flex gap-3 items-start justify-center leading-0 p-6 text-base tracking-normal w-full`}>
                
                <div className={`flex flex-col font-geist font-normal justify-center relative shrink-0 ${textColor}`}>
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

