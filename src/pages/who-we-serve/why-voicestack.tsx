import { GetStaticProps } from 'next'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import FaqSection from '~/components/revamp/components/common/faqSection'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import { getFeaturesListQuery, getFeaturesList } from '~/lib/sanity.queries'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import SimpleHead from '~/components/common/SimpleHead'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import FeatureHero from '~/v2/sections/FeatureHero'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
export default function WhyVoicestackIndex({
  data,
  heroData,
  faq,
  features,
}: any) {
  console.log(data, 'data====')
  return (
    <>
      <SimpleHead data={data?.seo} />
      {heroData && <FeatureHero data={heroData} />}
      {data?.['logos-listing']?.componentData && (
        <LogoListingV2
          data={data?.['logos-listing']?.componentData.blocksListingData}
        />
      )}
      <CategoryFeatureTabsSection
        features={
          data['grow-your-practice']?.componentData?.refData
            ?.tabsListingComponent
        }
         variant="carouselwithcards"
        sectionHeading={
          data['grow-your-practice']?.componentData?.refData
            ?.tabsListingComponent
        }
      />

      {data['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={data['integrations-listing']?.componentData}
          theme="dark"
        />
      )}
      <CategoryFeatureTabsSection
        features={features}
        variant="carousel"
        sectionHeading={
          data['category-feature-tabs']?.componentData?.sectionHeading
        }
        sectionBorder="b"
      />
      {data['stack-card-tab-testimonial']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            data['stack-card-tab-testimonial']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial
          data={data['stack-card-tab-testimonial']?.componentData}
        />
      )}
      {/* <FaqSection faqItems={faq}/> */}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'
  const client = getClient()

  try {
    const queries = new Queries('why-voicestack-v2', region)

    const pageData = await queries.getPageData(
      'whyVoicestack',
      'why-voicestack-v2',
    )

    // Check if data exists and has content
    const noPageData = Object.values(pageData).every(
      (value) => value === null || value === undefined,
    )

    if (noPageData) {
      return {
        notFound: true,
      }
    }
    const heroData = pageData?.['why-voicestack-hero']?.componentData || null

    // Fetch features data for CategoryFeatureTabs
    const features = await getFeaturesList(client, region)

    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    return {
      props: {
        data: pageData,
        heroData: heroData,
        faq: faqData,
        features: features || [],
      },
    }
  } catch (error) {
    console.error('Error fetching Why Voicestack data:', error)
    return {
      notFound: true,
    }
  }
}
