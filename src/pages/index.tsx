import { useTracking } from 'cs-tracker'
import { isEmpty } from 'lodash'
import type { GetStaticProps } from 'next'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import SimpleHead from '~/components/common/SimpleHead'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import LogoListingSection from '~/components/LogoListingSection'
import LogoSliderSection from '~/components/LogoSliderSection'
import CardListing from '~/components/revamp/components/cardListing'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import Testimonials from '~/components/revamp/components/common/Testimonials/Testimonials'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import { getParams } from '~/helpers/getQueryParams'
import { getClient } from '~/lib/sanity.client'
import { getAllComparisonValues, getComparisonTableData, getFeaturesList } from '~/lib/sanity.queries'

interface IndexPageProps {
  pageData: any
  region: string
  faq: any
  featuresData: any[]
  comparisonLegendData: any[]
  comparisonTableData: any[]
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
    // Ensure FAQ data is serializable
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null
    // Fetch features data for CategoryFeatureTabs
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


// console.log("hoem",pageData)
// console.log("featuresData", featuresData)
  return (
    <Track>
      <SimpleHead data={pageData?.seo} />
      <div className="">
        {/* Hero Section - use section slug from Sanity e.g. 'home-hero' */}

        {pageData['home-hero']?.componentData && (
          <div className="px-4 xl:px-12 pt-2">
            <div
              className="rounded-[12px] md:rounded-[24px] bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA] py-12"
              style={{
                background:
                  ' linear-gradient(270deg, #F0EFFA 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
              }}
            >
              <HeroSection
                data={pageData['home-hero']?.componentData}
                refer={refer}
                page="home"
              />
            </div>
          </div>
        )}

        {/* Logo Slider Section */}
        {pageData['logo-listing']?.componentData && (
          <LogoSliderSection
            data={pageData['logo-listing']?.componentData?.blocksListingData}
            refer={refer}
          />
        )}

        {/* Vertical Testimonial Listing */}
        {pageData['testimonial-video-section']?.componentData?.refData
          ?.testimonialListing && (
          <VerticalTestimonialListing
            data={
                pageData['testimonial-video-section']?.componentData?.refData
                  ?.testimonialListing
            }
          />
        )}

        {/* Testimonials Section */}
        {pageData['testimonial-category-section']?.componentData?.refData
          ?.tabsListingComponent && (
          <Testimonials
            data={
              pageData['testimonial-category-section']?.componentData?.refData
                ?.tabsListingComponent
            }
          />
        )}

        {/* Card Listing / Business Outcomes */}
        {pageData['business-outcomes']?.componentData?.refData
          ?.tabsListingComponent && (
          <CardListing
            data={
              pageData['business-outcomes']?.componentData?.refData
                ?.tabsListingComponent
            }
          />
        )}

        {/* Category Feature Tabs */}
        {featuresData && <CategoryFeatureTabs features={featuresData || []} />}

        {comparisonLegendData && (
          <SiteComparisonSection
            data={comparisonSectionData}
            legendData={comparisonLegendData}
            refer={refer}
          />
        )}

        {/* Statistics Section */}
        <StatisticsSection />

        {/* Logo Listing Section */}
        {pageData['logo-listing']?.componentData && (
          <LogoListingSection
            data={pageData['logo-listing']?.componentData?.blocksListingData}
            refer={refer}
          />
        )}

        {/* FAQ Section */}
        {faq && <FaqSection faqItems={faq} />}
      </div>
    </Track>
  )
}
