import React from 'react'
import Container from '~/components/structure/Container'
import Link from 'next/link'
import SectionHeaderV2 from '~/components/revamp/components/common/sectionHeaderV2'
import Section from '~/components/structure/Section'
import CardItemComponent from '~/v2/components/common/CardItem'
import { CardItemProps as CardItem } from '~/v2/components/common/CardItem'

interface CardsGridSectionProps {
  type?: 'col-2' | 'col-3'
  data?: {
    heading?: string
    sectionHeadingDynamic?: string
    description?: string
    items?: CardItem[]
    useReference?: boolean
    blocksListingData?: {
      _type: string
      _id?: string
      [key: string]: any
    }
    ctaListItems?: Array<{
      ctaLink?: string
      ctaText?: string
      ctaType?: string
    }>
  }
  customText?: string
  variant?: 'V1' | 'V2'
  bottomSpace?: boolean
}

const CardsGridSection = ({ data, customText, type, variant, bottomSpace }: CardsGridSectionProps) => {
  
  // Handle referenced data if useReference is true
  const useReferenceData = data?.useReference && data?.blocksListingData
  const displayData = useReferenceData ? data.blocksListingData : data
  
  // Use data from props or fallback to defaults
  const heading = displayData?.heading || 'section header'
  const sectionHeadingDynamic = displayData?.sectionHeadingDynamic || 'section heading dynamic'
  const description = displayData?.description || 'section description'
  const ctaListItems = displayData?.ctaListItems || []
  const items = displayData?.items || []

  console.log(items,'items CardsGridSection');

  
  if (!data) return null;
  const sectionBorderColor = 'bg-gray-200'
  // Determine grid and border classes based on type for V2 variant
  const gridClasses = type === 'col-2' 
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  
  // const borderClasses = type === 'col-2'
  //   ? 'border-t md:border-r md:[&:nth-child(2n)]:border-r-0'
  //   : 'border-t md:border-r md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0'

  return (
    variant === 'V2' &&  (
      <Section className='bg-[#ffffff]' border="b">
        <Container className='w-full pt-sm md:pt-md lg:pt-lg' type="V2" border="y-0">
          <div className="flex-col relative w-full flex gap-16">
            <SectionHeaderV2 className='xl:px-12 md:px-6 px-4'
              heading={sectionHeadingDynamic}
              description={description}
              ctaListItems={ctaListItems}
            />

            <div className="relative z-10 w-full flex flex-col gap-12 flex-grow">
              <div className={`grid ${sectionBorderColor} gap-px pt-px ${gridClasses}`}>
                {items.map((item) => {
                  return (
                    <div key={item._key || Math.random()} className="bg-white">
                      {item.link?.url ? (
                        <Link href={item.link.url} className="block h-full">
                          <CardItemComponent item={item} />
                        </Link>
                      ) : (
                        <CardItemComponent item={item} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {bottomSpace && <div className="spacer h-16 border-t border-gray-200"></div>}
        </Container>
      </Section>
    ) 
  )
}

export default CardsGridSection
