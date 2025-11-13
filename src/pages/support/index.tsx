import React from 'react'
import { GetStaticProps } from 'next'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import Queries from '~/components/revamp/queries'

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
  const heroData = heroKey ? supportPageData[heroKey]?.componentData : null

  return (
    <>
      <div style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}>
        <Breadcrumb breadCrumb={breadCrumb} />
        <div
          className="pt-lg pb-md"
          
        >
          {heroData && (
            <HeroSection
              page=""
              isCentered={true}
              data={heroData}
              showFullDescription={true}
            />
          )}
        </div>
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
    const faq = await queries.getFaqBySlug('support', region)

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

