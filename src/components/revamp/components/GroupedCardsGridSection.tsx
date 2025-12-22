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
    customListingItems?: Array<{
      _key?: string
      heading?: string
      listItems?: Array<{
        _key?: string
        itemHeading?: string
        content?: any
        dynamicSvgCode?: string
      }>
    }>
  }
}

export default function GroupedCardsGridSection({ data }: GroupedCardsGridSectionProps) {
  if (!data) return null

  // Portable text components for numbered cards (simple text)
  const numberedCardComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: ({ children }) => (
        <p className="font-geist font-medium md:text-lg text-base leading-[155%] text-gray-950 tracking-normal">
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
        <p className="font-geist font-normal text-base leading-[24px] text-gray-700 tracking-normal">
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="flex flex-col gap-1">{children}</ul>
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
          <div className="flex-1 font-geist font-normal text-base leading-[150%] text-gray-700 tracking-normal">
            {children}
          </div>
        </li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
    },
  }

  const customListingItems = data.customListingItems || []

  return (
    <Section className="bg-white" border="b">
      <Container type="V2" border="t-0">
        <div className="flex flex-col w-full">
          {/* Header Section */}
          <div className="flex flex-col gap-8 items-center justify-center py-16 px-0">
            <SectionHeaderV2
              heading={data.sectionHeadingDynamic}
              description={data.description || ''}
              className="xl:px-12 md:px-6 px-4"
            />
          </div>

          {/* Card Groups */}
          {customListingItems.map((group, groupIndex) => {
            const isFirstGroup = groupIndex === 0
            const isNumberedCards = isFirstGroup

            return (
              <div key={group._key || groupIndex} className="flex flex-col w-full">
                {/* Group Header */}
                <div className="bg-gray-50 border-t border-l border-r border-gray-200 flex items-center justify-center px-12 py-8">
                  <h3 className="font-geist font-medium md:text-xl text-lg leading-[140%] text-gray-950 tracking-normal text-wrap whitespace-nowrap">
                    {group.heading}
                  </h3>
                </div>

                {/* Cards Grid */}
                <div
                  className={`bg-gray-200 grid gap-px  ${
                    isNumberedCards
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                  }`}
                >
                  {group.listItems?.map((item, itemIndex) => (
                    <div
                      key={item._key || itemIndex}
                      className="bg-white flex flex-col items-start pb-6 pt-0 px-0 min-h-0 min-w-0"
                    >
                      <div className="flex flex-col gap-8 items-start pb-3 pt-9 px-12 w-full">
                        {/* Icon (for specialty cards) */}
                        {!isNumberedCards && item.dynamicSvgCode && (
                          <div
                            className="overflow-clip relative shrink-0 w-8 h-8"
                            dangerouslySetInnerHTML={{ __html: item.dynamicSvgCode }}
                          />
                        )}

                        <div className="flex flex-col gap-1.5 items-start justify-end w-full">
                          {/* Item Heading */}
                          {isNumberedCards ? (
                            <p className="font-geist font-medium text-lg leading-[155%] text-gray-500 tracking-normal w-full whitespace-pre-wrap">
                              {item.itemHeading}.
                            </p>
                          ) : (
                            <div className="flex flex-col items-start pb-0 pt-0 px-0 w-full">
                              <div className="flex flex-col gap-1 items-start mb-[-1px] w-full">
                                <p className="font-geist font-medium text-xl leading-[140%] text-gray-950 tracking-normal w-full whitespace-pre-wrap">
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
                                            {/* <div className="flex items-center py-1 shrink-0">
                                              <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M6 4L10 8L6 12"
                                                  stroke="#6A7282"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            </div> */}
                                            <div className="flex-1 font-geist font-normal md:text-base text-sm leading-[150.5%] text-gray-700 tracking-normal">
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

          {/* Footer Section - Hard Coded */}
          <div className="border-t border-gray-200 flex md:flex-row flex-col gap-3 items-start justify-center leading-[140%] p-6 text-base tracking-normal w-full">
            <div className="flex flex-col font-geist font-medium justify-center relative shrink-0 text-[#4a3ce1]">
              <p className="leading-[24px] whitespace-nowrap">The Outcome</p>
            </div>
            <div className="flex flex-col font-geist font-normal justify-center relative md:shrink-0 text-gray-950">
              <p className="leading-[24px]">
                Blind spots lead to lost revenue, missed follow-up, and a compromised experience for patients
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

