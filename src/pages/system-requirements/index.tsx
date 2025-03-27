// system-requirements/index.tsx
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import Header from '~/components/common/Header'
import type { SanityClient } from 'next-sanity'
import {getMiscellaneousData, getFooterData, getBannerData, getHeaderData } from '~/lib/sanity.queries'
import { getHeroSectionData } from '~/lib/sanity.queries'
import { useContext, useEffect } from 'react'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import Footer from '~/components/common/Footer'
import BannerSection from '~/components/BannerSection'
import ContentSection from '~/components/ContentSection'
import Head from 'next/head'
import { notFound } from 'next/navigation'

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
  const [homeSettings, heroData, bannerData, footerData, miscellaneousData,] = await Promise.all([
    getHeaderData(client, region),
    getHeroSectionData(client, region),
    getBannerData(client, region),
    getFooterData(client, region),
    getMiscellaneousData(client, region)
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
    revalidate: 60
  }
}

export default function SystemRequirements({ homeSettings, heroData, bannerData, footerData, region ,miscellaneousData,draftMode,token}: PageProps) {

  // console.log(miscellaneousData,'miscellaneousData');
  
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
      <ContentSection content={miscellaneousData} draftMode={draftMode} token={token}/>
      <BannerSection data={bannerData}></BannerSection>
      <Footer data={footerData}></Footer>
      
    </>
  )
}