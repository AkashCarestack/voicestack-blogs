import React from 'react'
import { GetStaticProps } from 'next'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'
import VerticalTestimonialListingv2 from '~/v2/sections/verticalTestimonialSection'
import {
  getAllComparisonValues,
  getComparisonTableData,
} from '~/lib/sanity.queries'
import SimpleHead from '~/components/common/SimpleHead'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import LpHero from '~/v2/sections/LpHero'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import OfferSection from '~/v2/sections/OfferSection'
import CampaignOfferExitIntent from '~/v2/components/common/CampaignOfferExitIntent'
import LpHeader from '~/components/common/LpHeader'
import LpFooterV2 from '~/components/common/LpFooterV2'
import LpDemoLinkProvider from '~/providers/LpDemoLinkProvider'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
// import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'

// Define proper TypeScript interfaces
interface HeroComponentData {
  title?: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  [key: string]: any // For flexibility with dynamic data
}

interface PageData {
  'integrations-hero': {
    componentData: HeroComponentData
  }
  'integrations-grid'?: {
    componentData: any
  }
  [key: string]: any // For other page sections
}

export default function MangoVoiceLPPage({
  pageData,
  region,
  faq,
  // comparisonTableData,
  comparisonLegendData,
}) {
  const comparisonTableComponent = pageData['comparison-table']?.componentData
  const comparisonTableData = comparisonTableComponent?.comparisonTable
  
  // const comparisonTableTitle = pageData['comparison-table']?.componentData
  const comparisonSectionData = {
    strip: comparisonTableComponent?.title,
    header: comparisonTableComponent?.description,
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }

  // Extract integration data from pageData instead of separate query
  // console.log('pageData comparison-hero', pageData['comparison-hero']?.componentData);


  const meetingLink = pageData['comparison-hero']?.componentData?.meetingLink;
  const demoUrl = '/lp/demo' + (meetingLink ? '?meetingLink=' + meetingLink : '');

  return (
    <LpDemoLinkProvider demoLink={demoUrl}>
      {/* <SimpleHead data={pageData?.seo} /> */}
      <LpHeader />
      
      {pageData['comparison-hero']?.componentData && (
        <LpHero
          data={pageData['comparison-hero']?.componentData}
          variant="mango"
        />
      )}

      {pageData['logo-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logo-listing']?.componentData?.blocksListingData}
        />
      )}

      {pageData['how-voicestack-works'] && (
        <GroupedCardsGridSection
          data={pageData['how-voicestack-works']?.componentData}
          noLink={true}
          demoCta={true}
        />
      )}
{comparisonTableData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={comparisonLegendData || []}
          demoCta={true}
        />
      )}

{pageData['offer-section']?.componentData && (
        <OfferSection data={pageData['offer-section']?.componentData} spacingY={true}/>
      )}

      {pageData['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListingv2
          data={
            pageData['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
          demoCta={true}
        />
      )}


      {/* VoiceStack Comparison Cards Section */}
      {pageData['comparison-cards']?.componentData && (
        <ComparisonCardsSection
          data={pageData['comparison-cards']?.componentData}
          colCount={3}
          minimal={true}
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

      <StatisticsSection/>
      
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
          demoOnly={true}
        />
      )}
      
      {/* FAQ Section */}
      {faq && (
        <div>
          <FaqSection faqItems={faq} showContactInfo={false}/>
        </div>
      )}

      <LpFooterV2 data={pageData?.footer?.componentData} />

      <CampaignOfferExitIntent />
    </LpDemoLinkProvider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    
    // phone-system pages don't support 'en-AU' or 'en-GB ' locale
    if (region !== 'en') {
      return {
        notFound: true,
      }
    }
    
    const queries = new Queries('lp', region)
    // Hardcode slug since phone-system pages only support 'en' locale
    const slug = 'mango-voice'

    // Fetch page data for integrations
    const pageData = await queries.getPageData('lp', slug)

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    // Fetch comparison table data
    // const client = getClient()
    // const comparisonTableData = await getComparisonTableData(client, region)
    const comparisonLegendData = (await getAllComparisonValues()) || []

    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData,
        region,
        // comparisonTableData,
        comparisonLegendData,
        faq: faqData,
      },
    }
  } catch (error) {
    console.error('Error fetching integrations page data:', error)
    return {
      notFound: true,
    }
  }
}
