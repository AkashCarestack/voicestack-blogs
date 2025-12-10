import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import Queries from '~/components/revamp/queries'

interface EmpowerEMRProps {
  pageData: any
  faq: any
}

export default function EmpowerEMR({ pageData, faq }: EmpowerEMRProps) {
 
  return (
    <>
      <SimpleHead data={pageData?.seo} />
      
      <HeroWrapper>
        {/* <Breadcrumb breadCrumb={pageData?.breadCrumb} /> */}

        {pageData['empower-emr-hero']?.componentData && ( 
          <HeroSection
            page=""
            data={pageData['empower-emr-hero']?.componentData}
          />
        )}
      </HeroWrapper>

      
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

