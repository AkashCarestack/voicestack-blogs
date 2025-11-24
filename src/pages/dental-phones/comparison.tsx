import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import FeaturesSectionWithNavigation from '~/components/FeaturesSectionWithNavigation'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import {
  getAllComparisonValues,
  getComparisonTableData,
} from '~/lib/sanity.queries'
import { getClient } from '~/lib/sanity.client'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import SimpleHead from '~/components/common/SimpleHead'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import LogoListingSection from '~/components/LogoListingSection'

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
  comparisonTableData,
  comparisonLegendData,
}) {
  const comparisonTableTitle = pageData['comparison-table']?.componentData
  const comparisonSectionData = {
    strip: comparisonTableTitle?.heading,
    header: comparisonTableTitle?.description,
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }

  // Extract integration data from pageData instead of separate query

  return (
    <>
      <SimpleHead data={pageData?.seo} />
      <div
         className="bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA] py-12"
         style={{
           background: 'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)'
         }}
       >
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        {pageData['comparison-hero']?.componentData && (
          <HeroSection
            page=""
            data={pageData['comparison-hero']?.componentData}
            showFullDescription={true}
          />
        )}
      </div>

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
        />
      )}

      {/* Testimonial Section */}
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
      <IntegrationsGrid data={pageData['integrations-listing']?.componentData}/>
      <StatisticsSection/>
      {pageData['logo-listing']?.componentData && (
          <LogoListingSection
            data={pageData['logo-listing']?.componentData?.blocksListingData}
            header={false}
          />
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
  try {
    const region = locale || 'en'
    const queries = new Queries('comparison', region)
    const slug =
      region === 'en' ? 'comparison' : `comparison-${region.toLowerCase()}`

    // Fetch page data for integrations
    const pageData = await queries.getPageData('dentalPhones', slug)

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    // Fetch comparison table data
    const client = getClient()
    const comparisonTableData = await getComparisonTableData(client, region)
    const comparisonLegendData = (await getAllComparisonValues()) || []

    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        pageData,
        region,
        comparisonTableData,
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
