// system-requirements/index.tsx
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import Header from '~/components/common/Header'
import type { SanityClient } from 'next-sanity'
import {getMiscellaneousData, getFooterData, getBannerData, getHeaderData, getHeroes, getContactAndVideoInfo } from '~/lib/sanity.queries'
import { getHeroSectionData } from '~/lib/sanity.queries'
import { useContext, useEffect } from 'react'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import Footer from '~/components/common/Footer'
import BannerSection from '~/components/BannerSection'
import ContentSection from '~/components/ContentSection'
import Head from 'next/head'
import { notFound } from 'next/navigation'
import HeroMainSection from '~/components/common/HeroMainSection'

interface PageProps {
  homeSettings: any;
  heroData: any;
  bannerData?: any;
  footerData?: any;
  region: string
  miscellaneousData: any
  draftMode: boolean,
  token: string,
  heroes: any,
  contactAndVideoData: any
}



export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = process.env.NEXT_PUBLIC_NODE_ENV == "development" ? true : false,
}) => {
  const region = locale

  const client = getClient(draftMode ? { token: readToken } : undefined) as SanityClient
  const [heroes, homeSettings, heroData, bannerData, footerData, miscellaneousData,contactAndVideoData] = await Promise.all([
    getHeroes(client, 'system-requirements', region),
    getHeaderData(client, region),
    getHeroSectionData(client, region),
    getBannerData(client, region),
    getFooterData(client, region),
    getMiscellaneousData(client, region),
    getContactAndVideoInfo(client, region)
  ])
  
 if (!miscellaneousData) {
      return {
        notFound: true
      }
  }

  return {
    props: {
      heroes,
      homeSettings,
      heroData,
      region,
      bannerData,
      footerData,
      miscellaneousData,
      contactAndVideoData,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

export default function SystemRequirements({heroes, homeSettings, heroData, bannerData, footerData, region ,miscellaneousData,draftMode,token}: PageProps) {

  console.log(heroes,'heroes');
  
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext);

  useEffect(() => {
    setIsDemoPopUpShown(heroData);
  }, [heroData])

 

  return (
    <>
    <Head>
      <title>VoiceStack® | System Requirements</title>
      <meta name="description"  content="To ensure optimal performance of VoiceStack, your system should meet the following specifications"></meta>
    </Head>
      <Header data={homeSettings} />
      <HeroMainSection data={heroes}></HeroMainSection>
      <ContentSection content={miscellaneousData} draftMode={draftMode} token={token}/>
      <BannerSection data={bannerData} cta></BannerSection>
      <Footer data={footerData}></Footer>
      
    </>
  )
}