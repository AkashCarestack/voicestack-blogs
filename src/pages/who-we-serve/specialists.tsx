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
import SingleCardWithList from '~/components/revamp/components/common/TabListing/singleCardWithList'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'
import SwitchableTabsV2 from '~/v2/components/SwitchableTabsV2'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import VerticalTestimonialListingv2 from '~/v2/sections/verticalTestimonialSection'

interface SpecialityPracticesProps {
  pageData: any
  faq: any
}

export default function SpecialityPractices({
  pageData,
  faq,
}: SpecialityPracticesProps) {
  const tabsListingComponentData = pageData?.['smarter-system']?.componentData?.refData?.tabsListingComponent;
  const tablistingData = pageData?.['single-card']?.componentData;

  return pageData?.slug?.includes('v2') ? 
  <>
     <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      <FeatureHero data={pageData['specialists-hero']} type="feature" />
      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}
   <CategoryFeatureTabsSection
          features={pageData['single-card']?.componentData}
          variant="scrollcarousel"
          sectionHeading={pageData['single-card']?.componentData?.sectionHeading}
          singleCard={true}
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
      <StatisticsSection variant="V2" />
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
          pageData['manage-every-calls']?.componentData
        }
      />
  </>
  :(
    <>
      <SimpleHead data={pageData?.seo} />

      <HeroWrapper>
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        <HeroSection
          page=""
          data={pageData['dental-phones-hero']?.componentData}
        />
      </HeroWrapper>
      
      {pageData?.['effortlessly-handle-calls']?.componentData && (
        <SingleCardWithList
          data={pageData?.['effortlessly-handle-calls']?.componentData}
        />
      )}
      {pageData['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        />
      )}
      <StatisticsSection />
      {pageData['stack-card-tab-testimonial']?.componentData && (
        pageData['stack-card-tab-testimonial']?.componentData?.refData ? (
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
        )
      )}
      {pageData['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid
            data={pageData['integrations-listing']?.componentData}
          />
        </div>
      )}
      {pageData?.['specialists']?.componentData && (
        <TabCardsListing
          data={pageData?.['specialists']?.componentData}
        />
      )}
       {pageData?.['specialty-practices']?.componentData && (
        <TabCardsListing data={pageData?.['specialty-practices']?.componentData} />
      )}

      {/* FAQ Section */}
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
        ? 'specialists-v2'
        : `specialists-v2-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    pageData.slug = slug
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
      },
    }
  } catch (error) {
    console.error('Error fetching Speciality Practices page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}
