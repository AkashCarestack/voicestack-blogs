import groq from 'groq'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getAllComparisonValues } from '~/lib/sanity.queries'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import SimpleHead from '~/components/common/SimpleHead'

interface ComparisonPageProps {
  pageData: any
  faq: any
  region: string
  slug: string
}

export default function ComparisonSlugPage({
  pageData,
  faq,
  region,
  slug,
}: ComparisonPageProps) {

  // Extract comparison table data from componentData
  const comparisonTableComponent = pageData['comparison-table']?.componentData
  const comparisonTableData = comparisonTableComponent?.comparisonTable
  
  // Format data for SiteComparisonSection
  const comparisonSectionData = comparisonTableData ? {
    strip: comparisonTableComponent?.title || comparisonTableData?.title,
    header: comparisonTableComponent?.description || '',
    columnDimensionName: 'Features',
    table: comparisonTableData,
  } : null
  
  return (
    <>
      <SimpleHead data={pageData?.seo} />
      <HeroWrapper>
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        {pageData['comparison-hero']?.componentData && (
          <HeroSection
            page=""
            data={pageData['comparison-hero']?.componentData}
            showFullDescription={true}
          />
        )}
      </HeroWrapper>

      {comparisonSectionData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          legendData={pageData?.comparisonLegendData || []}
        />
      )}

      {pageData['stack-card-tab-testimonial']?.componentData?.refData && (
        <StackCardTestimonial
          data={
            pageData['stack-card-tab-testimonial']?.componentData?.refData?.tabsListingComponent
          }
        />
      )}

      {pageData['integrations-listing']?.componentData && (
        <IntegrationsGrid data={pageData['integrations-listing']?.componentData}/>
      )}

      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async ({
  locales,
  defaultLocale,
}) => {
  try {
    const client = getClient()
    
    // Get all unique comparison slugs (without drafts)
    const comparisonsQuery = groq`
      *[_type == "comparison" && !(_id in path("drafts.**"))] {
        "slug": basicInfo.slug.current
      }
    `
    
    const comparisons = await client.fetch(comparisonsQuery)
    
    // Get unique slugs (in case there are duplicates across languages)
    const uniqueSlugs = [
      ...new Set(comparisons.map((comparison: any) => comparison.slug).filter(Boolean)),
    ]
    
    // Exclude the main comparison page slug (handled by index.tsx)
    const filteredSlugs = uniqueSlugs.filter(
      (slug: string) => 
        slug !== 'comparison' && 
        slug !== 'comparison-en' && 
        slug !== 'comparison-en-gb' && 
        slug !== 'comparison-en-au'
    )
    
    // Format paths for Next.js
    const paths = filteredSlugs.map((slug: string) => ({
      params: { slug },
    }))
    
    return {
      paths,
      fallback: 'blocking',
    }
  } catch (error) {
    console.error('Error fetching comparison paths:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const region = locale || 'en'
  const slug = params?.slug as string

  if (!slug) {
    return {
      notFound: true,
    }
  }
  
  
  try {
    const queries = new Queries('comparison', region)
    const pageData = await queries.getPageData('comparison', slug)
    // console.log('cp pagedata', pageData);


    // Check if pageData has any content sections (excluding metadata)
    const metadataKeys = ['faqData', 'faqReferenced', 'title', 'description', 'breadCrumb', 'seo', 'icon']
    const hasContent = Object.keys(pageData).some(key => 
      !metadataKeys.includes(key) && pageData[key] !== null && pageData[key] !== undefined
    )

    if (!pageData || !hasContent) {
      console.error(`pageData is empty (all null) for ${slug}`)
      return {
        notFound: true,
      }
    }

    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    // Fetch comparison legend data (comparisonValue documents)
    const comparisonLegendData = (await getAllComparisonValues()) || []

    return {
      props: {
        pageData: {
          ...pageData,
          comparisonLegendData,
        },
        region: region,
        faq: faqData,
        slug: slug,
      },
    }
  } catch (error) {
    console.error('Error fetching Comparison page:', error)
    return {
      notFound: true,
    }
  }
}

