import { GetStaticProps } from 'next'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'


export default function WhyVoicestackIndex({ data, heroData }:any) {
  
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

  try {
    const queries = new Queries('why-voicestack', currentLanguage)
    const dataVal = await queries.getPageData('whyVoicestack', 'why-voicestack')
    
    // Check if data exists and has content
    if (!dataVal || 
        typeof dataVal !== 'object' || 
        Object.keys(dataVal).length === 0 ||
        !dataVal['why-voicestack-hero']) {
      return {
        notFound: true
      }
    }
    
    const heroData = dataVal?.['why-voicestack-hero']?.componentData || null

    return {
      props: {
        data: dataVal,
        heroData: heroData
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching Why Voicestack data:', error)
    return {
      notFound: true
    }
  }
}
