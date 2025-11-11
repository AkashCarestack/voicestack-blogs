import { GetStaticProps } from 'next'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import FaqSection from '~/components/revamp/components/common/faqSection'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import { getFeaturesListQuery, getFeaturesList } from '~/lib/sanity.queries'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
export default function WhyVoicestackIndex({ data, heroData, faq, features }: any) {

  return (
    <>
       <div
         className="py-12"
         style={{
           background: 'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)'
         }}
       >
        <Breadcrumb breadCrumb={data?.breadCrumb} />
        <HeroSection data={heroData} refer={data} page="why-voicestack" />
        
       </div>
      {data['grow-your-practice'] && (
        <ListingWithTabs list={data['grow-your-practice']} />
      )}
      <CategoryFeatureTabs features={features} />
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
      <FaqSection faqItems={faq}/>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'
  const client = getClient()

  try {
    const queries = new Queries('why-voicestack', region)
  
    const pageData = await queries.getPageData('whyVoicestack', 'why-voicestack')
    

    // Check if data exists and has content
    const noPageData = Object.values(pageData).every(
      (value) => value === null || value === undefined
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
    const faqData = pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null
    
    return {
      props: {
        data: pageData,
        heroData: heroData,
        faq: faqData,
        features: features || []
      },
    }
  } catch (error) {
    console.error('Error fetching Why Voicestack data:', error)
    return {
      notFound: true,
    }
  }
}
