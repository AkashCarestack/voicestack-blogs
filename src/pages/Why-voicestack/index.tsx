import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import SimpleHead from '~/components/common/SimpleHead'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer' 
import Queries from '~/components/revamp/queries'




export default function WhyVoicestackIndex({ data }:any) {
  console.log('Component received data:', data)
  
  return (
    <div>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()
  let data:any = []

  try {
    // First, let's get all Why Voicestack pages to find available slugs
   
    
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
