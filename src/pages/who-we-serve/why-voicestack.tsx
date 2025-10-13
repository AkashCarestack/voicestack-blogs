import { GetStaticProps } from 'next'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesListQuery } from '~/lib/sanity.queries'


export default function WhyVoicestackIndex({ data, heroData, features }:any) {

  
  return (
    <div>
      <HeroSection data={heroData} refer={data} page="why-voicestack" />
      <ListingWithTabs list={data['grow-your-practice']}/>
      {features && features.length > 0 && (
        <CategoryFeatureTabs features={features} />
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()
  let data:any = []
  let features:any = []

  try {
    const queries = new Queries('why-voicestack')
    const dataVal = await queries.getPageData('whyVoicestack', 'why-voicestack')
    const heroData = dataVal?.['why-voicestack-hero'].componentData    || null
    
    
    data = dataVal || {} 


    try {
      features = await client.fetch(getFeaturesListQuery, { language: currentLanguage })
      console.log("Features fetched:", features?.length || 0, "features")
    } catch (featureError) {
      console.error('Error fetching features:', featureError)
      features = []
    }

    return {
      props: {
        data: data || [],
        heroData: heroData,
        features: features || []
      },
    }
  } catch (error) {
    console.error('Error fetching Why Voicestack data:', error)
    return {
      props: {
        data: data,
        heroData: null,
        features: features
      },
    }
  }
}
