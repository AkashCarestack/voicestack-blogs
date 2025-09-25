import { useTracking } from 'cs-tracker'
import { isEmpty } from 'lodash'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

import BannerSection from '~/components/BannerSection'
import CardsListingSection from '~/components/CardsListingSection'
import CustomHead from '~/components/common/CustomHead'
import Header from '~/components/common/Header'
import CsCardsListingSection from '~/components/CsCardsListingSection'
import FaqSection from '~/components/revamp/components/common/components/faqSection'
import FeatureSection from '~/components/features/FeatureSection'
import LinksCardsSection from '~/components/LinksCardSection'
import LogoListingSection from '~/components/LogoListingSection'
import LogoSliderSection from '~/components/LogoSliderSection'
import TablistSection from '~/components/revamp/components/common/TabListing/tablistingSection'
import Testimonials from '~/components/revamp/components/common/Testimonials/Testimonials'
import HeroSection from '~/components/revamp/HeroSection/heroSection'
import Queries from '~/components/revamp/queries'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import TestimonialHighlightSection from '~/components/TestimonialHighlightSection'
import AnimatedBeamSection from '~/components/ui/animated/AnimatedBeamSection'
import VerticalTestimonialListing from '~/components/VerticalTestimonialListing'
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
  getFounderDetails,
  getHeaderData,
  getIntegrationList,
  getTestimonialHighlightSectionData,
  getVerticalTestimonialListing,
  logoSection,
} from '~/lib/sanity.queries'
import BookDemoContextProvider from '~/providers/BookDemoProvider'
import runQuery from '~/utils/runQuery'

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? true : false,

}) => {
  const region = locale

  // revamp queries
  const queries = new Queries('home')
  const fetchTabListingData = new Queries('easily-handle')
  const tabListingData = await fetchTabListingData.getData();
  const heroSectionData = await queries.getHeroData(region);
  const allTabsData = await queries.getAllTabsListingData(region)
  const testimonialSecitonData = allTabsData?.find(item => item.slug === 'testimonial-category-section')?.tabsListingComponent


// old queries
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const homeSettings = await getHeaderData(client, region)
  const siteSettings = await runQuery(getALLSiteSettings(region))
  const founderDetails = await runQuery(getFounderDetails(region))
  const comparisonTableData = await runQuery(getComparisonTableData(region))
  
  const comparisonLegendData = await runQuery(getAllComparisonValues(region))
  const integrationPlatforms = await getIntegrationList(client, region);
  const logoSectionData = await logoSection(client,region);
  const featureSectionData = await featureSectionQuery(client, region);
  const faqSectionData = await fetchFaq(client,region)
  const cardsListingData = await getCardsSectionData(client,region)
  const cSCardsListingData = await getCsCardsSectionData(client,region)
  const testimonialHighlightsData = await getTestimonialHighlightSectionData(client,region)
  const bannerData = await getBannerData(client, region)
  const contactAndVideoData = await getContactAndVideoInfo(client, region)
  const verticalTestimonialData = await getVerticalTestimonialListing(client, region)

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
      faqSectionData,
      cardsListingData,
      cSCardsListingData,
      testimonialHighlightsData,
      bannerData,
      contactAndVideoData,
      verticalTestimonialData,
      tabListingData,
    },
    revalidate: 60
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
    verticalTestimonialData,
    tabListingData,
  } = props

  const comparisonSectionData = {
    strip:
      'The Best-in-Class Phone System. For the Best-in-Class Dental Practices.',
    header:
      'No other phone system can match VoiceStack’s AI-driven features,outcome-driven workflows and integration capabilities, as shown in the comparison chart below. ',
    columnDimensionName: 'Features',
    table: comparisonTableData,
  }
  const linkCardSectionData: any = heroSectionData?.heroSubFeature;
  const videoData = contactAndVideoData?.video;
  

  return (
    <Track>
      <CustomHead {...props} />
      <div className="">
        <HeroSection data={heroSectionData} refer={refer} video={videoData} page='home'/>
        <LogoSliderSection data={logoSectionData}  refer={refer}/>
        <VerticalTestimonialListing data={verticalTestimonialData}  refer={refer}/>
        <Testimonials data={testimonialSecitonData} refer={refer}/>
        {/* <FeatureSection data={featureSectionData} refer={refer}/> */}
        {/* tablisting section */}
        <TablistSection data={tabListingData}/>
        {/* <AnimatedBeamSection data={integrationPlatforms} refer={refer} /> */}
        {/* <CsCardsListingSection data={cSCardsListingData} refer={refer}></CsCardsListingSection> */}
        <SiteComparisonSection data={comparisonSectionData} legendData={comparisonLegendData} refer={refer}/>
        {/* <TestimonialHighlightSection data={testimonialHighlightsData} refer={refer}/> */}
        <LogoListingSection data={logoSectionData}  refer={refer}/>
        <FaqSection faqItems={tabListingData?.faq.faqItems}/>
        {/* <BannerSection data={bannerData} refer={refer}></BannerSection>
        <LinksCardsSection data={linkCardSectionData} />
        <CardsListingSection data={cardsListingData}/> */}
        {/* <Footer data={footerData}></Footer> */}
      </div>
    </Track>
  )
}
