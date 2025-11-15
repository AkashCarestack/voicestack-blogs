import Head from 'next/head'
import React from 'react'
import { formatOrganizationSchema } from '../utils/common'
import { urlForImage } from '~/lib/sanity.image'
import { useRouter } from 'next/router';

export default function CustomHead(props) {
  const router = useRouter();
  const SchemaData = formatOrganizationSchema(props.siteSettings.seoSettings)
  const jsonLdData = JSON.parse(props.siteSettings.injectJSONld)
  const homepage = router.pathname === '/'
  

  return (
    <Head>
      <link rel="icon" href={urlForImage(props.siteSettings?.ogFavicon)} sizes="any" type="image/png"/>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      {/* <meta property="og:image" content={urlForImage(props.siteSettings?.ogImage)} /> */}
      {homepage && (
        <>
        <meta name="description"  content={props.siteSettings?.ogDescription}></meta>
        <title>AI-Powered, Enterprise Dental Phone System | VoiceStack®</title>
        <meta property="keywords" content={props.siteSettings.seoSettings?.keyWords?.join(',')} />
        <link rel="canonical" href={props?.siteSettings?.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={props.siteSettings?.ogUrl} />
        <meta property="og:title" content={'VoiceStack'} />
        <meta name="title" content='VoiceStack'></meta>
        <meta property="og:description" content={props.siteSettings?.ogDescription} />
        </>
      )}
      {/* organization schema */}
       {/* <script
        type="application/ld+json"
        id="organization-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      ></script> */}
    </Head>
  )
}
