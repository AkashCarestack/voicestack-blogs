import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import {
  type AlternatePath,
  buildAlternatePathData,
  pathnameForAlternateTags,
} from '~/resources/components/utils/alternatePaths'
import { getResourcesSiteOrigin, sanitizeUrl } from '~/resources/utils/common'

interface SEOHeadProps {
  title: string
  description: string
  keywords: string
  robots: string
  canonical: string
  jsonLD: string
  contentType?: any
  ogImage?: any
  props?: {
    contentType: string
  }
}

export default function SEOHead({
  title,
  description,
  keywords,
  robots,
  canonical,
  jsonLD,
  props,
  ogImage,
}: SEOHeadProps) {
  const router = useRouter()
  const baseUrl = getResourcesSiteOrigin()
  const pathnameForAlternates = useMemo(
    () => pathnameForAlternateTags(router),
    [router],
  )
  const { alternatePaths, defaultUrl } = useMemo(
    () => buildAlternatePathData(pathnameForAlternates, baseUrl),
    [pathnameForAlternates, baseUrl],
  )

  // Default values
  const defaultTitle = title || 'Resources | On-Demand Learning Resources | VoiceStack®'
  const defaultDescription = description || 'Whether you\'re looking for e-Books, webinars, podcasts, or articles, VoiceStack® Resources are full of helpful & informative topics to improve your practice.'
  const defaultKeywords = keywords || 'voicestack resources, voicestack articles, voicestack webinars, voicestack blogs'
  const defaultRobots = robots || 'index, follow, archive'
  const defaultAuthor = 'VoiceStack®'
  const sanitizedCanonical = sanitizeUrl(canonical)

  return (
    <>
      <Head>
        <title>{defaultTitle}</title>
        <meta property="og:title" content={defaultTitle} key="og:title" />
        <meta property="twitter:title" content={defaultTitle} key="twitter:title" />
        <meta name="description" content={defaultDescription} key="description" />
        <meta property="og:description" content={defaultDescription} key="og:description" />
        <meta property="twitter:description" content={defaultDescription} key="twitter:description" />
        <meta name="keywords" content={defaultKeywords} key="keywords" />
        <meta name="robots" content={defaultRobots} key="robots" />
        <meta name="author" content={defaultAuthor} key="author" />
        <link rel="canonical" href={sanitizedCanonical} key="canonical" />
        <meta property="og:url" content={sanitizedCanonical} key="og:url" />
        <meta property="twitter:url" content={sanitizedCanonical} key="twitter:url" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="twitter:card" content="summary_large_image" key="twitter:card" />
        {jsonLD && (
          <script
            type="application/ld+json"
            id={`${props?.contentType ? props.contentType : 'blog'}-jsonLd`}
            dangerouslySetInnerHTML={{ __html: jsonLD }}
          />
        )}
        <meta
          id="ogImage"
          property="og:image"
          content={ogImage || "https://cdn.sanity.io/images/bbmnn1wc/production/b5665765dd8b070505dbabeb87f1fc95536b1a83-1200x1200.jpg"}
          key="ogImage"
        />
        {defaultUrl ? (
          <link rel="alternate" hrefLang="x-default" href={defaultUrl} key="hreflang-x-default" />
        ) : null}
        {alternatePaths.map((alt: AlternatePath) => (
          <link
            rel="alternate"
            hrefLang={alt.hrefLang}
            href={alt.href}
            key={`hreflang-${alt.hrefLang}`}
          />
        ))}
      </Head>
    </>
  )
}
