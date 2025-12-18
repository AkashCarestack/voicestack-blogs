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
  className?: string
  data:any
}

const IntegrationsShowcaseSection: React.FC<IntegrationsGridProps> = ({
  className = "",
  data
}) => {

  // Sort integrations by order field (ascending), with items without order at the end
  // Hook must be called before any early returns
  const sortedIntegrations = React.useMemo(() => {
    const integrations = data?.refData?.integrationListing?.integrationList || []
    return [...integrations].sort((a: any, b: any) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
  }, [data])

  // Don't render if no integrations
  if (!data || !sortedIntegrations || sortedIntegrations.length === 0) {
    return null;
  }

  return (
    <Section 
      className={`py-16 md:py-20 lg:py-24 relative overflow-hidden bg-gray-950 ${className}`}
    
    >
      <Container className="flex-col relative z-10">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 items-center relative w-full">
           <SectionHeader showFullLength={true} heading={data.refData.integrationListing.title} description={data.refData.integrationListing.description} />                       
        </div>
      </Container>
    </Section>
  )
}

export default IntegrationsShowcaseSection
