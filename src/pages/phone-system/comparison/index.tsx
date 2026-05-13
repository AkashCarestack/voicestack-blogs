import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import FeaturesSectionWithNavigation from '~/components/FeaturesSectionWithNavigation'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'
import {
  getAllComparisonValues,
  getComparisonTableData,
} from '~/lib/sanity.queries'
import { getClient } from '~/lib/sanity.client'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import SimpleHead from '~/components/common/SimpleHead'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import LogoListingSection from '~/components/LogoListingSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import { useRouter } from 'next/router'
import CampaignOfferModal from '~/v2/components/common/CampaignOfferModal'
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

export default function ComparisonPage({
  pageData,
  region,
  faq,
  // comparisonTableData,
  comparisonLegendData,
}) {
  const router = useRouter()
  const [showCampaignOfferModal, setShowCampaignOfferModal] = React.useState(false)

  const comparisonTableComponent = pageData['comparison-table']?.componentData
  const comparisonTableData = comparisonTableComponent?.comparisonTable
  
  // const comparisonTableTitle = pageData['comparison-table']?.componentData
  const comparisonSectionData = {
    strip: comparisonTableComponent?.title,
    header: comparisonTableComponent?.description,
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }

  React.useEffect(() => {
    if (!router.isReady) return

    const queryString = router.asPath.includes('?')
      ? router.asPath.split('?')[1].split('#')[0]
      : ''
    const params = new URLSearchParams(queryString)
    const hasUtmParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content']
      .some((key) => Boolean(params.get(key)))

    const utmContent = params.get('utm_content')?.toLowerCase() || ''
    const isMangoCampaign = utmContent.includes('mango')

    setShowCampaignOfferModal(hasUtmParams && isMangoCampaign)
  }, [router.isReady, router.asPath])

  // Extract integration data from pageData instead of separate query
// console.log('pageData cchild', pageData);

  return (
    <>
      <SimpleHead data={pageData?.seo} />
      {/* <HeroWrapper> */}
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        {pageData['comparison-hero']?.componentData && (
          <FeatureHero
            data={pageData['comparison-hero']?.componentData}
            // showFullDescription={true}
          />
        )}
      {/* </HeroWrapper> */}

      
      {pageData['logo-listing']?.componentData && (
          <LogoListingV2
            data={pageData['logo-listing']?.componentData?.blocksListingData}
          />
        )}

      {comparisonTableData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={comparisonLegendData || []}
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
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsGrid data={pageData['integrations-listing']?.componentData}/>
      )}

      <StatisticsSection/>
{/*       
      {pageData['logo-listing']?.componentData && (
          <LogoListingSection
            data={pageData['logo-listing']?.componentData?.blocksListingData}
            header={false}
          />
        )} */}
      
      {/* FAQ Section */}
      {faq && (
        <div>
          <FaqSection faqItems={faq} />
        </div>
      )}

      {showCampaignOfferModal && (
        <CampaignOfferModal onClose={() => setShowCampaignOfferModal(false)} />
      )}
    </>
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
    
    const queries = new Queries('comparison', region)
    // Hardcode slug since phone-system pages only support 'en' locale
    const slug = 'comparison'

    // Fetch page data for integrations
    const pageData = await queries.getPageData('dentalPhones', slug)

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
