import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'
import SimpleHead from '~/components/common/SimpleHead'
import { useLayoutData } from '~/providers/LayoutDataProvider'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import FeatureHero from '~/v2/sections/FeatureHero'

interface SupportPageProps {
  supportPageData: any
  breadCrumb?: string | null
  region: string,
  faq: any
}

export default function SupportPage({
  supportPageData,
  breadCrumb,
  region,
  faq,
}: SupportPageProps) {

  const heroKey = Object.keys(supportPageData || {}).find(
    (key) => key.includes('hero') && supportPageData[key]?.componentData
  )
  const baseHeroData = heroKey ? supportPageData[heroKey]?.componentData : null
  const { contactData } = useLayoutData()
  
  // Extract contact information
  const supportEmail = contactData?.contactEmail || contactData?.supportEmail || 'support@voicestack.com'
  const supportPhone = contactData?.supportPhoneNumber || contactData?.phoneNumber || ''
  
  // Create button data for email and phone
  const contactButtons = []
  
  if (supportEmail) {
    contactButtons.push({
      _key: 'support-email-btn',
      buttonText: supportEmail,
      buttonLink: `mailto:${supportEmail}`,
      buttonType: 'secondaryMail',
    })
  }
  
  if (supportPhone) {
    contactButtons.push({
      _key: 'support-phone-btn',
      buttonText: supportPhone,
      buttonLink: `tel:${supportPhone.replace(/\D/g, '')}`,
      buttonType: 'secondaryTel',
    })
  }
  
  // Merge heroData with button data, email, and phone
  const heroData = baseHeroData ? {
    ...baseHeroData,
    bookBtnContent: [
      ...(baseHeroData.bookBtnContent || []),
      ...contactButtons,
    ],
    supportEmail,
    supportPhone,
  } : null
  return (
    <>
      <SimpleHead data={supportPageData?.seo} />
      
      <FeatureHero  data={heroData} type="feature" isCentered={true} />


      {/* <HeroWrapper>
        {heroData && (
          <HeroSection
            page="support"
            isCentered={true}
            data={heroData}
            contactData={contactData}
            showFullDescription={true}
          />
        )}
      </HeroWrapper> */}

      <div className='w-full  '>
        <StatisticsSection/>
      </div>
      
      {/* FAQ Section */}
      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('company', region)
    const slug =
      region === 'en' ? 'support-page-data' : `support-page-data-${region.toLowerCase()}`

    const supportPageData = await queries.getPageData('company', slug)
    const faq = supportPageData?.faqData?.[0] || supportPageData?.faqReferenced?.[0] || null


    if (!supportPageData || Object.keys(supportPageData).length === 0) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        supportPageData,
        breadCrumb: supportPageData?.breadCrumb || null,
        region,
        faq: faq || null,
      },
    }
  } catch (error) {
    console.error('Error fetching Support page data:', error)
    return {
      notFound: true,
    }
  }
}

