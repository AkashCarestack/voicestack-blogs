import Head from 'next/head'
import React from 'react'
import { useAlternatePaths, AlternatePath } from '~/components/utils/alternatePaths'

interface SimpleHeadProps {
  data?: any
  noindex?: boolean
}

export { useAlternatePaths, formatHreflang, removeLocale, buildUrl } from '~/components/utils/alternatePaths'
export type { AlternatePath } from '~/components/utils/alternatePaths'

export default function SimpleHead({ data, noindex = false }: SimpleHeadProps) {
  const { alternatePaths, defaultUrl } = useAlternatePaths();

  const fullTitle = data?.metaTitle ? `${data?.metaTitle}` : 'VoiceStack® | AI Powered Enterprise Phone System'; 
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={data?.metaDescription || 'AI Powered Enterprise Phone System'} />
      {data?.keyWords && <meta name="keywords" content={typeof data?.keyWords === 'string' ? data?.keyWords : data?.keyWords?.join(',')} />}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      {data?.canonical && <link rel="canonical" href={data?.canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:url" content={data?.canonical} />
      <meta property="og:description" content={data?.metaDescription || 'AI Powered Enterprise Phone System'} />
      <meta name="title" content={fullTitle} />
      <meta name="robots" content={data?.disableIndex ? 'noindex, nofollow, noarchive' : 'index, follow'} />


      {/* twitter tags starts here */}


      <meta name="twitter:card" content="summary_large_image"/>
      <meta property="twitter:domain" content="voicestack-sanity-gamma.vercel.app"/>
      {data?.canonical && <meta property="twitter:url" content={data?.canonical}/>}
      {fullTitle && <meta name="twitter:title" content={fullTitle}/>} 
      {data?.metaDescription && <meta name="twitter:description" content={data?.metaDescription}/>}
      {noindex && <meta name="robots" content="noindex, nofollow, noarchive" /> }


      
      
      {alternatePaths.length > 0 && alternatePaths.map((item: AlternatePath) => (
        <link 
          key={item.path} 
          rel="alternate" 
          href={item.path.replace(/\/home$|\/$/, '').replace(/\/$/, '')} 
          hrefLang={item.locale} 
        />
      ))}
      
      {/* x-default link */}
      {defaultUrl && (
        <link 
          rel="alternate" 
          href={defaultUrl.replace(/\/home$|\/$/, '').replace(/\/$/, '')} 
          hrefLang="x-default" 
        />
      )}
    </Head>
  )
}




