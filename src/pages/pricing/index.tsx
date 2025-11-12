import React from 'react'
import { GetStaticProps } from 'next'
import Queries from '~/components/revamp/queries'
import { getFeaturesList } from '~/lib/sanity.queries'
import { getClient } from '~/lib/sanity.client'
import Button from '~/components/common/Button'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'

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

export default function Pricing({ features, landingPageData, faq, pricingPageData }: PricingProps) {
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

  const TickIcon = () => {
    return (
      <span className="mt-[6px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.3631 3.32223C13.4259 3.36993 13.4787 3.42956 13.5185 3.49769C13.5583 3.56583 13.5842 3.64114 13.5948 3.71931C13.6055 3.79748 13.6006 3.87698 13.5804 3.95325C13.5603 4.02953 13.5253 4.10109 13.4775 4.16383L7.07749 12.5638C7.02558 12.6319 6.95971 12.688 6.8843 12.7285C6.8089 12.769 6.72571 12.7929 6.64031 12.7986C6.55492 12.8042 6.46929 12.7916 6.38919 12.7615C6.30909 12.7313 6.23636 12.6844 6.17589 12.6238L2.57589 9.02383C2.46991 8.91009 2.41221 8.75965 2.41495 8.60421C2.41769 8.44877 2.48066 8.30046 2.59059 8.19053C2.70052 8.0806 2.84883 8.01763 3.00427 8.01489C3.15971 8.01215 3.31015 8.06985 3.42389 8.17583L6.53909 11.2902L12.5231 3.43663C12.6194 3.31019 12.7619 3.22713 12.9194 3.20569C13.0769 3.18424 13.2365 3.22615 13.3631 3.32223Z"
            fill="#030712"
          />
        </svg>
      </span>
    )
  }

  return (
    <>
      <div
        className="pt-lg pb-md vs-minimal-bg"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        {pricingPageData && (() => {
          // Find the hero section - try common patterns
          const heroKey = Object.keys(pricingPageData).find(
            (key) => key.includes('hero') && pricingPageData[key]?.componentData
          )
          const heroData = heroKey ? pricingPageData[heroKey]?.componentData : null
          
          return heroData ? (
            <HeroSection
              page=""
              isCentered={true}
              data={heroData}
            />
          ) : null
        })()}
      </div>
    <Section className="md:py-12 py-6">
      <Container className="flex flex-col items-center gap-8">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6 justify-center md:py-32 py-6">
          {Object.entries(groupedData).map(
            ([categoryKey, categoryFeatures]: [string, any]) => {
              const categoryName = getCategoryDisplayName(categoryKey)
              const categoryIcon = categoryFeatures[0].icon
              return (
                <div
                  key={categoryKey}
                  className="bg-[#F4F3FA] w-full h-full md:p-8 p-6  md:rounded-[24px] rounded-[12px] flex flex-col"
                >
                    <div
                  className="w-fit md:mb-6 mb-4 bg-[#E0DDFF] md:px-6 px-4 md:py-3 py-2 rounded-full"
                  dangerouslySetInnerHTML={{ __html: categoryIcon }}
                />
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-950 pb-4">
                    {categoryName}
                  </h3>

               
                    {categoryFeatures.map((feature: any) => (
                      <div key={feature.id} className='flex md:py-2 py-1 items-start md:gap-3 gap-2 border-b-[#E6E7E8] last:border-b-0 border-b'>
                        <TickIcon/> <h4 className="font-geist md:text-base text-xs  leading-[150%] text-gray-900">
                          {feature.title}
                        </h4>
                      </div>
                    ))}
                  </div>
               
              )
            },
          )}
          {/* CTA Card */}
          <div className={` bg-vs-blue backdrop-blur-sm md:rounded-3xl md:h-full h-[241px] rounded-xl py-6 md:px-12 px-6 flex flex-col justify-center items-center md:gap-6 gap-4  hover:bg-vs-blue transition-all`}>
                    <h3 className='md:text-xl text-lg font-bold text-white font-manrope text-center'>Curious if Voicestack Fits Your Practice</h3>
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
        </div>
        {landingPageData?.['stack-card-tab-testimonial']?.componentData && (
          <StackCardTestimonial
            data={landingPageData['stack-card-tab-testimonial']?.componentData}
          />
        )}
        {/* FAQ Section */}
        {faq && <FaqSection faqItems={faq} />}
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
    const pricingPageSlug = region === 'en' ? 'pricing-page' : `pricing-page-${region.toLowerCase()}`
    const pricingPageData = await companyQueries.getPageData('company', pricingPageSlug)

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
