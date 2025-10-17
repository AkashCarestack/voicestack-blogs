import { useTracking } from 'cs-tracker'
import { isEmpty } from 'lodash'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import CustomHead from '~/components/common/CustomHead'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import LogoListingSection from '~/components/LogoListingSection'
import LogoSliderSection from '~/components/LogoSliderSection'
import CardListing from '~/components/revamp/components/cardListing'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import TablistSection from '~/components/revamp/components/common/TabListing/tablistingSection'
import Testimonials from '~/components/revamp/components/common/Testimonials/Testimonials'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import Queries from '~/components/revamp/queries'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import { getParams } from '~/helpers/getQueryParams'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  featureSectionQuery,
  fetchFaq,
  getAllComparisonValues,
  getALLSiteSettings,
  getBannerData,
  getCardsSectionData,
  getComparisonTableData,
  getContactAndVideoInfo,
  getCsCardsSectionData,
  getFeaturesList,
  getFounderDetails,
  getHeaderData,
  getIntegrationList,
  getTestimonialHighlightSectionData,
  logoSection,
} from '~/lib/sanity.queries'
import runQuery from '~/utils/runQuery'

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? true : false,

}) => {
  const region = locale || 'en'

  // revamp queries
  const queries = new Queries('home',region)
  const fetchTabListingData = new Queries('easily-handle',region)
  const homeCardData = await queries.fetchHomeCardData(region)
  const tabListingData = await fetchTabListingData.getData();
  const heroSectionData = await queries.getHeroData(region);
  const verticalTestimonialData = await queries.getVerticalTestimonialListing(region)
  const allTabsData = await queries.getAllTabsListingData(region)
  const testimonialSecitonData = allTabsData?.find(item => item.slug === 'testimonial-category-section')?.tabsListingComponent

// old queries
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const homeSettings = await getHeaderData(client, region)
  const siteSettings = await runQuery(getALLSiteSettings(region))
  const founderDetails = await runQuery(getFounderDetails(region))
  const comparisonTableData = await getComparisonTableData(client, region)
  
  const comparisonLegendData = await getAllComparisonValues()
  const integrationPlatforms = await getIntegrationList(client, region);
  const logoSectionData = await logoSection(client,region);
  const featureSectionData = await featureSectionQuery(client, region);
  const cardsListingData = await getCardsSectionData(client,region)
  const cSCardsListingData = await getCsCardsSectionData(client,region)
  const testimonialHighlightsData = await getTestimonialHighlightSectionData(client,region)
  const bannerData = await getBannerData(client, region)
  const contactAndVideoData = await getContactAndVideoInfo(client, region)
  const faqSectionData = await queries.fetchFaqData('homeSettings',region) || {}
  const featuresData = await getFeaturesList(client, region) || []

  return {
    props: {
      homeSettings,
      siteSettings,
      founderDetails,
      comparisonTableData,
      comparisonLegendData,
      integrationPlatforms,
      draftMode,
      token: draftMode ? readToken : '',
      region,
      heroSectionData,
      logoSectionData,
      featureSectionData,
      testimonialSecitonData,
      verticalTestimonialData,
      faqSectionData,
      cardsListingData,
      cSCardsListingData,
      testimonialHighlightsData,
      bannerData,
      contactAndVideoData,
      tabListingData,
      homeCardData,
      featuresData
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<any>,
) {
  const { Track, trackEvent } = useTracking({ page: "home-page", }, {})
  const searchParams = useSearchParams();
  // const source = searchParams.get("refer"); // Get 'refer' param from URL
  const [refer, setRefer] = useState(null);

  useEffect(() => {
    const sourceParam = searchParams.get("refer");
    setRefer(sourceParam || ""); // Set refer once available
  }, [searchParams]);
  
  const { className, ...rProps} = props
  useEffect(() => {
      const {
        utm_source = null,
        utm_term = null,
        utm_content = null,
        utm_campaign = null,
        utm_medium = null,
        ...params
      } = getParams();
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window) {
        trackEvent({
          e_name: "home-page", e_type: "page-view", e_time: new Date(),
          e_path: window?.location.href,
          utm_campaign,
          utm_content,
          utm_source,
          utm_term,
          utm_medium,
          url_params: params,
          user_segment: "A",
          current_path: window?.location.href,
          base_path: window.location.origin + window.location.pathname,
          domain: window.location.origin,
          referrer_url: window.document.referrer
        })
      }
    }, []);

  if (isEmpty(rProps)) {
    return <><p className="p-5">Loading ... </p></>
  }

  
  const {
    homeSettings,
    heroSectionData,
    testimonialSecitonData,
    verticalTestimonialData,
    logoSectionData,
    featureSectionData,
    integrationPlatforms,
    comparisonTableData,
    comparisonLegendData,
    faqSectionData,
    cardsListingData,
    cSCardsListingData,
    testimonialHighlightsData,
    bannerData,
    contactAndVideoData,
    tabListingData,
    homeCardData,
    featuresData
  } = props

  const comparisonSectionData = {
    strip:
      'The Best-in-Class Phone System. For the Best-in-Class Dental Practices.',
    header:
      'No other phone system can match VoiceStack’s AI-driven features,outcome-driven workflows and integration capabilities, as shown in the comparison chart below. ',
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }
  const videoData = contactAndVideoData?.video;
  

  return (
    <Track>
      <CustomHead {...props} />
      <div className="">
        <HeroSection data={heroSectionData} refer={refer} video={videoData} page='home'/>
        <LogoSliderSection data={logoSectionData}  refer={refer}/>
        <VerticalTestimonialListing data={verticalTestimonialData}/>
        <Testimonials data={testimonialSecitonData} refer={refer}/>
        {/* <FeatureSection data={featureSectionData} refer={refer}/> */}
        {/* tablisting section */}
        {/* <TablistSection data={tabListingData}/> */}
        {homeCardData?.globalDataReference?.tabsListingComponent ? (
          <CardListing data={homeCardData.globalDataReference.tabsListingComponent}/>
        ) : (
          <div className="py-8 bg-yellow-50 border border-yellow-200 rounded-lg mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">CardListing Component</h3>
              <p className="text-yellow-600">No tabsListingComponent data available</p>
              <pre className="mt-4 text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(homeCardData?.globalDataReference, null, 2)}
              </pre>
            </div>
          </div>
        )}
        {/* <AnimatedBeamSection data={integrationPlatforms} refer={refer} /> */}
        {/* <CsCardsListingSection data={cSCardsListingData} refer={refer}></CsCardsListingSection> */}
        <CategoryFeatureTabs features={featuresData || []} />
        <SiteComparisonSection data={comparisonSectionData} legendData={comparisonLegendData} refer={refer}/>
        {/* <TestimonialHighlightSection data={testimonialHighlightsData} refer={refer}/> */}
        <StatisticsSection />
        <LogoListingSection data={logoSectionData}  refer={refer}/>
        <FaqSection faqItems={faqSectionData?.faqReferenced || {}}/>
        {/* <BannerSection data={bannerData} refer={refer}></BannerSection>
        <LinksCardsSection data={linkCardSectionData} />
        <CardsListingSection data={cardsListingData}/> */}
        {/* <Footer data={footerData}></Footer> */}
      </div>
    </Track>
  )
}
