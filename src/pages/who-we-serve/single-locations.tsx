import { GetStaticProps } from 'next'
import React from 'react'

import SimpleHead from '~/components/common/SimpleHead'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import SwitchableTabsV2 from '~/v2/sections/SwitchableTabsV2'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import VerticalTestimonialListingv2 from '~/v2/sections/verticalTestimonialSection'

interface IndependentPracticesProps {
  pageData: any
  faq: any
  region: string
  features: any[]
}

export default function IndependentPractices({
  pageData,
  faq,
  region,
  features,
}: IndependentPracticesProps) {
  const tabsListingData =
    pageData?.['manage-every-calls']?.componentData?.refData
      ?.tabsListingComponent
  const tabsListingComponentData =
    pageData['smarter-systems']?.componentData?.refData?.tabsListingComponent

  return pageData?.slug?.includes('v2') ? (
    <>
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      <FeatureHero data={pageData['single-locations-hero']} type="feature" />
      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}
      {tabsListingComponentData && (
        <SwitchableTabsV2 data={tabsListingComponentData} />
      )}
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
          pageData['manage-every-calls']?.componentData?.refData?.tabsListingComponent
        }
      />
    </>
  ) : (
    <>
      <SimpleHead data={pageData?.seo} />

      <HeroWrapper>
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        <HeroSection data={pageData['dental-phones-hero']?.componentData} />
      </HeroWrapper>

      {tabsListingComponentData && (
        <SingleTabCardListing data={tabsListingComponentData} />
      )}

      {pageData['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        />
      )}
      <div className="md:pb-16 pb-8">
        <StatisticsSection />
      </div>
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
      {pageData['custom']?.componentData && (
        <div className="">
          <IntegrationsGrid data={pageData['custom']?.componentData} />
        </div>
      )}
      {/* {console.log(pageData?.['groups-and-dso']?.componentData, 'groups-and-dso')} */}
      {tabsListingData && <TabCardsListing data={tabsListingData} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)

    // const slug =
    //   region === 'en'
    //     ? 'single-locations'
    //     : `single-locations-${region.toLowerCase()}`
    const slug =
      region === 'en'
        ? 'single-locations-v2'
        : `single-locations-v2-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    pageData.slug = slug
    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
    }
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null
    const features = await getFeaturesList(getClient(), region)

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData,
        features: features || [],
      },
    }
  } catch (error) {
    console.error('Error fetching Single Locations page:', error)
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
