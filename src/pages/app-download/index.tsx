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

 

  return (
    <>
    <Head>
      <title>VoiceStack® | App Download</title>
      <meta name="description"  content="Download the VoiceStack app for your device"></meta>
    </Head>
      <ContentSection slugData={miscellaneousData?.heroSectionSlug?.current} content={miscellaneousData} draftMode={draftMode} token={token}/>
      
    </>
  )
}