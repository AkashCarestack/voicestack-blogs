import { GetStaticProps } from 'next'
import React, { useState, useEffect } from 'react'

import SimpleHead from '~/components/common/SimpleHead'
import CardsWithTestimonial from '~/components/revamp/components/common/cardsWithTestimonial'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import Queries from '~/components/revamp/queries'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import PricingDemoModal from '~/v2/components/common/PricingDemoModal'
import { useDemoFormData } from '~/providers/BookDemoProvider'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureCategoryGrid from '~/v2/sections/FeatureCategoryGrid'
import FeatureHero from '~/v2/sections/FeatureHero'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'
import { setPricingDemoModalCallback, clearPricingDemoModalCallback } from '~/utils/pricingDemoModal'
import { type LocCategory } from '~/utils/resolveDemoMeetingLink'

// Define TypeScript interfaces
interface PageData {
  [key: string]: any
}

interface PricingProps {
  features: any
  landingPageData: any
  faq: any
  pricingPageData: any
}

export default function Pricing({
  features,
  landingPageData,
  faq,
  pricingPageData,
  region,
}: PricingProps & { region?: string }) {
  // Get form data from context
  const { formData } = useDemoFormData()
  
  // Manage pricing demo modal state directly
  const [isPricingDemoModalOpen, setIsPricingDemoModalOpen] = useState(false)
  const [selectedPracticeType, setSelectedPracticeType] = useState<string | null>(null)
  const [initialLoc, setInitialLoc] = useState<LocCategory | undefined>(undefined)

  const openPricingDemoModal = (practiceType: string, loc?: LocCategory) => {
    setSelectedPracticeType(practiceType)
    setInitialLoc(loc)
    setIsPricingDemoModalOpen(true)
  }

  const closePricingDemoModal = () => {
    setIsPricingDemoModalOpen(false)
    setSelectedPracticeType(null)
    setInitialLoc(undefined)
  }

  // Set up callback for PracticeTypeModal to use
  useEffect(() => {
    setPricingDemoModalCallback(openPricingDemoModal)
    return () => {
      clearPricingDemoModalCallback()
    }
  }, [])

  const testimonialData =
    pricingPageData?.['groups-and-dso']?.componentData?.refData
      ?.tabsListingComponent

  if (testimonialData) {
    testimonialData.headline = 'Pricing That Covers Every Touch Point'
    testimonialData.subDescription =
      'VoiceStack is committed to give you more value than you pay for. We provide onboarding, training, account management and customer support services as part of our pricing plans, so that all your teams are fully supported for continuous success.'
    testimonialData.tabs?.map((e: any) => {
      if (e?.ctaListItems?.[0]) {
        e.ctaListItems[0].ctaLink = '/pricing'
        e.ctaListItems[0].ctaText = 'Get Pricing'
      }
    })
  }

  const getPricingFormId = () => {
    const usFormId = 'a28e5858-ce77-4b10-9c4b-4099cc6f1cef'
    return usFormId
  }

  const groupedData = (features || []).reduce((acc: any, feature: any) => {
    const categoryName =
      feature?.featureCategory?.name?.replaceAll(' ', '-') || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push({
      ...feature,
      title: feature?.basicInfo?.title,
      subheading: feature?.basicInfo?.subheading,
      id: feature._id,
      icon: feature?.featureCategory?.iconSvgCode,
    })
    return acc
  }, {})

  // Get category display name (original name without dashes)
  const getCategoryDisplayName = (key: string) => {
    const category = (features || []).find(
      (f: any) => f?.featureCategory?.name?.replaceAll(' ', '-') === key,
    )
    return category?.featureCategory?.name || key.replaceAll('-', ' ')
  }

  return (
    <>
      <SimpleHead data={pricingPageData?.seo} />

      {pricingPageData['pricing-hero']?.componentData && (
        <FeatureHero data={pricingPageData['pricing-hero']} isCentered={true}/>
      )}
      {pricingPageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={
            pricingPageData['logos-listing']?.componentData.blocksListingData
          }
        />
      )}

      <FeatureCategoryGrid
        groupedData={groupedData}
        getCategoryDisplayName={getCategoryDisplayName}
        ctaCard={{
          title: 'Flexible Pricing Models<br/> For Your Practice',
          buttonText: 'Book Free Demo',
          buttonLink: '/demo',
        }}
        // features={features} 
          // sectionHeading={pricingPageData['category-feature-tabs']?.componentData?.sectionHeading}
      />

      <CategoryFeatureTabsSection
        features={
          pricingPageData['manage-every-calls']?.componentData?.refData
            ?.tabsListingComponent
        }
        variant="scrollcarousel"
        sectionHeading={
          pricingPageData['manage-every-calls']?.componentData?.refData
            ?.tabsListingComponent
        }
      />
      {/* {landingPageData['stack-card-tab-testimonial']?.componentData
        ?.refData && (
        <StackCardTestimonial
          isPricingPage={true}
          data={
            landingPageData['stack-card-tab-testimonial']?.componentData
              ?.refData?.tabsListingComponent
          }
        />
      )} */}

      {pricingPageData['stack-card-tab-testimonial']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            pricingPageData['stack-card-tab-testimonial']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial
          data={pricingPageData['stack-card-tab-testimonial']?.componentData}
        />
      )}

      {/* Pricing Demo Modal */}
      {isPricingDemoModalOpen && selectedPracticeType && (
        <PricingDemoModal
          onClose={closePricingDemoModal}
          initialPracticeType={selectedPracticeType}
          initialLoc={initialLoc}
        />
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const features = await getFeaturesList(getClient(), region)
    const companyQueries = new Queries('company', region)
    const pricingPageSlug =
      region === 'en'
        ? 'pricing-page-v2'
        : `pricing-page-v2-${region.toLowerCase()}`
    const pricingPageData = await companyQueries.getPageData(
      'company',
      pricingPageSlug,
    )

    if(!pricingPageData){
      return {
        notFound: true
      }
    }

    return {
      props: {
        region,
        features,
        pricingPageData: JSON.parse(JSON.stringify(pricingPageData ?? null)),
      },
    }
  } catch (error) {
    console.error('Error fetching Pricing page data:', error)
    return {
      props: {
        features: [],
        region: locale || 'en',
        pricingPageData: null,
      },
    }
  }
}
