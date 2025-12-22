import React from 'react'
import Image from 'next/image'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { urlForImage } from '~/lib/sanity.image'
import Button from '~/components/common/Button'
import { cn } from '~/lib/utils'
import ImageLoader from '~/components/common/imageLoader/imageLoader'

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
className?: string
  data:any
}

const IntegrationsShowcaseSection: React.FC<IntegrationsGridProps> = ({
  className = "",
  data
}) => {


  // Don't render if no data
  if (!data) {
    return null;
  }

  const integrationListing = data?.refData?.integrationListing
  const customComponent = data
  
  // Get data from customComponent first, fallback to integrationListing
  const title = customComponent?.title || integrationListing?.title || "Integrations"
  const subtitle = customComponent?.subtitle || integrationListing?.subtitle || "Connect with your existing Software"
  const content = customComponent?.content || integrationListing?.description || "Seamless Integrations Syncs appointments and treatment scheduling seamlessly with your existing software. Complete the patient journey from click to booking."
  const link = integrationListing?.link || '/dental-phones/integrations'
  
  const heroImage = customComponent.image
  const heroImageUrl = urlForImage(heroImage)
  const heroImageAlt = heroImage?.altText || title


  return (
    <Section 
      className={cn("md:py-6 py-4 relative overflow-hidden bg-gray-50", className)}
    >
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Purple Header */}
            <div className="font-geist font-normal text-base text-vs-purple leading-5 tracking-normal uppercase">
            {title}
            </div>
            <h2 className="font-geist font-medium text-3xl md:text-4xl lg:text-5xl text-gray-950 leading-tight tracking-tight">
              {subtitle}
            </h2>
            <p className="font-geist font-normal text-base md:text-lg text-gray-700 leading-6 md:leading-7">
              {content}
            </p>
            <Button
              type="secondary"
              link={link}
              className=" text-white bg-vs-purple px-6 py-3 rounded-lg"
            >
              <span>Explore Integrations</span>
            </Button>


          </div>

          {heroImageUrl && (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <ImageLoader
                image={heroImageUrl}
                alt={heroImageAlt}
                className="w-full h-full  object-cover"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

export default IntegrationsShowcaseSection
