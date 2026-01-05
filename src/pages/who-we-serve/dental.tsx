import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import LogoListingV2 from '~/components/LogoListingV2'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'

interface DentalProps {
  pageData: any
  faq: any
  features: any[]
}

export default function Dental({ pageData, faq, features }: DentalProps) {
  if (!pageData) {
    return null
  }

  return (
    <>
      {/* <div className='!max-w-[1240px] w-full m-auto !px-0'> */}
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {/* </div> */}
      <FeatureHero data={pageData['dental-hero']} type="feature" />

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

      {pageData['stack-card-tab-testimonial']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            pageData['stack-card-tab-testimonial']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial
          data={pageData['stack-card-tab-testimonial']?.componentData}
        />
      )}
      <CategoryFeatureTabsSection
          features={features} 
          variant="carousel"
          sectionHeading={pageData['category-feature-tabs']?.componentData?.sectionHeading}
      />
      {pageData['card-with-image2'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image2']?.genericListingComponent}
        />
      )}
      <StatisticsSection variant="V2" />
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
    const slug = region === 'en' ? 'dental' : `dental-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    const features = await getFeaturesList(getClient(), region)

    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
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
    console.error('Error fetching dental page:', error)
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
