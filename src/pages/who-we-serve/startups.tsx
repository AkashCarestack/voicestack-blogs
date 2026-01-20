import React from 'react'
import { GetStaticProps } from 'next'
import Queries from '~/components/revamp/queries'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import VerticalTestimonialListingv2 from '~/v2/sections/verticalTestimonialSection'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import FaqSection from '~/components/revamp/components/common/faqSection'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import SimpleHead from '~/components/common/SimpleHead'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import FeatureHero from '~/v2/sections/FeatureHero'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import SwitchableTabsV2 from '~/v2/sections/SwitchableTabsV2'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'

interface StartupPracticesProps {
  pageData: any
  faq: any
}

export default function StartupPractices({
  pageData,
  faq,
}: StartupPracticesProps) {
  const tabsListingComponentData =
  pageData && pageData['smarter-systems'] && pageData['smarter-systems']?.componentData?.refData?.tabsListingComponent
// console.log(pageData, 'pageDat----')

  return pageData?.slug?.includes('v2') ? (
    <>
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {pageData['startup-practices-hero']?.componentData && (
        <FeatureHero data={pageData['startup-practices-hero']} type="feature" />
      )}
      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
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
        {pageData['dental-phones-hero']?.componentData && (
          <HeroSection
            page=""
            data={pageData['dental-phones-hero']?.componentData}
          />
        )}
      </HeroWrapper>
      {/* {tabsListingComponentData &&
        <SingleTabCardListing data={tabsListingComponentData}/>
      } */}
      {pageData['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        />
      )}
      <StatisticsSection />
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
      {pageData['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid
            data={pageData['integrations-listing']?.componentData}
          />
        </div>
      )}
      {pageData?.['startup-practices']?.componentData && (
        <TabCardsListing
          data={pageData?.['startup-practices']?.componentData}
        />
      )}

      {/* {
          tabsListingData && (<TabCardsListing data={tabsListingData} />)
        } */}

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
        ? 'startup-practices-v2'
        : `startup-practices-v2-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
      return {
        notFound: true,
      }
    }
    pageData.slug = slug
    // Ensure FAQ data is serializable
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
    console.error('Error fetching Startup Practices page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}
