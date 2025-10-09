import { GetStaticProps } from 'next'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'


export default function WhyVoicestackIndex({ data, heroData }:any) {
  console.log('Component received data:', data)
  console.log('Component received heroData:', heroData)
  
  return (
    <div>
      <HeroSection data={heroData} refer={data} page="why-voicestack" />
      <ListingWithTabs list={data['grow-your-practice']}/>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()
  let data:any = []

  try {
    const queries = new Queries('why-voicestack')
    const dataVal = await queries.getPageData('whyVoicestack', 'why-voicestack')
    const heroData = dataVal?.['why-voicestack-hero'].componentData    || null
    
    console.log("whyyy", heroData)
    
    // Extract 'why-voicestack-hero' from dataVal and store in heroData
    data = dataVal || {} 

    console.log("heroData extracted:", heroData)

    return {
      props: {
        data: data || [],
        heroData: heroData
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching Why Voicestack data:', error)
    return {
      props: {
        data: data,
        heroData: null
      },
    }
  }
}
