import { GetStaticProps } from 'next'

import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import FaqSection from '~/components/revamp/components/common/faqSection'

export default function WhyVoicestackIndex({ data, heroData,faq }: any) {
  return (
    <div>
      <HeroSection data={heroData} refer={data} page="why-voicestack" />
      <ListingWithTabs list={data['grow-your-practice']} />
      <StackCardTestimonial data={data['stack-card-tab-testimonial']} refer={data}/>
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
     const faqSectionData = await queries.fetchFaqData('homeSettings',currentLanguage)
    const heroData = dataVal?.['why-voicestack-hero']?.componentData || null

    return {
      props: {
        data: dataVal,
        heroData: heroData,
        faq:faqSectionData && faqSectionData.faqReferenced
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
