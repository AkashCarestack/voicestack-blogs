import Head from 'next/head'
import React from 'react'

interface SimpleHeadProps {
  data?: any
}

export default function SimpleHead({ data }: SimpleHeadProps) {
  const fullTitle = data?.metaTitle ? `${data?.metaTitle}` : 'VoiceStack® | AI Powered Enterprise Phone System'
  
  console.log(data);
  return (
    
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={data?.metaDescription || 'AI Powered Enterprise Phone System'} />
      {data?.keyWords && <meta name="keywords" content={typeof data?.keyWords === 'string' ? data?.keyWords : data?.keyWords?.join(',')} />}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      {data?.canonical && <link rel="canonical" href={data?.canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={data?.metaDescription || 'AI Powered Enterprise Phone System'} />
      <meta name="title" content={fullTitle} />
    </Head>
  )
}




