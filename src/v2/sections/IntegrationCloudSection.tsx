import Image from 'next/image'
import React from 'react'

import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { urlForImage } from '~/lib/sanity.image'
import Button from '~/components/common/Button'
import { cn } from '~/lib/utils'
import ImageLoader from '~/components/common/imageLoader/imageLoader'

import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import { GridPattern } from '~/components/ui/grid-pattern'
import TickIcon from '~/components/icons/TickIcon'
import Tick from '~/components/icons/Tick'
import TickSolidIcon from '~/components/icons/TickSolidIcon'

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

const IntegrationCloudSection: React.FC<IntegrationsGridProps> = ({
  className = '',
  data,
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
      className={cn(" relative overflow-hidden bg-gray-50", className)}
    >
      <div className="md:block hidden absolute top-0 right-0  w-[43rem] h-full z-0">
        <GridPattern
            width={50}
            height={50}
            x={-1}
            y={-1}
            className={cn(
              "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]"
            )}
          />
        </div>
      <Container type="V2" className="relative z-10 md:px-6 px-4" border="y-0">
        <div className="relative flex md:flex-row flex-col gap-12 py-16 lg:gap-24 items-center">

          <div className="flex flex-col     md:pl-12">
            <div className="font-geist font-normal text-base text-vs-purple leading-5 tracking-normal uppercase">
            {title}
            </div>
            <h2 className="font-geist py-3 font-medium text-3xl md:text-4xl lg:text-5xl text-gray-950 leading-tight tracking-tight">
              {subtitle}
            </h2>
            <p className="font-geist font-normal text-lg text-gray-500 leading-7 tracking-normal">
              {content}
            </p>
            <div className='flex justify-start md:mt-8 mt-6'>
            <Button
              type="secondary"
              link={link}
            >
              <span>{data.buttonText}</span>
            </Button>
            </div>
          </div>

          {heroImageUrl && (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={heroImageUrl}
                alt={heroImageAlt}
                className=" w-full h-full  object-cover"
                width={722}
                height={722}
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

export default IntegrationCloudSection

