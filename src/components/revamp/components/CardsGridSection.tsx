import React, { useContext, useState } from 'react'
import Button from '~/components/common/Button'
import { FormModal } from '~/components/common/FormModal'
import Container from '~/components/structure/Container'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import SectionHeader from './common/sectionHeader'
import Image from 'next/image'
import WorldMap from 'public/assets/world-map.png'
import { urlForImage } from '~/lib/sanity.image'
import Link from 'next/link'

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
}

interface CardsGridSectionProps {
  data?: {
    heading?: string
    description?: string
    items?: CardItem[]
  }
}

const CardsGridSection = ({ data }: CardsGridSectionProps) => {
  const [openForm, setOpenForm] = useState(false)
  const { isDemoPopUpShown } = useContext(BookDemoContext);
  
  // Use data from props or fallback to defaults
  const heading = data?.heading || 'section header'
  const description = data?.description || 'section description'
  const items = data?.items || []

  return (
    <div className='w-full px-4 xl:px-12 bg-[#F9F9F9]'>
      <div className={`rounded-[24px] justify-center relative`}>
        <Container className='w-full lg:py-24 py-16 px-6'>
          <div className="relative w-full flex gap-16">
            {/* Main Content */}
            <div className="relative z-10 w-full flex flex-col gap-12 flex-grow">
             
              <SectionHeader
                heading={heading}
                description={description}
              />
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((item) => (
                  <div 
                    key={item._key || Math.random()} 
                    className="bg-[#F4F3FA] backdrop-blur-sm rounded-2xl p-6 flex flex-col gap-4 hover:bg-[#F4F3FA] transition-all"
                  >
                    {/* Icon/Image */}
                    {item.dynamicSvg ? (
                      <div 
                        className="w-12 h-12 flex items-center justify-center"
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
                        <h3 className="text-xl font-bold text-gray-950">
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

                    {/* Link */}
                    {item.link?.url && item.link?.text && (
                      <Link 
                        href={item.link.url}
                        className="text-white font-medium text-sm hover:underline mt-auto"
                      >
                        {item.link.text}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            
              
              <div className="flex justify-center md:justify-start">
                <Button
                  type="primary"
                  className="w-fit"
                  onClick={() => {
                    setOpenForm(true)
                  }}
                >
                  <span>
                    {'Book Free Demo'}
                  </span>
                </Button>
              </div>
            </div>

          </div>
          {openForm && (
            <FormModal
              className={`pt-9  flex items-start`}
              onClose={() => setOpenForm(false)}
              data={isDemoPopUpShown}
            />
          )}
        </Container>
        
      </div>
    </div>
  )
}

export default CardsGridSection
