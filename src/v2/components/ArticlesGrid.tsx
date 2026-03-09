import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Anchor from '~/components/common/anchor'

interface Article {
  _id: string
  _type?: string
  title?: string
  excerpt?: string
  mainImage?: {
    url?: string
    altText?: string
    metadata?: {
      dimensions?: {
        width?: number
        height?: number
      }
    }
  }
  articleImage?: string | null
  slug?: {
    current?: string
    _type?: string
  }
  contentType?: string
  category?: {
    categoryName?: string
    _id?: string
  }
  body?: Array<{
    _key?: string
    _type?: string
    style?: string
    children?: Array<{
      _key?: string
      _type?: string
      text?: string
      marks?: string[]
    }>
  }>
}

interface ArticlesGridProps {
  articles: Article[]
  limit?: number
}

export default function ArticlesGrid({ articles, limit = 4 }: ArticlesGridProps) {
  if (!articles || articles.length === 0) {
    return null
  }

  // Limit articles to specified number
  const displayArticles = articles.slice(0, limit)

  // Extract title from body blocks if title is not directly available
  const extractTitleFromBody = (body: Article['body']): string => {
    if (!body || !Array.isArray(body) || body.length === 0) {
      return ''
    }

    // Find first block with strong mark (usually the heading)
    const headingBlock = body.find((block: any) =>
      block.children?.some((child: any) => child.marks?.includes('strong'))
    )

    if (headingBlock?.children) {
      return headingBlock.children
        .map((child: any) => child.text || '')
        .join('')
        .trim()
    }

    // Fallback: use first block
    if (body[0]?.children) {
      return body[0].children
        .map((child: any) => child.text || '')
        .join('')
        .trim()
    }

    return ''
  }

  // Get article title
  const getArticleTitle = (article: Article): string => {
    if (article.title) {
      return article.title
    }
    // Fallback to extracting from body
    if (article.body) {
      return extractTitleFromBody(article.body)
    }
    return 'Untitled Article'
  }

  // Get article URL
  const getArticleUrl = (article: Article) => {
    if (article.slug?.current) {
      return `/articles/${article.slug.current}`
    }
    return '#'
  }

  // Get article image
  const getArticleImage = (article: Article) => {
    // Try mainImage.url first
    if (article.mainImage?.url) {
      return article.mainImage.url
    }
    // Fallback to articleImage
    if (article.articleImage) {
      return article.articleImage
    }
    return null
  }

  // Get image alt text
  const getImageAlt = (article: Article): string => {
    if (article.mainImage?.altText) {
      return article.mainImage.altText
    }
    return getArticleTitle(article)
  }

  // Get category name
  const getCategoryName = (article: Article) => {
    if (article.category?.categoryName) {
      return article.category.categoryName
    }
    if (article.contentType) {
      return article.contentType.charAt(0).toUpperCase() + article.contentType.slice(1)
    }
    return 'Article'
  }

  return (
    <div className="bg-gray-950 border-gray-800 border-b border-l-0 border-r-0 border-solid border-t w-full">
      <div className="border-gray-800 border-b-0 border-l border-r border-solid border-t-0 w-full">
        <div className="flex flex-col items-start px-4 py-16 md:px-8 lg:px-[196px] w-full">
          <div className="bg-gray-800 flex flex-col items-start p-px w-full">
            <div className="flex gap-px items-start w-full flex-col md:flex-row">
              {displayArticles.map((article, index) => (
                <div
                  key={article._id || index}
                  className="bg-gray-950 flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-clip pb-6 pt-0 px-0 relative shrink-0 w-full md:w-auto"
                >
                  <Anchor href={getArticleUrl(article)} className="w-full">
                    <div className="aspect-[500/250] overflow-clip relative shrink-0 w-full">
                      {getArticleImage(article) ? (
                        <div className="absolute aspect-[1000/498] bottom-px left-1/2 top-0 translate-x-[-50%] w-full">
                          <Image
                            src={getArticleImage(article)!}
                            alt={getImageAlt(article)}
                            loading="lazy"
                            width={400}
                            height={250}
                            className="object-cover pointer-events-none"
                          />
                        </div>
                      ) : (
                        <div className="absolute aspect-[1000/498] bottom-px left-1/2 top-0 translate-x-[-50%] w-full bg-gray-800" />
                      )}
                    </div>
                    <div className="flex flex-col gap-8 items-start justify-end pb-3 pt-9 lg:px-12 px-6 relative shrink-0 w-full">
                      <div className="flex flex-col gap-1.5 items-start justify-end relative shrink-0 w-full">
                        <div className="flex flex-col items-start pb-px pt-0 px-0 relative shrink-0 w-full">
                          <div className="flex flex-col gap-1 items-start mb-[-1px] relative shrink-0 tracking-normal w-full whitespace-pre-wrap">
                            <p className="font-geist font-normal leading-[24px] relative shrink-0 text-vs-green text-base w-full">
                              {getCategoryName(article)}
                            </p>
                            <p className="font-geist font-medium leading-[28px] relative shrink-0 text-white text-xl w-full">
                              {getArticleTitle(article)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Anchor>
                  <div className="absolute content-stretch flex inset-0 items-start justify-end pointer-events-none">
                    <div className="bg-gray-950 border-gray-800 border-b border-l border-r-0 border-solid border-t-0 flex items-center p-[18px] relative shrink-0 pointer-events-auto">
                      <Anchor href={getArticleUrl(article)} className="flex items-center justify-center">
                        <div className="relative size-5">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                          >
                            <path
                              d="M10 4L10 16M10 4L4 10M10 4L16 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </Anchor>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

