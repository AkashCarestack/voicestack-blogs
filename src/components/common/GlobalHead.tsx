import Head from 'next/head'
import React from 'react'
import { useLayoutData } from '~/providers/LayoutDataProvider'
import { urlForImage } from '~/lib/sanity.image'

/**
 * GlobalHead component - Adds global meta tags that should appear on all pages
 * This is placed inside LayoutDataProvider so it can access siteSettings
 */
export default function GlobalHead() {
  const { siteSettings } = useLayoutData()
  
  return (
    <Head>
      {siteSettings?.ogImage && (
        <meta property="og:image" content={urlForImage(siteSettings.ogImage)} />
      )}
    </Head>
  )
}

