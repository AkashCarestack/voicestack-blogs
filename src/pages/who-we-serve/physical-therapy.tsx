import { GetStaticProps } from 'next'
import React from 'react'

import SimpleHead from '~/components/common/SimpleHead'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'

interface Feature {
  _id: string
  title: string
  slug: {
    current: string
  }
  language: string
  order?: number
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: any
  mainImage?: any
  shortDescription?: any
  featureCategory?: {
    name: string
    description?: string
    icon?: any
  }
}

interface PhysicalTherapyProps {
  pageData: any
  faq: any
  features: Feature[]
}

export default function PhysicalTherapy({ pageData, faq, features }: PhysicalTherapyProps) {
  if (!pageData) {
    return null
  }

  return (
    <>
      <SimpleHead
        data={pageData?.seo}
      />
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {pageData['physical-therapy-hero']?.componentData && (
        <FeatureHero data={pageData['physical-therapy-hero']} type="feature" />
      )}
      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['card-with-image'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image']?.genericListingComponent}
        />
      )}
      {pageData['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
         
        />
      )}
      <CategoryFeatureTabsSection
          features={features} 
          variant="carousel"
          sectionHeading={pageData['category-feature-tabs']?.componentData?.sectionHeading}
      />
      {/* {pageData['card-with-image2'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image2']?.genericListingComponent}
        />
      )} */}
        {pageData['card-with-image3'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image3']?.genericListingComponent}
        />
      )}
      <StatisticsSection />
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}


      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)
    const slug = region === 'en' ? 'physical-therapy' : `physical-therapy-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    const features = await getFeaturesList(getClient(), region)

    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
      return {
        notFound: true,
      }
    }
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData,
        features: features || [],
      },
    }
  } catch (error) {
    console.error('Error fetching physical therapy page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
        features: [],
      },
    }
  }
}
