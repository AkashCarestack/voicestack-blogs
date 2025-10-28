import { GetStaticProps } from 'next'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import FaqSection from '~/components/revamp/components/common/faqSection'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import { getFeaturesListQuery, getFeaturesList } from '~/lib/sanity.queries'
export default function WhyVoicestackIndex({ data, heroData, faq, features }: any) {
  return (
    <div>
      <HeroSection data={heroData} refer={data} page="why-voicestack" />
      {data['grow-your-practice'] && (
        <ListingWithTabs list={data['grow-your-practice']} />
      )}
      <CategoryFeatureTabs features={features} />
      {data['stack-card-tab-testimonial']?.componentData && (
        <StackCardTestimonial data={data['stack-card-tab-testimonial'].componentData} refer={data}/>
      )}
      <FaqSection faqItems={faq}/>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()

  try {
    const queries = new Queries('why-voicestack', currentLanguage)
  
    const dataVal = await queries.getPageData('whyVoicestack', 'why-voicestack')

    // Check if data exists and has content
    if (!dataVal || Object.keys(dataVal).length === 0 ){
      return {
        notFound: true,
      }
    } 
    const heroData = dataVal?.['why-voicestack-hero']?.componentData || null
    
    // Fetch features data for CategoryFeatureTabs
    const features = await getFeaturesList(client, currentLanguage)

    // Ensure FAQ data is serializable
    const faqData = dataVal?.faqData?.[0] || dataVal?.faqReferenced?.[0] || null
    
    return {
      props: {
        data: dataVal,
        heroData: heroData,
        faq: faqData,
        features: features || []
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error('Error fetching Why Voicestack data:', error)
    return {
      notFound: true,
    }
  }
}
