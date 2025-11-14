import React from 'react'
import { GetStaticProps } from 'next'
import Queries from '~/components/revamp/queries'
import { getFeaturesList } from '~/lib/sanity.queries'
import { getClient } from '~/lib/sanity.client'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import FeatureCategoryGrid from '~/components/revamp/components/common/FeatureCategoryGrid/FeatureCategoryGrid'

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
  // Get pricing form ID based on locale
  const getPricingFormId = () => {
    // Hardcoded US form ID
    const usFormId = 'a28e5858-ce77-4b10-9c4b-4099cc6f1cef'
    
    // Future: add locale-based form IDs
    // if (region === 'au') return 'au-form-id'
    // if (region === 'uk') return 'uk-form-id'
    
    return usFormId
  }

  const groupedData = features.reduce((acc: any, feature: any) => {
    const categoryName =
      feature?.featureCategory?.name?.replaceAll(' ', '-') || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push({
      title: feature.title,
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
console.log(landingPageData, 'landingPageData in pricing page')
  return (
    <>
      <div
        className="pt-lg pb-md vs-minimal-bg"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        {pricingPageData &&
          (() => {
            // Find the hero section - try common patterns
            const heroKey = Object.keys(pricingPageData).find(
              (key) =>
                key.includes('hero') && pricingPageData[key]?.componentData,
            )
            const heroData = heroKey
              ? pricingPageData[heroKey]?.componentData
              : null

            return heroData ? (
              <HeroSection 
                page="pricing" 
                isCentered={true} 
                data={heroData}
                pricingFormId={getPricingFormId()}
              />
            ) : null
          })()}
      </div>
      <Section className="md:py-12 py-6">
        <Container className="flex flex-col items-center gap-8">
          <div className="md:py-32 py-6">
            <FeatureCategoryGrid
              groupedData={groupedData}
              getCategoryDisplayName={getCategoryDisplayName}
              ctaCard={{
                title: 'Curious if Voicestack Fits Your Practice',
                buttonText: 'Book Free Demo',
                buttonLink: '/demo',
              }}
            />
          </div>

          {landingPageData['stack-card-tab-testimonial']?.componentData?.refData ? (
            <StackCardTestimonial
              data={
                landingPageData['stack-card-tab-testimonial']?.componentData?.refData
                  ?.tabsListingComponent
              }
            />
          ) : (
            <StackCardTestimonial
              data={landingPageData['stack-card-tab-testimonial']?.componentData}
            />
          )}
          {/* FAQ Section */}
          {/* {faq && <FaqSection faqItems={faq} />} */}
        </Container>
      </Section>
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
      region === 'en' ? 'pricing-page' : `pricing-page-${region.toLowerCase()}`
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
        pricingPageData: pricingPageData || null,
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
