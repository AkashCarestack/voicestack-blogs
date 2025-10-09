import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'




export default function WhyVoicestackIndex({ data }:any) {
  console.log('Component received data:', data)
  
  return (
    <div>
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
    
    console.log( dataVal)
    data = dataVal || {} 


    return {
      props: {
        data:data||[]
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching Why Voicestack data:', error)
    return {
      props: {
        data: data
      
      },
    
    }
  }
}
