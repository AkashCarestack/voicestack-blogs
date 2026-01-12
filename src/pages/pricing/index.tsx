import { GetStaticProps } from 'next'
import React from 'react'

import SimpleHead from '~/components/common/SimpleHead'
import CardsWithTestimonial from '~/components/revamp/components/common/cardsWithTestimonial'
import FeatureCategoryGrid from '~/components/revamp/components/common/FeatureCategoryGrid/FeatureCategoryGrid'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import Queries from '~/components/revamp/queries'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'

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
  const testimonialData = pricingPageData?.["groups-and-dso"]?.componentData?.refData?.tabsListingComponent;
  
  if (testimonialData) {
    testimonialData.headline = "Pricing That Covers Every Touch Point";
    testimonialData.subDescription ="VoiceStack is committed to give you more value than you pay for. We provide onboarding, training, account management and customer support services as part of our pricing plans, so that all your teams are fully supported for continuous success.";
    testimonialData.tabs?.map((e:any)=>{
      if (e?.ctaListItems?.[0]) {
        e.ctaListItems[0].ctaLink = "/pricing";
        e.ctaListItems[0].ctaText = "Get Pricing";
      }
    })
  }
 
  const getPricingFormId = () => {
    const usFormId = 'a28e5858-ce77-4b10-9c4b-4099cc6f1cef'    
    return usFormId
  }

  const groupedData = features.reduce((acc: any, feature: any) => {
    const categoryName =
      feature?.featureCategory?.name?.replaceAll(' ', '-') || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push({
      title: feature?.basicInfo?.title,
      id: feature._id,
      icon: feature?.featureCategory?.iconSvgCode,
      ...feature,
    })
    return acc
  }, {})

  // Get category display name (original name without dashes)
  const getCategoryDisplayName = (key: string) => {
    const category = features.find(
      (f: any) => f?.featureCategory?.name?.replaceAll(' ', '-') === key,
    )
    return category?.featureCategory?.name || key.replaceAll('-', ' ')
  }
  console.log("landingPageData===",pricingPageData)
  return (
    <>
      <SimpleHead data={pricingPageData?.seo} />

      <FeatureHero data={pricingPageData['pricing-hero']} />
      
      <Section className="bg-white" border="b">
        <Container className="flex flex-col items-center gap-8" type="V2" border="y-0">
          <div className="lg:py-lg md:py-md py-sm">
            <FeatureCategoryGrid
              groupedData={groupedData}
              getCategoryDisplayName={getCategoryDisplayName}
              ctaCard={{
                title: 'Flexible Pricing Models<br/> For Your Practice',
                buttonText: 'Get Pricing',
                buttonLink: '/demo',
              }}
            />
          </div>
          {/* {
            testimonialData && (<TabCardsListing data={testimonialData} />)
          } */}

          
          {/* FAQ Section */}
          {/* {faq && <FaqSection faqItems={faq} />} */}
        </Container>
      </Section>
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
      {landingPageData['stack-card-tab-testimonial']?.componentData?.refData && (
            
            <StackCardTestimonial
              isPricingPage={true}
              data={
                landingPageData['stack-card-tab-testimonial']?.componentData?.refData
                  ?.tabsListingComponent
              }
            />
          )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const slug =
      region === 'en'
        ? 'feature-landing-page'
        : `feature-landing-page-${region.toLowerCase()}`
    const queries = new Queries('feature-landing', region)
    const landingPageData = await queries.getPageData('featurePage', slug)
    const features = await getFeaturesList(getClient(), region)
    const faq = await queries.getFaqBySlug('pricing', region)

    // Fetch company page data for pricing page hero section
    const companyQueries = new Queries('company', region)
    const pricingPageSlug =
      region === 'en' ? 'pricing-page-v2' : `pricing-page-v2-${region.toLowerCase()}`
    const pricingPageData = await companyQueries.getPageData(
      'company',
      pricingPageSlug,
    )

    return {
      props: {
        slug,
        region,
        features,
        landingPageData,
        faq: faq || null,
        pricingPageData: JSON.parse(JSON.stringify(pricingPageData ?? null))
      },
    }
  } catch (error) {
    console.error('Error fetching Pricing page data:', error)
    return {
      props: {
        features: {},
        slug: '',
        region: locale || 'en',
        landingPageData: null,
        faq: null,
        pricingPageData: null,
      },
    }
  }
}
