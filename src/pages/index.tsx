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
    const pageData = await queries.getPageData('homePage', slug)
    const client = getClient()
    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null
    const featuresData = (await getFeaturesList(client, region)) || []
    const comparisonLegendData = (await getAllComparisonValues()) || []
    const comparisonTableData = await getComparisonTableData(client, region)

    return {
      props: {
        pageData,
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

  if (isEmpty(pageData)) {
    return (
      <>
        <p className="p-5">Loading ... </p>
      </>
    )
  }

  const comparisonSectionData = {
    strip:
      'The Best-in-Class Phone System.<br/> For the Best-in-Class Dental Practices.',
    header:
      'No other phone system can match VoiceStack’s AI-driven features, outcome-driven workflows and integration capabilities, as shown in the comparison chart below. ',
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }

  return (
    <Track>
      <SimpleHead data={pageData?.seo} />
      {region === 'en' && (
        <Home
          data={pageData}
          featuresData={featuresData}
          comparisonLegendData={comparisonLegendData}
          comparisonTableData={comparisonTableData}
          comparisonSectionData={comparisonSectionData}
        />
      )}
      {region === 'en-GB' && (
        <HomeGB data={pageData['hero-section']?.componentData}
       

         />
      )}
   
      {region === 'en-AU' && (
        <HomeAU 
        featuresData={featuresData}
        comparisonLegendData={comparisonLegendData}
        comparisonTableData={comparisonTableData}
        comparisonSectionData={comparisonSectionData}
        data={pageData['hero-section']?.componentData} />
      )}
    </Track>
  )
}
