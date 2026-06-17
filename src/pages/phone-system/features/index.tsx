import { GetStaticProps } from 'next'

import LogoListingV2 from '~/v2/sections/LogoListingV2'
import CardWIthGraph from '~/components/revamp/components/common/cardWIthGraph'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import CallFlowAnalyticsSection from '~/v2/components/CallFlowAnalyticsSection'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import SimpleHead from '~/components/common/SimpleHead'

interface Feature {
  _id: string
  title: string
  slug: {
    current: string
  }
  language: string
  order?: number
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: any
  mainImage?: any
  shortDescription?: any
  featureCategory?: {
    name: string
    description?: string
    icon?: any
  }
}

interface FeaturesPageProps {
  features: Feature[]
  currentLanguage: string
  landingPage?: Feature | null
  data: any
  faq: any
}

export default function FeaturesPage({
  features,
  data,
  landingPage,
  faq,
}: FeaturesPageProps) {
  return (
    <>
    <SimpleHead data={data?.seo} />
      {data?.['feature-hero']?.componentData && (
        <FeatureHero data={data['feature-hero']} type="feature" />
      )}

      {data?.['logos-listing']?.componentData && (
        <LogoListingV2
          data={data['logos-listing']?.componentData.blocksListingData}
        />
      )}
      
      <CategoryFeatureTabsSection 
          features={features} 
          // sectionHeading={data?.['category-feature-tabs']?.componentData?.sectionHeading}
      />

      {data?.['loosing-leads']?.componentData && (
        <GroupedCardsGridSection
          data={data['loosing-leads']?.componentData}
          theme="dark"
          sectionSpacing="pt-sm"
        />
      )}
      {data?.['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={data['integrations-listing']?.componentData}
          theme="dark"
        />
      )}
      {data?.['feature-testimonials-section-single']?.componentData && (
        <FeatureTestimonialsSection
          data={data['feature-testimonials-section-single']?.componentData}
        />
      )}
      {faq && <FaqSection faqItems={faq} />}
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
    
    // Hardcode slug since phone-system pages only support 'en' locale
    const slug = 'feature-landing-page-v2'
    const queries = new Queries('feature-landing-page-v2', region)
    const landingPageData = await queries.getPageData('featurePage', slug)
    const features = await getFeaturesList(getClient(), region)
    const faqData =
      landingPageData?.faqData?.[0] ||
      landingPageData?.faqReferenced?.[0] ||
      null
    return {
      props: {
        features: features || [],
        currentLanguage: region,
        landingPage: landingPageData || null,
        data: landingPageData || null,
        faq: faqData,
      },
    }
  } catch (error) {
    console.error('Error fetching features:', error)
    return {
      props: {
        features: [],
        currentLanguage: locale || 'en',
        landingPage: null,
        data: null,
        faq: null,
      },
    }
  }
}
