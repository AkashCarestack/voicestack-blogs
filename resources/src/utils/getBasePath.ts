import { NextRouter } from 'next/router'

export const getBasePath = (
  router: NextRouter,
  contentType: string,
): string => {
  const basePaths = {
    podcast: 'podcast',
    article: 'article',
    webinar: 'webinar',
    'press-release': 'press-release',
    ebook: 'ebook',
    'case-study': 'case-study',
  }

  return basePaths[contentType] || ''
}
