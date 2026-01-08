import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import VerticalTestimonialListing from '~/v2/sections/verticalTestimonialSection'

interface VisionGroupsMSOProps {
  pageData: any
  faq: any
  region: string
}

export default function VisionGroupsMSO({
  pageData,
  faq,
  region,
}: VisionGroupsMSOProps) {
  return (
    <>
    <SimpleHead data={pageData?.seo} />
      <FeatureHero data={pageData['dso-hero']?.componentData} type="feature" />
      <div>
        {pageData['logo-listing']?.componentData && (
          <LogoListingV2
            data={pageData['logo-listing']?.componentData.blocksListingData}
          />
        )}
        {pageData['testimonial-video-section']?.componentData?.refData
          ?.testimonialListing && (
          <VerticalTestimonialListing
            data={
              pageData['testimonial-video-section']?.componentData?.refData
                ?.testimonialListing
            }
          />
        )}
        {/* {pageData['stack-card-tab-testimonial']?.componentData?.refData ? (
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
        )} */}
        {pageData['card-with-image'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image']?.genericListingComponent}
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
            pageData['manage-every-calls']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)
    const slug =
      region === 'en'
        ? 'vision-groups-mso'
        : `vision-groups-mso-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)

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
    console.error(
      'Error fetching Dental Service Organizations DSO page:',
      error,
    )
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}
