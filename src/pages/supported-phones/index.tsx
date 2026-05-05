  // system-requirements/index.tsx
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import Header from '~/components/common/Header'
import type { SanityClient } from 'next-sanity'
import {getMiscellaneousDataBySlug, getFooterData, getBannerData, getHeaderData } from '~/lib/sanity.queries'
import { getHeroSectionData } from '~/lib/sanity.queries'
import { useContext, useEffect } from 'react'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import Footer from '~/components/common/Footer'
import BannerSection from '~/components/BannerSection'
import ContentSection from '~/components/ContentSection'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { buildUrl, getSiteBaseUrl } from '~/components/utils/alternatePaths'

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
  const slug = 'supported-phones'
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

export default function SupportedPhones({ homeSettings, heroData, bannerData, footerData, region ,miscellaneousData,draftMode,token}: PageProps) {
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext);
  const router = useRouter()
  const canonicalUrl = buildUrl('supported-phones', region || router.locale || 'en', getSiteBaseUrl())

  useEffect(() => {
    setIsDemoPopUpShown(heroData);
  }, [heroData])

 

  return (
    <>
    <Head>
      <title>VoiceStack® | Supported Phones</title>
      <meta name="description"  content="To ensure optimal performance of VoiceStack, your system should meet the following specifications"></meta>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
    </Head>
      <ContentSection content={miscellaneousData} draftMode={draftMode} token={token} slugData="supported-phones"/>
      
    </>
  )
}