import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import type { SanityClient } from 'next-sanity'
import {getMiscellaneousData, getFooterData, getBannerData, getHeaderData } from '~/lib/sanity.queries'
import { getHeroSectionData } from '~/lib/sanity.queries'
import { useContext, useEffect } from 'react'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import ContentSection from '~/components/ContentSection'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AlternatePath, buildUrl, getSiteBaseUrl, useAlternatePaths } from '~/components/utils/alternatePaths'

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
  }
}

export default function SystemRequirements({ homeSettings, heroData, bannerData, footerData, region ,miscellaneousData,draftMode,token}: PageProps) {


  
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext);

  useEffect(() => {
    setIsDemoPopUpShown(heroData);
  }, [heroData])

  const router = useRouter();
  const notEnGB= router.locale =="en-AU" || router.locale =="en"
  const canonicalUrl = buildUrl('system-requirements', region || router.locale || 'en', getSiteBaseUrl())
  const { alternatePaths, defaultUrl } = useAlternatePaths()
  const  title= notEnGB ? "System Requirements | Requirements For Using VoiceStack®":"System Requirements | Requirements For Using VoiceStack"
  const description = notEnGB ? "View the system requirements for running VoiceStack® at your dental practice. Ensure your hardware & network meet the specs for optimal performance.":"View the system requirements for running VoiceStack at your dental practice. Ensure your hardware & network meet the specs for optimal performance."
 

  return (
    <>
    <Head>
      <title>{title}</title>
      <meta name="title" content={title}/>
      <meta property="og:title" content={title}/>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow, archive" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="description"  content={description}></meta>
      <meta property="og:description" content={description}></meta>
      <meta name="keywords" content="voicestack system requirements, hardware requirements, internet requirements" />
      {alternatePaths.length > 0 && alternatePaths.map((item: AlternatePath) => (
        <link
          key={`${item.locale}-${item.path}`}
          rel="alternate"
          href={item.path}
          hrefLang={item.locale}
        />
      ))}
      {defaultUrl && (
        <link
          rel="alternate"
          href={defaultUrl}
          hrefLang="x-default"
        />
      )}
    </Head>
      <ContentSection content={miscellaneousData} draftMode={draftMode} token={token} slugData={miscellaneousData?.heroSectionSlug?.current}/>
    </>
  )
}