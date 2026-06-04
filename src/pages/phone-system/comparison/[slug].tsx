import groq from 'groq'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getAllComparisonValues, getFeaturesList } from '~/lib/sanity.queries'
import SiteComparisonSection from '~/v2/sections/SiteComparisonSection'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import SimpleHead from '~/components/common/SimpleHead'
import FeatureHero from '~/v2/sections/FeatureHero'
import OfferSection from '~/v2/sections/OfferSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import { urlForImage } from '~/lib/sanity.image'
import ComparisonHero from '~/v2/sections/ComparisonHero'
import ComparisonBannerSection from '~/v2/sections/ComparsionBannerSection'
import CampaignOfferModal from '~/v2/components/common/CampaignOfferModal'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'

interface ComparisonPageProps {
  pageData: any
  faq: any
  region: string
  slug: string
  features: any[]
}

const MANGO_COMPARISON_SLUG = 'voicestack-vs-mango-voice'

export default function ComparisonSlugPage({
  pageData,
  faq,
  region,
  slug,
  features,
}: ComparisonPageProps) {
  const router = useRouter()
  const [showCampaignOfferModal, setShowCampaignOfferModal] = React.useState(false)

  React.useEffect(() => {
    if (!router.isReady) return

    if (slug !== MANGO_COMPARISON_SLUG) {
      setShowCampaignOfferModal(false)
      return
    }

    const queryString = router.asPath.includes('?')
      ? router.asPath.split('?')[1].split('#')[0]
      : ''
    const params = new URLSearchParams(queryString)
    const hasUtmParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content']
      .some((key) => Boolean(params.get(key)))

    const utmContent = params.get('utm_content')?.toLowerCase() || ''
    const isMangoCampaign = utmContent.includes('mango')

    setShowCampaignOfferModal(hasUtmParams && isMangoCampaign)
  }, [router.isReady, router.asPath, slug])

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
        {/* <Breadcrumb breadCrumb={pageData?.breadCrumb} /> */}

        {/* {pageData['comparison-hero']?.componentData && (
          <FeatureHero data={pageData['comparison-hero']} />
        )} */}

        {pageData['comparison-hero-v2']?.componentData && (
          <ComparisonHero 
            image={urlForImage(pageData['comparison-hero-v2']?.heroComponent?.heroImage)} 
            heroStrip={pageData['comparison-hero-v2']?.heroComponent?.heroStrip}
            heading={pageData['comparison-hero-v2']?.heroComponent?.heroheading} 
            description={pageData['comparison-hero-v2']?.heroComponent?.heroDescription  }
            buttons={pageData['comparison-hero-v2']?.heroComponent?.bookBtnContent} />
        )}

      {pageData['logo-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logo-listing']?.componentData?.blocksListingData}
        />
      )}

      {comparisonSectionData && (
        <SiteComparisonSection
          data={comparisonSectionData}
          // legendData={pageData?.comparisonLegendData || []}
        />
      )}

      {/* {pageData['offer']?.componentData && (
        <OfferSection
          data={pageData['offer']?.componentData}
        />
      )} */}

        {/* {pageData['comparison-cards']?.componentData && (
          <ComparisonCardsSection data={pageData['comparison-cards']?.componentData} />
        )} */}


      <CategoryFeatureTabsSection
          features={features} 
          variant="carousel"
          sectionHeading={pageData['category-feature-tabs']?.componentData?.sectionHeading}
      />

      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}

      {pageData['stack-card-tab-testimonial']?.componentData.refData && (
        <StackCardTestimonial
          data={
            pageData['stack-card-tab-testimonial']?.componentData.refData.tabsListingComponent
          }
        />
      )}

      
      {pageData['offer-v2']?.componentData && (
        <ComparisonBannerSection data={pageData['offer-v2']?.componentData}/>
      )}

      {faq && <FaqSection faqItems={faq} />}

      {slug === MANGO_COMPARISON_SLUG && showCampaignOfferModal && (
        <CampaignOfferModal onClose={() => setShowCampaignOfferModal(false)} />
      )}
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
    // Also exclude 'comparison-en-au' and any slug ending with '-en-au' as phone-system doesn't support 'au' locale
    const filteredSlugs = uniqueSlugs.filter(
      (slug: string) => 
        slug !== 'comparison' && 
        slug !== 'comparison-en' && 
        slug !== 'comparison-en-gb' && 
        slug !== 'comparison-en-au' &&
        !slug.endsWith('-en-au')
    )
    
    // Format paths for Next.js
    const paths = filteredSlugs.map((slug: string) => ({
      params: { slug },
    }))
    
    return {
      paths,
      fallback: 'blocking', // Only serve pre-generated pages(if false). New pages will 404 until rebuild (webhook handles revalidation)
    }
  } catch (error) {
    console.error('Error fetching comparison paths:', error)
    return {
      paths: [],
      fallback: 'blocking', // Only serve pre-generated pages(if false). New pages will 404 until rebuild (webhook handles revalidation)
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const region = locale || 'en'
  const slug = params?.slug as string

  // phone-system pages don't support 'en-AU' or 'en-GB ' locale
  if (region !== 'en') {
    return {
      notFound: true,
    }
  }

  if (!slug) {
    return {
      notFound: true,
    }
  }
  
  // Also check if slug ends with '-en-au' and reject it
  if (slug.endsWith('-en-au')) {
    return {
      notFound: true,
    }
  }
  
  try {
    const queries = new Queries('comparison', region)
    const pageData = await queries.getPageData('comparison', slug)


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
    const features = await getFeaturesList(getClient(), region)

    return {
      props: {
        pageData: {
          ...pageData,
          comparisonLegendData,
        },
        features: features || [],
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

