import Head from 'next/head'
import React from 'react'
import { formatOrganizationSchema } from '../utils/common'
import { urlForImage } from '~/lib/sanity.image'

export default function CustomHead(props) {
  const SchemaData = formatOrganizationSchema(props.siteSettings.seoSettings)
  const jsonLdData = props.siteSettings.injectJSONld ? JSON.parse(props.siteSettings.injectJSONld) : null
  

  return (
    <Head>
      <title>VoiceStack® | AI Powered Enterprise Phone System</title>
      <meta name="description"  content={props.siteSettings?.ogDescription}></meta>
      <link rel="icon" href={urlForImage(props.siteSettings?.ogFavicon)} sizes="any" type="image/png"/>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="canonical" href={props?.homeSettings?.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={props.siteSettings?.ogUrl} />
      <meta property="og:title" content={'VoiceStack'} />
      <meta name="title" content='VoiceStack'></meta>
      <meta property="og:description" content={props.siteSettings?.ogDescription} />
      <meta property="og:image" content={urlForImage(props.siteSettings?.ogImage)} />
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        ></script>
      )}
    </Head>
  )
}
