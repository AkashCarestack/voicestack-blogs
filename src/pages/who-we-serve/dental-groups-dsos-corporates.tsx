import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import Queries from '~/components/revamp/queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import SwitchableTabsV2 from '~/v2/sections/SwitchableTabsV2'
import VerticalTestimonialListingv2 from '~/v2/sections/verticalTestimonialSection'

interface EnterpriseDsoProps {
  pageData: any
  faq: any
}

export default function EnterpriseDso({ pageData, faq }: EnterpriseDsoProps) {
  const tabsListingData = pageData?.["mobile-practices"]?.componentData?.refData?.tabsListingComponent
  const tabsListingComponentData =
    pageData['smarter-systems']?.componentData?.refData?.tabsListingComponent
 
  return (
    <>
      {pageData?.seo && <SimpleHead data={pageData?.seo} />}
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {pageData['mobile-practices-hero']?.componentData && (
        <FeatureHero data={pageData['mobile-practices-hero']} type="feature" />
      )}
      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}

      <CategoryFeatureTabsSection
        columnCount={4}
        features={
          pageData['grow-your-practice']?.componentData?.refData
            ?.tabsListingComponent
        }
        variant="carouselwithcards"
        sectionHeading={
          pageData['grow-your-practice']?.componentData?.refData
            ?.tabsListingComponent
        }
      />
      {pageData['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
          <VerticalTestimonialListingv2
            data={
              pageData['testimonial-video-section']?.componentData?.refData
                ?.testimonialListing
            }
          />
        )}
      <StatisticsSection />

      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}

      <CategoryFeatureTabsSection
        features={
          pageData['manage-every-calls']?.componentData?.refData
            ?.tabsListingComponent
        }
        variant="scrollcarousel"
        sectionHeading={
          pageData['manage-every-calls']?.componentData?.refData
            ?.tabsListingComponent
        }
      />
      {faq && (
        <div>
          <FaqSection faqItems={faq} />
        </div>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)
    const slug =
      region === 'en'
        ? 'enterprise-dsos'
        : `enterprise-dsos-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)

    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
      return {
        notFound: true
      }
    }
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData,
      },
    }
  } catch (error) {
    console.error('Error fetching groups and DSO page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}
