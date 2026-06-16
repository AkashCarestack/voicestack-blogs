import siteConfig from '~/resources-config/siteConfig'
import Head from 'next/head'
import React, { useId } from 'react'

import { getIframeUrl } from '~/resources/components/commonSections/VideoModal'
import { urlForImage } from '~/resources/lib/sanity.image'

import ogMetaData from '~/resources-config/ogData.json'
import organizationSchema from '~/resources-config/organizationSchema.json'
import {
  buildAlternatePathData,
  removeLocale,
} from '~/resources/components/utils/alternatePaths'
import {
  buildResourcesAbsoluteUrl,
  buildResourcesHomeUrl,
  getResourcesSiteOrigin,
  slugToCapitalized,
  sanitizeUrl,
} from '~/resources/utils/common'
import { breadCrumbJsonLd, generateJSONLD } from './generateJSONLD'

const head = (data: any, i: string, id: string = '') => {
  return (
    <Head key={i}>
      <script
        id={id + i}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      ></script>
    </Head>
  )
}

const resourcesHomeUrl = buildResourcesHomeUrl('en')

const siteLink = {
  '@context': 'https://schema.org/',
  '@type': 'WebSite',
  name: 'VoiceStack',
  url: resourcesHomeUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${resourcesHomeUrl}/?s={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export const orgSchema = () => {
  return head(
    organizationSchema,
    Math.log10(Math.random()).toString() + 'randomId',
    'organizationSchema',
  )
}

export const siteLinkSchema = () => {
  return head(
    siteLink,
    Math.log10(Math.random()).toString() + 'randomId1',
    'siteLinkSchema',
  )
}

const CANONICAL_SECTIONS: Record<string, string> = {
  article: siteConfig.pageURLs.article,
  ebook: siteConfig.pageURLs.ebook,
  podcast: siteConfig.pageURLs.podcast,
  caseStudy: siteConfig.pageURLs.caseStudy,
  pressRelease: siteConfig.pageURLs.pressRelease,
  webinar: siteConfig.pageURLs.webinar,
}

const canonicalTag = (type: string) => {
  const section = CANONICAL_SECTIONS[type]
  if (!section) return null

  const { alternatePaths, defaultUrl } = buildAlternatePathData(
    `/${section}`,
    getResourcesSiteOrigin(),
  )
  const canonical =
    alternatePaths.find((alt) => alt.hrefLang === 'en-US')?.href || defaultUrl

  return (
    <>
      <link rel="canonical" href={canonical} id="canonical" />
      {alternatePaths.map((alt) => (
        <link
          key={alt.hrefLang}
          rel="alternate"
          href={alt.href}
          hrefLang={alt.hrefLang}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={defaultUrl} />
    </>
  )
}

/******* custom meta tag  to show og image og url  which ha s no specific data ********** */
export const customMetaTag = (
  type: string,
  showCanonical: boolean = false,
  isPaginatedPage: string = ''
) => {
  if (type) {
    const metaData = ogMetaData[type];
    if (metaData) {
      return (
        <Head>
          {showCanonical && canonicalTag(type)}
          {isPaginatedPage && (
            <>
              <link rel="canonical" href={isPaginatedPage} />
              {/* <link
                rel="alternate"
                href={isPaginatedPage}
                hrefLang="x-default"
              />
              <link rel="alternate" href={isPaginatedPage} hrefLang="en-US" /> */}
            </>
          )}
          {Object.keys(metaData).map((key) =>
            key === 'title' ? (
              <React.Fragment key={key}>
                <title>{metaData[key]}</title>
              </React.Fragment>
            ) : (
              <meta property={key} content={metaData[key]} key={key} />
            ),
          )}
          {Object.keys(metaData).map((key) => (
            <meta property={key} content={metaData[key]} key={key} />
          ))}
        </Head>
      );
    }
  }
  return null;
};

/** Strip origin/locale/resources prefix so paths work with generateHref. */
export function localeNeutralPathFromPageUrl(pageUrl: string, _origin?: string): string {
  let pathname = pageUrl
  try {
    if (pageUrl.includes('://')) {
      pathname = new URL(pageUrl).pathname
    }
  } catch {
    pathname = pageUrl
  }

  const basePath = removeLocale(pathname, siteConfig.locales)
  return basePath === '/' ? '' : basePath.replace(/^\//, '')
}

export const defaultMetaTag = (params: any, pageUrl?: string) => {  
  const defaultTitle = params?.siteTitle?.trim() || 'Resources | On-Demand Learning Resources | VoiceStack®'
  const defaultDescription = params?.siteDescription || 'Whether you\'re looking for e-Books, webinars, podcasts, or articles, VoiceStack® Resources are full of helpful & informative topics to improve your practice.'
  const defaultKeywords = params?.keywords ? params.keywords.reduce((ac: string, reducer: string) => {
    return ac + ',' + reducer
  }) : 'voicestack resources, voicestack articles, voicestack webinars, voicestack blogs'
  const defaultAuthor = 'VoiceStack®'
  const defaultRobots = 'index, follow, archive'
  const sanitizedCanonical = pageUrl?.length ? sanitizeUrl(pageUrl) : ''
  const hreflangPath = sanitizedCanonical
    ? localeNeutralPathFromPageUrl(sanitizedCanonical)
    : ''
  const hreflangData = hreflangPath
    ? buildAlternatePathData(`/${hreflangPath}`, getResourcesSiteOrigin())
    : null

  return (
    <Head key={params?._id}>
      {sanitizedCanonical && hreflangData ? (
        <>
          <link rel="canonical" href={sanitizedCanonical} />
          {hreflangData.alternatePaths.map((alt) => (
            <link
              key={alt.hrefLang}
              rel="alternate"
              href={alt.href}
              hrefLang={alt.hrefLang}
            />
          ))}
          <link
            rel="alternate"
            hrefLang="x-default"
            href={hreflangData.defaultUrl}
          />
        </>
      ) : null}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={sanitizedCanonical || 'https://resources.voicestack.com'} />
      <meta property="twitter:url" content={sanitizedCanonical || 'https://resources.voicestack.com'} />
      <meta property="og:title" content={defaultTitle} />
      <meta property="twitter:title" content={defaultTitle} />
      <title>{slugToCapitalized(defaultTitle)}</title>
      <meta name="description" content={defaultDescription}></meta>
      <meta property="twitter:description" content={defaultDescription} />
      <meta property="og:description" content={defaultDescription}></meta>
      <meta name="keywords" content={defaultKeywords}></meta>
      <meta name="author" content={defaultAuthor}></meta>
      <meta name="robots" content={defaultRobots}></meta>
      {params?.openGraphImage ? (
        <meta
          property="og:image"
          content={urlForImage(params.openGraphImage?.asset?._ref)}
        ></meta>
      ) : (
        <></>
      )}
      {params?.openGraphImage ? (
        <meta property="twitter:image" content={urlForImage(params.openGraphImage?.asset?._ref)} />
      ) : (
        <></>
      )}
    </Head>
  )
}




export const metaTagDataForAuthor = (props: any, pageUrl: string) => {
  return (
    <Head>
      {props?.bio && (
        <>
          <meta property="og:description" content={props?.bio}></meta>
          <meta name="description" content={props?.bio}></meta>
          <meta property="twitter:description" content={props?.bio} />
        </>
      )}
      {pageUrl && (
        <>
          <link rel="canonical" href={pageUrl} key="canonical" />
          {/* <link rel="alternate" href={pageUrl} hrefLang="x-default" />
          <link rel="alternate" href={pageUrl} hrefLang="en-US" /> */}
          <meta property="twitter:url" content={pageUrl} />
        </>
      )}
      {props?.name && (
        <>
          <meta property="og:title" content={props.name}></meta>
          <title>{`${props.name} | Author Profile | VoiceStack`}</title>
          <meta property="twitter:title" content={props?.name} />
        </>
      )}
      {props?.picture && (
        <>
          {' '}
          <meta
            property="og:image"
            content={urlForImage(props?.picture?._id)}
          ></meta>
          <meta
            property="twitter:image"
            content={urlForImage(props?.picture?._id)}
          />
        </>
      )}
      <meta property="twitter:card" content="summary_large_image" />
    </Head>
  )
}

const getLocaleLinks = (url: string, lang: string) => (
  <>
    <link rel="canonical" href={url} />
    <link rel="alternate" href={url} hrefLang="x-default" />
    <link rel="alternate" href={url} hrefLang={lang} />
  </>
);

export const generateMetaData = (params: any, canonicalLink?: string) => {
  if (!params || !canonicalLink) return null;

  const sanitizedCanonical = sanitizeUrl(canonicalLink);
  const hreflangPath = sanitizedCanonical
    ? localeNeutralPathFromPageUrl(sanitizedCanonical)
    : ''
  const hreflangData = hreflangPath
    ? buildAlternatePathData(`/${hreflangPath}`, getResourcesSiteOrigin())
    : null

  return (
    <Head>
      <link rel="canonical" href={sanitizedCanonical} />

      {hreflangData?.alternatePaths.map((alt) => (
        <link
          key={alt.hrefLang}
          rel="alternate"
          href={alt.href}
          hrefLang={alt.hrefLang}
        />
      ))}

      {hreflangData ? (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={hreflangData.defaultUrl}
        />
      ) : null}

      <meta property="twitter:url" content={sanitizedCanonical} />
      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary_large_image" />

      {params?.mainImage && (
        <>
          <meta property="og:image" content={urlForImage(params.mainImage._id)} />
          <meta property="twitter:image" content={urlForImage(params.mainImage._id)} />
        </>
      )}

      {params?.title && (
        <>
          <meta property="og:title" content={params.title} />
          <meta property="twitter:title" content={params.title} />
          <title>{params.title}</title>
        </>
      )}

      {params?.excerpt && (
        <>
          <meta property="twitter:description" content={params.excerpt} />
          <meta property="og:description" content={params.excerpt} />
        </>
      )}
    </Head>
  );
};
export function CustomHead({
  props,
  type = null,
  pageNumber = null,
  paginationType = '',
}: any) {
  const randomId = useId() + Math.log(Math.random())
  const resourcesHome = buildResourcesHomeUrl('en')

  const head = (data: any, i: string, id: string = '') => {
    return (
      <Head key={i}>
        <script
          id={id + randomId}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        ></script>
      </Head>
    )
  }

  const videoObjectJson =(props:any)=>{ 
    const metadata ={
      "@context": "http://schema.org",
      "@type": "VideoObject",
      "name": props?.title,
      "description": props?.excerpt,
      "thumbnailUrl": urlForImage(props?.mainImage?._id),
      "uploadDate": props?.date + "T00:00:00Z",
      "duration": props?.duration,
      // "embedUrl": props?.videos?.map((video:any) => {
      //   return getIframeUrl(video?.platform, video?.videoId)
      // }),
      "contentUrl": props?.videos?.map((video:any) => {
        return getIframeUrl(video?.platform, video?.videoId)
      }),
  
    }
    return metadata
    
  }

  const breadCrumbJson = (data: any) => {
    const metadata = breadCrumbJsonLd(data)
    return (
      <Head>
        <script
          id={'breadcrumb' + randomId}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata) }}
        ></script>
      </Head>
    )
  }

  if (props && type === null) {
    return props?.map((e, i) => {
      const data = generateJSONLD(e)
      return head(e, i)
    })
  } else if (props && type == 'caseStudy') {
    const metaData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': buildResourcesAbsoluteUrl(
          'en',
          `case-study/${props?.slug?.current}`,
        ),
        isPartOf: {
          '@id': resourcesHome,
        },
      },
      headline: [props?.title],
      image: urlForImage(props?.mainImage?._id),
      author: {
        '@type': 'Person',
        name: [
          props?.author?.map((e) => {
            return e.name
          }),
        ],
        url: 'https://voicestack.com',
      },
      dateCreated: props?.date,
      inLanguage: 'en-US',
      copyrightHolder: {
        '@id': 'https://voicestack.com/#organization',
      },
      publisher: {
        '@type': 'Organization',
        name: 'VoiceStack',
        url: 'https://voicestack.com',
      },
    }
    return head(metaData, randomId, type + randomId)
  } else if (props && type === 'articleExpanded' && props?.title) {
    const metaData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      wordcount: props?.estimatedWordCount,
      timeRequired: props?.estimatedReadingTime || props?.duration,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': buildResourcesAbsoluteUrl(
          'en',
          `article/${props?.slug?.current}`,
        ),
        isPartOf: {
          '@id': resourcesHome,
        },
      },
      headline: props?.title ?? '',
      image: [urlForImage(props?.mainImage?._id)],
      author: [
        props?.author?.map((e) => {
          return {
            '@type': 'Person',
            name: e.name,
            url: buildResourcesAbsoluteUrl('en', `author/${e.slug?.current}`),
          }
        }) || null,
      ],
      inLanguage: 'en-US',
      copyrightHolder: {
        '@id': 'https://voicestack.com/#organization',
      },
      publisher: {
        '@type': 'Organization',
        name: 'VoiceStack',
        url: 'https://voicestack.com',
      },
    }
    return head(metaData, randomId, type + randomId)
  } else if (props && type === 'eBook') {
    const metaData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      breadcrumb: `HOME > EBOOK > ${props.slug?.current}`,
      mainEntity: {
        '@type': 'Book',
        author: {
          '@type': 'Person',
          name: props?.author?.map((e) => {
            return e.name
          }),
          abstract: props?.excerpt,
        },
        bookFormat: 'http://schema.org/EBook',
        datePublished: props?.publishedAt ?? null,
        image: urlForImage(props?.mainImage),
        inLanguage: 'English',
        isbn: '00000000',
        numberOfPages: '1234',
        publisher: 'VoiceStack',
        name: props?.title,
        ratingValue: 5,
        aggregateRating: {
          '@type': 'AggregateRating',
          reviewCount: '5',
          name: props?.title,
          ratingValue: 5,
        },
        url: props?.attachment?.asset?.url,
      },
    }
    return head(metaData, randomId, type + randomId)
  } else if (props && type === 'webinar') {
    
    const metaData = [{
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: props.title,
      description: props.excerpt,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      startDate: props?.date,
      endDate: props?.date,

      url: props?.videos?.map((video) => {
        return getIframeUrl(video?.platform, video?.videoId)
      }),
      image: urlForImage(props.mainImage?._id),
      location: {
        '@type': 'VirtualLocation',
        url: props?.videos?.map((video) => {
          return getIframeUrl(video?.platform, video?.videoId)
        }),
      },
      organizer: {
        '@type': 'Organization',
        name: 'VoiceStack',
        url: 'https://voicestack.com',
      },
      performer: {
        '@type': 'Person',
        name: props?.author?.map((e: any) => {
          return e.name
        }),
      },
      offers: {
        '@type': 'Offer',
        url: props?.videos?.map((video) => {
          return getIframeUrl(video?.platform, video?.videoId)
        }),
        availability: 'https://schema.org/InStock',
      },
     
    },
    videoObjectJson(props)
  ]
 
    return head(metaData, randomId, type + randomId)
  } else if (props && type === 'breadCrumbs') {
    return breadCrumbJson(props)
  } else if (props && type === 'pagination') {
    const metaData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      author: {
        '@type': 'Person',
        description: props?.map((ele) => {
          return ele.excerpt
        }),
        name: props?.map((ele) => {
          return ele?.author?.map((a) => a.name)
        }),
        url: 'https://resources.voicestack.com',
      },
      itemListElement: [
        {
          '@type': 'ListItem',
          position: pageNumber ?? 1,
          url:
            props && props[0]
              ? `www.resources.voicestack.com/${props[0]?.contentType}/page/${pageNumber}`
              : 'www.resources.voicestack.com',
        },
      ],
      numberOfItems: 3,
      name: paginationType,
    }
    return head(metaData, randomId, type + randomId)
  } else if (props && type === 'podcast') {
    const metaData = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      performer: props?.author?.map((e) => e?.name)[0],
      name: props?.title,
      location: 'global',
      organizer: 'VoiceStack',
      startDate: new Date(),
      description: props?.excerpt,
      datePublished: props?.publishedAt,
      image: urlForImage(props?.mainImage?._id),
      address: 'VoiceStack',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      author: props?.author?.map((e) => ({
        '@type': 'Person',
        name: e?.name,
        image: e?.picture,
      })),
    }
    return head(metaData, randomId, type + randomId)
  } else if (props && type === 'pressRelease') {
    const metaData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://resources.voicestack.com/press-release',
      },
      headline: props?.title,
      image: urlForImage(props?.mainImage?._id),
      datePublished: new Date(props?.date),
      dateModified: new Date(props?.date),
      author: {
        '@type': 'Person',
        name: props?.author?.map((e) => {
          return e?.name
        }),
      },
      publisher: {
        '@type': 'Organization',
        name: 'VoiceStack',
        logo: {
          '@type': 'ImageObject',
          url: 'https://elitestrategies-elitestrategies.netdna-ssl.com/wp-content/uploads/2013/04/elitestrategies.png',
        },
      },
      description: props?.excerpt,
    }
    return head(metaData, randomId, type + randomId)
  } else if (props && type == 'author') {
    const metaData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      image: urlForImage(props?.picture?._id) || '',
      jobTitle: props?.role || '',
      name: props?.name || '',
      url: buildResourcesHomeUrl('en'),

      description: props?.bio || '',
    }
    return head(metaData, randomId, type + randomId)
  }
}
