  // app-download/index.tsx
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import type { SanityClient } from 'next-sanity'
import {getMiscellaneousDataBySlug, getFooterData, getBannerData, getHeaderData } from '~/lib/sanity.queries'
import { getHeroSectionData } from '~/lib/sanity.queries'
import { useContext, useEffect } from 'react'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import BannerSection from '~/components/BannerSection'
import ContentSection from '~/components/ContentSection'
import Head from 'next/head'
import AppDownloadHero from '~/components/dynamic/AppDownloadHero'

interface PageProps {
  homeSettings: any;
  heroData: any;
  bannerData?: any;
  footerData?: any;
  region: string
  miscellaneousData: any
  draftMode: boolean,
  token: string
}



export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = false,
}) => {
  const region = locale

  const client = getClient(draftMode ? { token: readToken } : undefined) as SanityClient
  const slug = 'app-download'
  const [homeSettings, heroData, bannerData, footerData, miscellaneousData,] = await Promise.all([
    getHeaderData(client, region),
    getHeroSectionData(client, region),
    getBannerData(client, region),
    getFooterData(client, region),
    getMiscellaneousDataBySlug(client, slug, region)
  ])
  
 if (!miscellaneousData) {
      return {
        notFound: true
      }
  }

  return {
    props: {
      homeSettings,
      heroData,
      region,
      bannerData,
      footerData,
      miscellaneousData,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

export default function AppDownload({ homeSettings, heroData, bannerData, footerData, region ,miscellaneousData,draftMode,token}: PageProps) {
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext);


  useEffect(() => {
    setIsDemoPopUpShown(heroData);
  }, [heroData])

 const metadescriptn ="Download the Official VoiceStack® App from the Apple App Store for iOS & Google Play for Android. Use VoiceStack® with your mobile phone today!"
 const metaKeywords = "voicestack download, voicestack app, download app, voicestack for ios, voicestack for android, voicestack app store, voicestack google play"

  return (
    <>
    
    <Head>
      <title>Download VoiceStack® | VoiceStack® Mobile App Downloads</title>
      <meta name="title" content="Download VoiceStack® | VoiceStack® Mobile App Downloads" />
      <meta title="Download VoiceStack® | VoiceStack® Mobile App Downloads" />
      <meta name="robots" content="index, follow, archive" />
      <link rel="canonical" href="https://www.voicestack.com/download-app" />
      <meta name="description"  content={metadescriptn}></meta>
      <meta property="og:description" content={metadescriptn}></meta>
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Download VoiceStack® | VoiceStack® Mobile App Downloads" />
      <meta property="og:url" content="https://www.voicestack.com/download-app" />
      <meta name="keywords" content={metaKeywords}></meta>
      <meta name="author" content="VoiceStack®"></meta>
      <meta name="canonical" content="https://voicestack.com/download-app"></meta>
    </Head>
    <AppDownloadHero data={miscellaneousData}/>
      {/* <ContentSection slugData={miscellaneousData?.heroSectionSlug?.current} content={miscellaneousData} draftMode={draftMode} token={token}/> */}
      
    </>
  )
}