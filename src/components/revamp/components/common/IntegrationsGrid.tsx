import React from 'react'
import Image from 'next/image'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { urlForImage } from '~/lib/sanity.image'
import Button from '~/components/common/Button'
import SectionHeader from './sectionHeader'

interface Integration {
  _id: string
  title: string
  headline?: string
  description?: any
  shortDescription?: string
  image?: {
    asset?: {
      _id: string
      url: string
      altText?: string
    }
  }
  link?: string
  order?: number
  language?: string
  integrationCategory?: {
    _id: string
    name: string
    subheading?: string
    description?: string
    mainImage?: any
    icon?: any
    iconSvgCode?: string
  }
}

interface IntegrationsGridProps {
  title?: string
  description?: string
  integrations?: Integration[]
  showButtons?: boolean
  className?: string
  // New props for CMS control
  customIntegrations?: Integration[]
  data:any
}

const IntegrationsGrid: React.FC<IntegrationsGridProps> = ({

  className = "",
  // New props for CMS control
  data
}) => {
  // Debug logging
  // console.log('IntegrationsGrid received integrations:', integrations)
  // console.log('IntegrationsGrid received customIntegrations:', customIntegrations)
  
  // Use custom integrations if provided, otherwise fall back to props
  // const displayIntegrations = customIntegrations && customIntegrations.length > 0 
  //   ? customIntegrations 
  //   : integrations

  // console.log('IntegrationsGrid displayIntegrations:', displayIntegrations)

  // Don't render if no integrations
  if (!data || data.length === 0) {
    console.log('IntegrationsGrid: No integrations to display')
    return null;
  }

  return (
    <Section 
      className={`py-16 md:py-20 lg:py-24 relative overflow-hidden ${className}`}
      style={{ 
        backgroundImage: 'linear-gradient(90deg, rgba(244, 243, 250, 1) 0%, rgba(244, 243, 250, 1) 100%), linear-gradient(-70.51416480937942deg, rgba(202, 197, 255, 0.2) 0%, rgba(202, 197, 255, 0.5) 49.608%, rgba(202, 197, 255, 0.1) 100.18%)',
        background: 'rgba(244, 243, 250, 1)'
      }}
    >
      <Container className="flex-col relative z-10">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 items-center relative w-full">
                 {/* Title and Description */}
                 {/* <div className="flex flex-col gap-4 items-center text-center max-w-4xl">
                   <h2 className="font-['Manrope',_sans-serif] font-bold text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-tight">
                     {title}
                   </h2>
                   <p className="font-['Geist',_sans-serif] font-normal text-base md:text-lg text-[#364153] leading-relaxed">
                     {description}
                   </p>
                 </div> */}

                 <SectionHeader heading={data.refData.integrationListing.title} description={data.refData.integrationListing.description} />
                 
          {/* Integrations Grid */}
          <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8 justify-center items-end w-full">
            {data.refData.integrationListing.integrationList?.map((integration, index) => (
              <div
                key={integration._id}
                className="flex flex-col items-center justify-end group relative bg-vs-purple-logo-bg rounded-[12px] border-2 border-[#6D62E5]"
              >
                {/* Integration Image */}
                <div className="w-12 h-12 inset-0 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                  {(() => {
                    let imageUrl = integration?.image?.url;
                    if (imageUrl) {
                      return (
                        <Image
                          alt={integration.image.altText} 
                          title={integration.image.title}
                          className="w-full h-full object-contain" 
                          src={imageUrl}
                          width={64}
                          height={64}
                        />
                      );
                    }
                    return null;
                  })()}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bg-[#efeeea] bottom-[-20px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                  <p className="font-['Geist',_sans-serif] font-normal text-xs text-[#52525c]">
                    {integration.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

            {/* {/* {showButtons && ( */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button type="primary">
                <span >
                Book Free Demo
                </span>
              </Button>
              
              <Button type="secondary">
                See All Integrations
              </Button>
            </div>
          {/* )} */}
        </div>
      </Container>
    </Section>
  )
}

export default IntegrationsGrid
