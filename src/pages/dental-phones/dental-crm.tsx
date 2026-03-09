import { GetStaticProps } from 'next'
import React from 'react'
import Button from '~/components/common/Button'
import SimpleHead from '~/components/common/SimpleHead'

import FaqSection from '~/components/revamp/components/common/faqSection'
import ListCardWithIcon from '~/components/revamp/components/common/ListCardWithIcon'
import Queries from '~/components/revamp/queries'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import CallFlowAnalyticsSection from '~/v2/components/CallFlowAnalyticsSection'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'
import FeatureHero from '~/v2/sections/FeatureHero'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import OfferSection from '~/v2/sections/OfferSection'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'

// Define proper TypeScript interfaces
interface HeroComponentData {
  title?: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  [key: string]: any // For flexibility with dynamic data
}

interface GenericListingData {
  heading?: string
  description?: string
  items?: Array<{
    _key?: string
    heading?: string
    subheading?: string
    description?: string
    link?: {
      url?: string
      text?: string
      buttonType?: string
    }
    dynamicSvg?: string
    image?: any
  }>
}

interface PageData {
  'dental-phones-hero': {
    componentData: HeroComponentData
  }
  'how-voicestack-works'?: {
    componentData: GenericListingData
  }
  [key: string]: any // For other page sections
}

interface AiReceptionistProps {
  pageData: any,
  region: string
  comparisonTableData: any
  comparisonLegendData: any[] | null
  faq: any
  features: any[]
}

export default function AiReceptionist({
  pageData,
  region,
  comparisonLegendData,
  faq,
  features,
}: AiReceptionistProps) {
  const iconListData = pageData['icon-list']?.componentData


  const comparisonTableComponent = pageData['comparison-table']?.componentData
  const comparisonTableData = comparisonTableComponent?.comparisonTable
 
  // const comparisonTableTitle = pageData['comparison-table']?.componentData
  const comparisonSectionData = {
    strip: comparisonTableComponent?.title,
    header: comparisonTableComponent?.description,
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }
  return (
    <>
      <SimpleHead data={pageData?.seo} />

      {pageData['dental-phones-hero']?.componentData && (
        <FeatureHero data={pageData['dental-phones-hero']} type="feature" hideBg={region === 'en-AU' || region === 'en-GB' ? true : false} isVertical={region === 'en-AU' || region === 'en-GB' ? true : false} isCentered={region === 'en-AU' || region === 'en-GB' ? true : false} />
      )}

      {pageData['list-items'] && (
        <GroupedCardsGridSection
          data={pageData['list-items']?.componentData}
          sectionSpacing='py-0'
          sectionBorder='none'
        />
      )}
 
      {
        pageData['convert-leads']?.componentData && (
          <GroupedCardsGridSection
            data={pageData['convert-leads']?.componentData}
          />
        )
      }
           {iconListData && <Section className='w-full bg-white'>
        <Container className='w-full bg-white' type="V2" border='y-0'>
          <div className='flex flex-col md:gap-8 gap-6 py-16 justify-between items-center'>
          <SectionHeaderV2 heading={iconListData?.sectionHeadingDynamic}
          description={iconListData?.description} />
          {
            iconListData?.ctaListItems?.length > 0 && (
              <Button type={iconListData?.ctaListItems[0]?.ctaType as any} link={iconListData?.ctaListItems[0]?.ctaLink} className='w-fit'>
                <span>{iconListData?.ctaListItems[0]?.ctaText}</span>
              </Button>
            )
          }
          </div>
         <div className='flex mx-auto px-4 md:flex-row flex-col flex-wrap md:gap-6 border-t border-t-gray-200'> {
          iconListData && 
          iconListData?.customListingItems?.map((item:any)=>{
              return (
                <ListCardWithIcon
                  heading={item.heading}
                  data={item.listItems}
                  key={item._key}
                />
              )
            })
        }
         </div>
       </Container>
      </Section>}
      {pageData['offer']?.componentData && (
        <OfferSection data={pageData['offer']?.componentData} variant="compact" />
      )}
      {comparisonTableData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={comparisonLegendData || []}
        />
      )}

      <CallFlowAnalyticsSection
        data={pageData['call-flow-analytics']?.componentData}
      />

      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}
      {pageData['testimonials-section']?.componentData && (
        <FeatureTestimonialsSection
          data={pageData['feature-testimonials-section-single']?.componentData}
        />
      )}

      

      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    
    // dental-phones pages support 'en-AU' and 'en-GB' locales
    if (region !== 'en-AU' && region !== 'en-GB') {
      return {
        notFound: true,
      }
    }
    
    const queries = new Queries('dental-crm', region)
    // Convert region to slug format (en-AU -> en-au, en-GB -> en-gb)
    const regionSlug = region.toLowerCase()
    const slug = `dental-crm-${regionSlug}`

    const pageData = await queries.getPageData('dentalPhones', slug)
    const client = getClient()

    if (!pageData) {
      return {
        notFound: true,
      }
    }

    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null
    // Fetch features data for CategoryFeatureTabs
    const features = await getFeaturesList(client, region)

    return {
      props: {
        pageData,
        region,
        faq: faqData,
        features: features || [],
      },
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    return {
      notFound: true,
    }
  }
}

