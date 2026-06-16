const DEFAULT_BASE_URL = 'https://voicestack.com'

export function getSchemaBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '') || DEFAULT_BASE_URL
  )
}

export interface BreadcrumbJsonLdItem {
  label: string
  href: string
}

export function buildBreadcrumbListJsonLd(
  items: BreadcrumbJsonLdItem[],
  baseUrl = getSchemaBaseUrl(),
) {
  const itemListElement = items.map((item, index) => {
    const isLast = index === items.length - 1
    const absoluteHref = item.href.startsWith('http')
      ? item.href.replace(/\/+$/, '')
      : `${baseUrl}${item.href.startsWith('/') ? item.href : `/${item.href}`}`.replace(
          /\/+$/,
          '',
        )

    return isLast
      ? {
          '@type': 'ListItem',
          position: index + 2,
          name: item.label,
        }
      : {
          '@type': 'ListItem',
          position: index + 2,
          name: item.label,
          item: absoluteHref,
        }
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`,
      },
      ...itemListElement,
    ],
  }
}

export function breadCrumbJsonLd(breadCrumbList: Array<{ breadcrumb: string; href: string }>) {
  return buildBreadcrumbListJsonLd(
    breadCrumbList.map((item) => ({
      label: item.breadcrumb,
      href: item.href,
    })),
  )
}

export function faqJsonLd(faqItems: any) {
  let allQuestions: any[] = []

  if (faqItems?.faqCategories && Array.isArray(faqItems.faqCategories)) {
    faqItems.faqCategories.forEach((category: any) => {
      if (category?.questions && Array.isArray(category.questions)) {
        allQuestions = allQuestions.concat(category.questions)
      }
    })
  } else if (Array.isArray(faqItems)) {
    allQuestions = faqItems
  } else if (faqItems?.questions && Array.isArray(faqItems.questions)) {
    allQuestions = faqItems.questions
  }

  const mainEntity = allQuestions
    .map((faq: any) => {
      let questionText = ''
      if (typeof faq.question === 'string') {
        questionText = faq.question
      } else if (faq.headLine) {
        questionText = faq.headLine
      }

      let answerText = ''
      if (typeof faq.answer === 'string') {
        answerText = faq.answer
      } else if (faq.subHeading) {
        answerText = faq.subHeading
      } else if (Array.isArray(faq.answer)) {
        answerText = faq.answer
          .filter((block: any) => block._type === 'block' && block.children)
          .map((block: any) => {
            if (!block.children || !Array.isArray(block.children)) return ''
            return block.children
              .filter((child: any) => child._type === 'span' && child.text)
              .map((child: any) => child.text || '')
              .join('')
          })
          .filter((text: string) => text.trim().length > 0)
          .join(' ')
      }

      if (!questionText || !answerText) {
        return null
      }

      return {
        '@type': 'Question',
        name: questionText,
        text: questionText,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answerText,
        },
      }
    })
    .filter((item: any) => item !== null)

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  }
}

export function personJsonLd(person: any) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: person.headLine,
    image: person?.image?.[0]?.image?.filename,
    jobTitle: person.subHeading,
    worksFor: {
      '@type': 'Organization',
      name: 'VoiceStack',
    },
  }
}

export function blogJsonLd(
  blog: any,
  route: string,
  content: any,
  author?: any,
  tag?: any,
) {
  const basePath = getSchemaBaseUrl()
  const description = `${content[0].content[0].text} ${content[1].content[0].text}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${basePath}${route}`,
      isPartOf: {
        '@id': `${basePath}/#website`,
      },
    },
    headline: blog.headLine,
    description,
    image:
      'https://voicestack.com/assets/schema/schema-logo-voicestack-1200x1200.jpg',
    author: {
      '@type': 'Person',
      name: blog.authorName
        ? blog.authorName
        : author && author.length > 0
          ? author[0].headLine
          : '',
      url:
        blog.authorInfo && blog.authorInfo.full_slug
          ? `${basePath}/${blog.authorInfo.full_slug}`
          : `${basePath}/company/leadership-team`,
    },
    wordCount: blog.wordCount ?? 0,
    keywords: tag && tag.length > 0 ? tag : [],
    dateCreated: blog.date,
    inLanguage: 'en-US',
    copyrightYear: blog.date.split(' ')[2] ?? blog.date.split('-')[0],
    copyrightHolder: {
      '@id': `${basePath}/#organization`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VoiceStack',
      url: basePath,
      logo: {
        '@type': 'ImageObject',
        inLanguage: 'en-US',
        url: 'https://voicestack.com/assets/schema/schema-logo-voicestack-1200x1200.jpg',
        width: 1200,
        height: 1200,
      },
    },
  }
}

export function videoJsonLd(video: any) {
  if (!video) {
    return null
  }

  const videoData = Array.isArray(video) ? video[0] : video

  const {
    videoPlatform,
    videoId,
    speakerName,
    videoDuration,
    videoUploadDate,
    videoTitle,
    videotitle,
    videoDescription,
    thumbnailUrl,
    videoThumbnail,
  } = videoData

  let contentUrl = ''
  let embedUrl = ''
  let thumbnail = thumbnailUrl

  switch (videoPlatform) {
    case 'youtube':
      contentUrl = `https://www.youtube.com/watch?v=${videoId}`
      embedUrl = `https://www.youtube.com/embed/${videoId}`
      if (!thumbnail) {
        thumbnail = `https://i.ytimg.com/vi/${videoId}/0.jpg`
      }
      break
    case 'vimeo':
      contentUrl = `https://vimeo.com/${videoId}`
      embedUrl = `https://player.vimeo.com/video/${videoId}`
      break
    case 'vidyard':
      contentUrl = `https://play.vidyard.com/${videoId}`
      embedUrl = `https://play.vidyard.com/${videoId}`
      break
    default:
      contentUrl = `https://www.youtube.com/watch?v=${videoId}`
      embedUrl = `https://www.youtube.com/embed/${videoId}`
      if (!thumbnail) {
        thumbnail = `https://i.ytimg.com/vi/${videoId}/0.jpg`
      }
  }

  const title = videoTitle || videotitle
  const name =
    title ||
    (speakerName ? `${speakerName} Video Review | VoiceStack®` : 'Video | VoiceStack®')
  const description =
    videoDescription ||
    (speakerName
      ? `${speakerName} provides a video review of their experience with VoiceStack.`
      : 'Video content from VoiceStack.')
  const finalThumbnail =
    thumbnail ||
    (videoThumbnail
      ? typeof videoThumbnail === 'string'
        ? videoThumbnail
        : videoThumbnail.url || videoThumbnail.asset?.url
      : null)

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl: finalThumbnail || thumbnail,
    duration: videoDuration || 'PT5M5S',
    contentUrl,
    embedUrl,
    uploadDate: videoUploadDate || new Date().toISOString().split('T')[0],
  }
}

export function formatWebSiteSchema(baseUrl = getSchemaBaseUrl()) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'VoiceStack',
    url: `${baseUrl}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}
