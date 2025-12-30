import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { readToken } from '~/lib/sanity.api'
import {
  getALLSiteSettings,
  getComparisonTableData,
  getFounderDetails,
  getIntegrationList,
  logoSection,
  featureSectionQuery,
  fetchFaq,
  getHeroSectionData,
  getTestimonialSecitonData,
  getCardsSectionData,
  getCsCardsSectionData,
  getTestimonialHighlightSectionData,
  getFooterData,
  getBannerData,
  getHeaderData,
  getContactAndVideoInfo,
} from '~/lib/sanity.queries'
import Layout from '../components/Layout'
import CustomHead from '~/components/common/CustomHead'
import BookDemoContextProvider from '~/providers/BookDemoProvider'
import runQuery from '~/utils/runQuery'
import HeroSection from '~/components/HeroSection'
import FeatureSection from '~/components/features/FeatureSection'
import LogoListingSection from '~/components/LogoListingSection'
import CardsListingSection from '~/components/CardsListingSection'
import Header from '~/components/common/Header'
import AnimatedBeamSection from '~/components/ui/animated/AnimatedBeamSection'
import BannerSection from '~/components/BannerSection'
import SiteComparisonSection from '~/components/SiteComparisonSection'
import LinksCardsSection from '~/components/LinksCardSection'
import Testimonails from '~/components/testimonials/Testimonials'
import FaqSection from '~/components/FaqSection'
import Footer from '~/components/common/Footer'
import { getClient } from '~/lib/sanity.client'
import { isEmpty } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { useTracking } from 'cs-tracker'
import { getParams } from '~/helpers/getQueryParams'
import CsCardsListingSection from '~/components/CsCardsListingSection'
import { useSearchParams } from 'next/navigation'
import TestimonialHighlightSection from '~/components/TestimonialHighlightSection'

export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = false,
}) => {
  const region = locale
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const homeSettings = await getHeaderData(client, region)
  const siteSettings = await runQuery(getALLSiteSettings(region))
  const founderDetails = await runQuery(getFounderDetails(region))
  const comparisonTableData = await getComparisonTableData(client, region)
  const integrationPlatforms = await getIntegrationList(client, region);
  const heroSectionData = await getHeroSectionData(client, region);
  const testimonialSecitonData = await getTestimonialSecitonData(client, region)
  const logoSectionData = await logoSection(client,region);
  const featureSectionData = await featureSectionQuery(client, region);
  const faqSectionData = await fetchFaq(client,region)
  const cardsListingData = await getCardsSectionData(client,region)
  const cSCardsListingData = await getCsCardsSectionData(client,region)
  const testimonialHighlightsData = await getTestimonialHighlightSectionData(client,region)
  const footerData = await getFooterData(client, region)
  const bannerData = await getBannerData(client, region)
  const contactAndVideoData = await getContactAndVideoInfo(client, region)
  
  

  return {
    props: {
      homeSettings,
      siteSettings,
      founderDetails,
      comparisonTableData,
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
      footerData,
      bannerData,
      contactAndVideoData,
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
    logoSectionData,
    featureSectionData,
    integrationPlatforms,
    comparisonTableData,
    faqSectionData,
    cardsListingData,
    cSCardsListingData,
    testimonialHighlightsData,
    footerData,
    bannerData,
    contactAndVideoData
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
    <div className='font-sans'>
      <Layout {...props}>
        <CustomHead {...props} />
        <div className="">
          <Header data ={homeSettings} refer={refer}/>
          <HeroSection data={heroSectionData} refer={refer} video={videoData}/>
          <LinksCardsSection data={linkCardSectionData} />
          <Testimonails data={testimonialSecitonData} refer={refer}/>
          <CardsListingSection data={cardsListingData}/>
          <LogoListingSection data={logoSectionData}  refer={refer}/>
          <FeatureSection data={featureSectionData} refer={refer}/>
          <AnimatedBeamSection data={integrationPlatforms} refer={refer} />
          <CsCardsListingSection data={cSCardsListingData} refer={refer}></CsCardsListingSection>
          <SiteComparisonSection data={comparisonSectionData} refer={refer}/>
          <TestimonialHighlightSection data={testimonialHighlightsData} refer={refer}/>
          <FaqSection data={faqSectionData} mailId={heroSectionData?.contactEmail}/>
          <BannerSection data={bannerData} refer={refer}></BannerSection>
          <Footer data={footerData}></Footer>
        </div>
      </Layout>
      
    </div>
    </Track>
  )
}
