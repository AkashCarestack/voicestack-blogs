import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import {
  useAlternatePaths,
  AlternatePath,
  buildUrl,
  getSiteBaseUrl,
  removeLocale,
} from '~/components/utils/alternatePaths'
import siteConfig from 'config/siteConfig'
import { stripTrackingParams, getCleanPath } from '~/helpers/stripTrackingParams'

interface SimpleHeadProps {
  data?: any
  noindex?: boolean
}

export { useAlternatePaths, formatHreflang, removeLocale, buildUrl } from '~/components/utils/alternatePaths'
export type { AlternatePath } from '~/components/utils/alternatePaths'

export default function SimpleHead({ data, noindex = false }: SimpleHeadProps) {
  const router = useRouter()
  const { alternatePaths, defaultUrl } = useAlternatePaths()

  const fullTitle = data?.metaTitle ? `${data?.metaTitle}` : 'VoiceStack® | AI Powered Enterprise Phone System'
  const ogTitle = data?.ogTitle || fullTitle
  const ogDescription = data?.ogDescription || data?.metaDescription || 'AI Powered Enterprise Phone System'

  const locales = siteConfig.locales || ['en', 'en-GB', 'en-AU']
  const baseUrl = getSiteBaseUrl()
  const pathWithoutLocale = removeLocale(
    getCleanPath(router.asPath),
    locales,
  )
  const cleanPath = pathWithoutLocale.replace(/^\//, '')

  const fallbackCanonical = stripTrackingParams(
    buildUrl(cleanPath, router.locale || 'en', baseUrl),
  )
  const canonical = stripTrackingParams(
    data?.canonical ? data.canonical.replace(/\/$/, '') : fallbackCanonical,
  )

  const isIndexable = !noindex && !data?.disableIndex

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={data?.metaDescription || 'AI Powered Enterprise Phone System'} />
      {data?.keyWords && <meta name="keywords" content={typeof data?.keyWords === 'string' ? data?.keyWords : data?.keyWords?.join(',')} />}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      {isIndexable && canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:url" content={canonical || fallbackCanonical} />
      <meta property="og:description" content={ogDescription} />
      {data?.ogImage && <meta property="og:image" content={data.ogImage} />}
      <meta name="robots" content={data?.disableIndex || noindex ? 'noindex, nofollow, noarchive' : 'index, follow'} />

      <meta name="twitter:card" content="summary_large_image"/>
      <meta property="twitter:domain" content="voicestack.com"/>
      {canonical && <meta property="twitter:url" content={canonical}/>}
      {ogTitle && <meta name="twitter:title" content={ogTitle}/>}
      {ogDescription && <meta name="twitter:description" content={ogDescription}/>}
      {data?.ogImage && <meta name="twitter:image" content={data.ogImage} />}


      
      
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
  )
}
