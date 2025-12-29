import React from 'react'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { PortableTextReactComponents } from '@portabletext/react'
import { urlForImage } from '~/lib/sanity.image'
import Image from 'next/image'

// Card content component for rendering card items
interface CardItemMainProps {
  item: any
  isNumberedCards?: boolean
  isSimpleListing?: boolean
  listIconSvgCode?: string
  processSvgCode: (svgCode: string) => string
  textColor: string
  descriptionColor: string
  contentTextColor: string
  numberedCardComponents: Partial<PortableTextReactComponents>
  createSpecialtyCardComponents: (listIconSvgCode?: string) => Partial<PortableTextReactComponents>
}

const CardItemMain: React.FC<CardItemMainProps> = ({
  item,
  isNumberedCards = false,
  isSimpleListing = false,
  listIconSvgCode,
  processSvgCode,
  textColor,
  descriptionColor,
  contentTextColor,
  numberedCardComponents,
  createSpecialtyCardComponents,
}) => {
  const imageUrl = item.image?.url || urlForImage(item.image)
  const hasImage = !!imageUrl
  // Simple listing data mode
  if (isSimpleListing) {
    return (
      <div className="flex flex-col gap-8 items-start pb-3 pt-9 px-12 w-full">
        {/* Icon */}
        {item.dynamicSvg && (
          <div
            className="overflow-clip relative shrink-0 w-8 h-8"
            dangerouslySetInnerHTML={{ __html: processSvgCode(item.dynamicSvg) }}
          />
        )}
        {hasImage && imageUrl && (
          <div className="w-full">
            <Image
              src={imageUrl}
              alt={item.heading || ''}
              width={item.image?.metadata?.dimensions?.width || 800}
              height={item.image?.metadata?.dimensions?.height || 600}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5 items-start justify-end w-full">
          {/* Heading */}
          {item.heading && (
            <div className="flex flex-col items-start pb-0 pt-0 px-0 w-full">
              <div className="flex flex-col gap-1 items-start mb-[-1px] w-full">
                <h4 className={`font-geist font-medium text-xl leading-[1.4] ${textColor} tracking-normal w-full whitespace-pre-wrap [&>span]:text-vs-blue`}
                  dangerouslySetInnerHTML={{ __html: item.heading }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="flex flex-col items-start pb-0 pt-0 px-0 w-full">
              <div className="flex flex-col gap-1 items-start mb-[-1px] w-full">
                <p className={`font-geist font-normal text-base leading-[24px] ${contentTextColor} tracking-normal w-full`}>
                  {item.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Portable text mode
  return (
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
                    // Create components with the group's listIconSvgCode
                    const components = createSpecialtyCardComponents(listIconSvgCode)
                    
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
                              components={components}
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
                        components={components}
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
  )
}



// export interface CustomListingItem {
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
//   jsonItems?: any[]
// }

export interface GroupedCardsGridProps {
  customListingItems?: any[]
  theme?: 'light' | 'dark'
  simpleListingData?: boolean
  columnCount?: 2 | 3 | 4
}

export default function GroupedCardsGrid({ customListingItems = [], theme, simpleListingData = false, columnCount }: GroupedCardsGridProps) {
  if (!customListingItems || customListingItems.length === 0) return null

  const isDark = theme === 'dark'
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200'
  const textColor = isDark ? 'text-white' : 'text-gray-950'
  const descriptionColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const gridBgColor = isDark ? 'bg-gray-800' : 'bg-gray-200'
  const cardBgColor = isDark ? 'bg-gray-950' : 'bg-white'
  const headerBgColor = isDark ? 'bg-gray-950' : 'bg-gray-50'
  const contentTextColor = isDark ? 'text-gray-300' : 'text-gray-700'

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

  // Function to create specialty card components with dynamic listIconSvgCode
  const createSpecialtyCardComponents = (listIconSvgCode?: string): Partial<PortableTextReactComponents> => {
    // Process SVG code for dark theme if needed, or use as-is
    const iconSvg = listIconSvgCode ? processSvgCode(listIconSvgCode) : ''
    
    return {
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
              {iconSvg && <div dangerouslySetInnerHTML={{ __html: iconSvg }} />}
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
  }

  // Helper function to render a card with link wrapper
  const renderCard = (
    item: any,
    itemIndex: number,
    columns: number,
    isSimpleListing: boolean = false,
    isNumberedCards: boolean = false,
    listIconSvgCode?: string
  ) => {
    const flexBasisClasses: Record<number, string> = {
      2: 'w-full md:w-[calc(50%-0.5px)]',
      3: 'w-full md:w-[calc(50%-0.5px)] lg:w-[calc(33.333%-0.667px)]',
      4: 'w-full md:w-[calc(50%-0.5px)] lg:w-[calc(25%-0.75px)]',
    }
    const flexBasis = flexBasisClasses[columns]

    const cardContent = (
      <CardItemMain
        item={item}
        isNumberedCards={isNumberedCards}
        isSimpleListing={isSimpleListing}
        listIconSvgCode={listIconSvgCode}
        processSvgCode={processSvgCode}
        textColor={textColor}
        descriptionColor={descriptionColor}
        contentTextColor={contentTextColor}
        numberedCardComponents={numberedCardComponents}
        createSpecialtyCardComponents={createSpecialtyCardComponents}
      />
    )

    const linkUrl = item.link?.url

    return (
      <div
        key={item._key || itemIndex}
        className={`${cardBgColor} ${flexBasis} flex flex-grow flex-col items-start pb-6 pt-0 px-0 min-h-0 min-w-0`}
      >
        {linkUrl ? (
          <Link href={linkUrl} className="block h-full">
            {cardContent}
          </Link>
        ) : (
          cardContent
        )}
      </div>
    )
  }

  // Handle direct JSON array when simpleListingData is true
  if (simpleListingData && customListingItems.length > 0) {
    const listingItems = customListingItems
    const columns = columnCount || 3

    return (
      <div className={`flex flex-col w-full border-t ${borderColor}`}>
        {/* Cards Grid */}
        <div className={`${gridBgColor} flex flex-wrap gap-px`}>
          {listingItems.map((item, itemIndex) =>
            renderCard(item, itemIndex, columns, true, false)
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {customListingItems.map((group, groupIndex) => {
        // Default to 'specialty' if cardType is not set (backward compatibility)
        const isNumberedCards = group.cardType === 'numbered'

        // Original portable text mode
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
            <div className={`${gridBgColor} flex flex-wrap gap-px`}>
              {group.listItems?.map((item, itemIndex) => {
                const columns = group.columnCount || columnCount || 3
                return renderCard(item, itemIndex, columns, false, isNumberedCards, group.listIconSvgCode)
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}

