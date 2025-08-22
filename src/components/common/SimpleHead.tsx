import Head from 'next/head'
import React from 'react'

interface SimpleHeadProps {
  title?: string
  description?: string
  canonical?: string
}

export default function SimpleHead({ title, description, canonical }: SimpleHeadProps) {
  const fullTitle = title ? `${title} | VoiceStack®` : 'VoiceStack® | AI Powered Enterprise Phone System'
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'AI Powered Enterprise Phone System'} />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || 'AI Powered Enterprise Phone System'} />
      <meta name="title" content={fullTitle} />
    </Head>
  )
}




