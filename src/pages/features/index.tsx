import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import Queries from '~/components/revamp/queries'
import FaqSection from '~/components/revamp/components/common/faqSection'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'

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
  data: any
}

export default function FeaturesPage({
  features,
  data,
}: FeaturesPageProps) {
  console.log({ data })
  const heroData = data['feature-landing']?.heroComponent

  return (
    <>
      <div
        className="bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA]"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        <HeroSection data={heroData} refer={data} page="feature-landing" />
      </div>
      <CategoryFeatureTabs
        features={features.filter(
          (feature) => feature.slug?.current !== 'landing',
        )}
      />
      {data['stack-card-tab-testimonial']?.componentData && (
        <StackCardTestimonial
          data={data['stack-card-tab-testimonial']?.componentData}
        />
      )}
      {data?.faqData && <FaqSection faqItems={data?.faqData[0]} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const slug =
      region === 'en'
        ? 'feature-landing-page'
        : `feature-landing-page-${region.toLowerCase()}`
    const queries = new Queries('feature-landing', region)
    const landingPageData = await queries.getPageData('featurePage', slug)
    const features = await getFeaturesList(getClient(), region)

    // Only pass the data sections that are actually used to reduce payload size
    const optimizedData = landingPageData
      ? {
          'feature-landing': landingPageData['feature-landing'] || null,
          'stack-card-tab-testimonial':
            landingPageData['stack-card-tab-testimonial'] || null,
          faqData: landingPageData.faqData || null,
          title: landingPageData.title || null,
          description: landingPageData.description || null,
        }
      : null

    return {
      props: {
        features: features || [],
        currentLanguage: region,
        data: optimizedData,
      },
    }
  } catch (error) {
    console.error('Error fetching features:', error)
    return {
      props: {
        features: [],
        currentLanguage: locale || 'en',
        data: null,
      },
    }
  }
}
