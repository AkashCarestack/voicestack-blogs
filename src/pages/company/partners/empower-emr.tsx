import { GetStaticProps } from 'next'
import React from 'react'
import LpHeader from '~/components/common/LpHeader'
import SimpleHead from '~/components/common/SimpleHead'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import PartnerPageTestimonial from '~/components/revamp/components/common/PartnerPageTestimonial/PartnerPageTestimonial'
import ReviewTestimonial from '~/components/revamp/components/common/ReviewTestimonial/ReviewTestimonial'
import Queries from '~/components/revamp/queries'
import VoicestackLogo from 'public/assets/lp/voicestack-empoweremr.png'

interface EmpowerEMRProps {
  pageData: any
  faq: any
}

export default function EmpowerEMR({ pageData, faq }: EmpowerEMRProps) {
 
  return (
    <>
      <LpHeader/>
      <SimpleHead data={pageData?.seo} noindex={true} />
      <HeroWrapper>
        {/* <Breadcrumb breadCrumb={pageData?.breadCrumb} /> */}

        {pageData['empower-emr-hero']?.componentData && ( 
          <HeroSection
            page=""
            data={pageData['empower-emr-hero']?.componentData}
          />
        )}
      </HeroWrapper>

      {/* {pageData['empower-emr-testimonials']?.componentData && (
        <PartnerPageTestimonial data={pageData['empower-emr-testimonials']?.componentData} />
      )} */}

      {pageData['review-testimonial']?.componentData && (
        <ReviewTestimonial data={pageData['review-testimonial']?.componentData} buttonDemo={true}/>
      )}

      
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('partner', region)
    const slug = `empower-emr`
    const pageData = await queries.getPageData('partner', slug)

    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
    }
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    // Normalize undefined values to null for JSON serialization
    if (pageData?.seo) {
      if (pageData.seo.disableIndex === undefined) {
        pageData.seo.disableIndex = null
      }
    }

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData,
      },
    }
  } catch (error) {
    console.error('Error fetching empower EMR page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
      },
    }
  }
}

