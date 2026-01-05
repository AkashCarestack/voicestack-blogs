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
import SwitchableTabsV2 from '~/v2/components/SwitchableTabsV2'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import VerticalTestimonialListingv2 from '~/v2/sections/verticalTestimonialSection'

interface MobilePracticesProps {
  pageData: any
  faq: any
}

export default function MobilePractices({ pageData, faq }: MobilePracticesProps) {
  if (!pageData) {
    return null
  }

  // tabsListingData["mobile-practices"]
  const tabsListingData = pageData?.['mobile-practices']?.componentData?.refData?.tabsListingComponent
  const tabsListingComponentData =
  pageData['smarter-systems']?.componentData?.refData?.tabsListingComponent
  
  return (
    pageData?.slug?.includes('v2') ? (
      <>
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      <FeatureHero data={pageData['mobile-practices-hero']} type="feature" />
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
          pageData['manage-every-calls']?.componentData?.refData?.tabsListingComponent
        }
      />
      </>
    )
    : (
    <>
      <SimpleHead data={pageData?.seo} />
       
      <HeroWrapper>
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        <HeroSection
          page=""
          data={pageData?.['dental-phones-hero']?.componentData}
        />
      </HeroWrapper>
      {pageData?.['trusted-business-communications']?.componentData?.refData?.tabsListingComponent &&
        <SingleTabCardListing data={pageData?.['trusted-business-communications']?.componentData?.refData?.tabsListingComponent}/>
      }
      {pageData?.['testimonial-video-section']?.componentData && (
        <VerticalTestimonialListing
          data={pageData['testimonial-video-section']?.componentData?.refData?.testimonialListing}
        />
      )}
          <StatisticsSection />
          {pageData?.['stack-card-tab-testimonial']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            pageData['stack-card-tab-testimonial']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial
          data={pageData?.['stack-card-tab-testimonial']?.componentData}
        />
      )}
       {pageData?.['integrations-listing']?.componentData && (
        <div className="mt-12">
          <IntegrationsGrid data={pageData['integrations-listing']?.componentData} />
        </div>
      )}

    {
        tabsListingData && (<TabCardsListing data={tabsListingData} />)
      }
      
       {/* FAQ Section */}
       {faq && (
         <div>
           <FaqSection faqItems={faq} />
         </div>
       )}
    </>)
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)

    const slug =
      region === 'en'
        ? 'mobile-practices-v2'
        : `mobile-practices-v2-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    pageData.slug = slug
    if(!pageData){
      console.error(`pageData not found for ${slug}`)
    }
    const faqData = pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData
      },
    }
  } catch (error) {
    console.error('Error fetching Mobile Practices page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null
      },
    }
  }
}