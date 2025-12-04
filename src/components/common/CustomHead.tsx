import Head from 'next/head'
import React from 'react'
import { formatOrganizationSchema } from '../utils/common'
import { urlForImage } from '~/lib/sanity.image'
import { useRouter } from 'next/router'
import { useAlternatePaths, AlternatePath } from '~/components/utils/alternatePaths'

export default function CustomHead(props) {
  const router = useRouter();
  const SchemaData = formatOrganizationSchema(props.siteSettings.seoSettings)
  const jsonLdData = props?.siteSettings?.injectJSONld ? JSON?.parse(props?.siteSettings?.injectJSONld) : null
  const homepage = router.pathname === '/'
  const { alternatePaths, defaultUrl } = useAlternatePaths()

  return (
    <Head>
      <link rel="icon" href={urlForImage(props.siteSettings?.ogFavicon)} sizes="any" type="image/png"/>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      {props.siteSettings?.ogImage && (
        <meta property="og:image" content={urlForImage(props.siteSettings?.ogImage)} />
      )}
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
      
      {alternatePaths.length > 0 && alternatePaths.map((item: AlternatePath) => (
        <link 
          key={item.path} 
          rel="alternate" 
          href={item.path.replace(/\/home$|\/$/, '').replace(/\/$/, '')} 
          hrefLang={item.locale} 
        />
      ))}
      
      {/* x-default link - Required for SEO: tells search engines which version to show 
          to users whose language preference doesn't match any available hreflang tags */}
      {defaultUrl && (
        <link 
          rel="alternate" 
          href={defaultUrl.replace(/\/home$|\/$/, '').replace(/\/$/, '')} 
          hrefLang="x-default" 
        />
      )}
      
      {/* organization schema */}
       {/* <script
        type="application/ld+json"
        id="organization-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SchemaData) }}
      ></script> */}
    </Head>
  )
}
