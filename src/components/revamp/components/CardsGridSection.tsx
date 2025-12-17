import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import SectionHeader from './common/sectionHeader'
import Image from 'next/image'
import Link from 'next/link'
import SectionHeaderV2 from './common/sectionHeaderV2'
import Section from '~/components/structure/Section'

interface CardItem {
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
}

interface CardsGridSectionProps {
  type?: 'two-col' | 'three-col'
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
  }
  customText?: string
}

const CardsGridSection = ({ data, customText, type }: CardsGridSectionProps) => {
  
  // Handle referenced data if useReference is true
  const useReferenceData = data?.useReference && data?.blocksListingData
  const displayData = useReferenceData ? data.blocksListingData : data
  
  // Use data from props or fallback to defaults
  const heading = displayData?.heading || 'section header'
  const sectionHeadingDynamic = displayData?.sectionHeadingDynamic || 'section heading dynamic'
  const description = displayData?.description || 'section description'
  const items = displayData?.items || []

  console.log('data noref', data);
  console.log('type', type);
  
  if (!data) return null;

  return (

    type === 'two-col' ? (
      <Section className='bg-[#ffffff]' border="b">
        <Container className='w-full py-sm md:py-md lg:py-lg' type="V2" border="y-0" innerPadding>
          <div className="flex-col relative w-full flex gap-16">
            <SectionHeaderV2 className='xl:px-12 md:px-6 px-4'
              heading={sectionHeadingDynamic}
              description={description}
            />

            <div>
              test content for col-2
            </div>
          </div>
        </Container>
      </Section>
    ) : type === 'three-col' ? (
      <Section className='bg-[#ffffff]' border="y">
        <Container className='w-full pt-sm md:pt-md lg:pt-lg' type="V2" border="y-0">
          <div className="flex-col relative w-full flex gap-16">
            <SectionHeaderV2 className='xl:px-12 md:px-6 px-4'
              heading={sectionHeadingDynamic}
              description={description}
            />

            <div className="relative z-10 w-full flex flex-col gap-12 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                {items.map((item) => {
                  const CardContent = (
                    <div className="h-full col-span-2 p-12 flex flex-col gap-6 justify-between transition-all group">
                      <div className="flex flex-col gap-4">

                        {/* Icon/Image */}
                        {item.dynamicSvg && (
                          <div 
                            className="flex items-center justify-center self-start "
                            dangerouslySetInnerHTML={{ __html: item.dynamicSvg }}
                          />
                        )}

                        {/* Content */}
                        <div className="flex flex-col gap-2">
                          {item.heading && (
                            <h3 className="md:text-xl text-lg font-bold text-gray-950 font-manrope">
                              {item.heading}
                            </h3>
                          )}
                          {item.subheading && (
                            <p className="text-sm font-medium text-gray-700">
                              {item.subheading}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Link Text */}
                      {item.link?.url && item.link?.text && (
                        <div className="learn-more">
                          {item.link.text}
                        </div>
                      )}
                    </div>
                  )

                  return (
                    <div key={item._key || Math.random()} className="border-t border-r border-b">
                      {item.link?.url ? (
                        <Link href={item.link.url} className="block h-full">
                          {CardContent}
                        </Link>
                      ) : (
                        CardContent
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    ) : (
    <div className='w-full bg-[#F9F9F9]'>
      <div className={`justify-center relative`}>
        <Container className='w-full lg:py-lg md:py-md py-sm'>
          <div className="flex-col relative w-full flex gap-16">
            {/* Main Content */}
            <SectionHeader
              heading={heading}
              description={description}
            />
            {/* <SectionHeaderV2
              heading={displayData?.sectionHeadingDynamic}
              description={description}
            /> */}
            <div className="relative z-10 w-full flex flex-col gap-12 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6">
                {items.map((item) => {
                  const CardContent = (
                    <div className="h-full col-span-2  backdrop-blur-sm md:rounded-3xl rounded-xl p-6 flex flex-col gap-6 justify-between transition-all group bg-[#F4F3FA]">
                      <div className="flex flex-col gap-4">

                        {/* Icon/Image */}
                        {item.dynamicSvg ? (
                          <div 
                            className="py-4 px-6 flex items-center justify-center rounded-full self-start bg-vs-purple-50 group-hover:bg-vs-purple-gradient transition-all [&_svg]:transition-all [&_svg]:duration-300 group-hover:[&_svg]:brightness-0 group-hover:[&_svg]:invert"
                            dangerouslySetInnerHTML={{ __html: item.dynamicSvg }}
                          />
                        ) : item.image?.url ? (
                          <div className="w-12 h-12 relative">
                            <Image
                              src={item.image.url}
                              alt={item.heading || ''}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : null}

                        {/* Content */}
                        <div className="flex flex-col gap-2">
                          {item.heading && (
                            <h3 className="md:text-xl text-lg font-bold text-gray-950 font-manrope">
                              {item.heading}
                            </h3>
                          )}
                          {item.subheading && (
                            <p className="text-sm font-medium text-gray-700">
                              {item.subheading}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Link Text */}
                      {item.link?.url && item.link?.text && (
                        <div className="learn-more">
                          {item.link.text}
                        </div>
                      )}
                    </div>
                  )

                  return (
                    <div key={item._key || Math.random()}>
                      {item.link?.url ? (
                        <Link href={item.link.url} className="block h-full">
                          {CardContent}
                        </Link>
                      ) : (
                        CardContent
                      )}
                    </div>
                  )
                })}
                {items.length % 3 !== 0 && (
                  <div className={`${items.length % 3 === 1 ? 'col-span-2' : ''} bg-vs-blue backdrop-blur-sm md:rounded-3xl rounded-xl py-6 md:px-12 px-6 flex flex-col justify-center items-center md:gap-6 gap-4  hover:bg-vs-blue transition-all`}>
                    <h3 className='text-lg font-bold text-white font-manrope text-center'>Unlock Hidden Opportunities.<br/> Supercharge Practice Growth.<br/><br/> Try VoiceStack today.</h3>
                    <Button
                      type="primary"
                      className="w-fit"
                      link="/demo"
                    >
                      <span>
                        {'Book Free Demo'}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {items.length % 3 === 0 && (
            <div className="flex justify-center">
              <Button
                type="primary"
                className="w-fit"
                link="/demo"
              >
                <span>
                  {'Book Free Demo'}
                </span>
              </Button>
            </div>
            )}
          </div>
          </Container>
        
      </div>
    </div>
    )
  )
}

export default CardsGridSection
