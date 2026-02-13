import { useTracking } from 'cs-tracker'
import { isEmpty } from 'lodash'
import type { GetStaticProps } from 'next'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import Home from '~/components/revamp/components/home'
import HomeAU from '~/components/revamp/components/homeAU'
import HomeGB from '~/components/revamp/components/homeGB'
import Queries from '~/components/revamp/queries'
import { getParams } from '~/helpers/getQueryParams'
import { getClient } from '~/lib/sanity.client'
import {
  getAllComparisonValues,
  getComparisonTableData,
  getFeaturesList,
} from '~/lib/sanity.queries'

interface IndexPageProps {
  pageData: any
  pageData1: any
  region: string
  faq: any
  featuresData: any[]
  comparisonLegendData: any[]
  comparisonTableData: any[]
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'
  try {
    const region = locale || 'en'
    const queries = new Queries('landing', region)
    const slug = region === 'en' ? 'landing' : `landing-${region.toLowerCase()}`
     const queries1 = new Queries('landing-v2', region)
    const slug1 = region === 'en' ? 'landing-v2' : `landing-v2-${region.toLowerCase()}`
    
    console.log('Fetching home page data:', { region, slug, slug1 })
    
    const pageData = await queries.getPageData('homePage', slug)
    const pageData1 = await queries1.getPageData('homePage', slug1)
    const client = getClient()

    console.log('Page data results:', { 
      pageData: !!pageData, 
      pageData1: !!pageData1,
      slug,
      slug1,
      region 
    })
    if (!pageData1) {
      return {
        notFound: true,
      }
    }
    
    // Only set slug if pageData exists (it may not exist for en-AU)
    if (pageData) {
      pageData.slug = slug
    }
    pageData1.slug = slug1

    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null
    const featuresData = (await getFeaturesList(client, region)) || []
    const comparisonLegendData = (await getAllComparisonValues()) || []
    const comparisonTableData = await getComparisonTableData(client, region)

    return {
      props: {
        pageData: pageData || null, // Ensure pageData is never undefined
        pageData1,
        region,
        faq: faqData,
        featuresData: featuresData || [],
        comparisonLegendData: comparisonLegendData || [],
        comparisonTableData: comparisonTableData || [],
        locale,
      },
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    return {
      notFound: true,
    }
  }
}

export default function IndexPage({
  pageData,
  region,
  pageData1,
  faq,
  featuresData,
  comparisonLegendData,
  comparisonTableData,
}: IndexPageProps) {
  const { Track, trackEvent } = useTracking({ page: 'home-page' }, {})
  const searchParams = useSearchParams()
  const [refer, setRefer] = useState(null)

  useEffect(() => {
    const sourceParam = searchParams.get('refer')
    setRefer(sourceParam || '')
  }, [searchParams])

  useEffect(() => {
    const {
      utm_source = null,
      utm_term = null,
      utm_content = null,
      utm_campaign = null,
      utm_medium = null,
      ...params
    } = getParams()

    if (window) {
      trackEvent({
        e_name: 'home-page',
        e_type: 'page-view',
        e_time: new Date(),
        e_path: window?.location.href,
        utm_campaign,
        utm_content,
        utm_source,
        utm_term,
        utm_medium,
        url_params: params,
        user_segment: 'A',
        current_path: window?.location.href,
        base_path: window.location.origin + window.location.pathname,
        domain: window.location.origin,
        referrer_url: window.document.referrer,
      })
    }
  }, [])

  // if (isEmpty(pageData)) {
  //   return (
  //     <>
  //       <p className="p-5">Loading ... </p>
  //     </>
  //   )
  // }

  const comparisonSectionData = {
    strip:
      'The Best-in-Class Phone System.<br/> For the Best-in-Class Dental Practices.',
    header:
      'No other phone system can match VoiceStack’s AI-driven features, outcome-driven workflows and integration capabilities, as shown in the comparison chart below. ',
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }


// console.log("hoem",pageData)
// console.log("featuresData", featuresData)
  return (
    <Track>
      {region === 'en' && (
        <Home
          data={pageData1}
          featuresData={featuresData}
          comparisonLegendData={comparisonLegendData}
          comparisonTableData={comparisonTableData}
          comparisonSectionData={comparisonSectionData}
        />
      )}
      {region === 'en-GB' && (
        <HomeGB 
        featuresData={featuresData}
        comparisonLegendData={comparisonLegendData}
        data={pageData1} pageData={pageData1} 
       

         />
      )}
   
      {region === 'en-AU' && (
        <HomeAU 
          featuresData={featuresData}
          comparisonLegendData={comparisonLegendData}
          data={pageData1} pageData={pageData1} />  
      )}
    </Track>
  )
}
