import siteConfig from '~/resources-config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRef } from 'react'

import ImageLoader from '~/resources/components/commonSections/ImageLoader'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/resources/components/Context/UrlContext'
import Layout from '~/resources/components/Layout'
import Section from '~/resources/components/Section'
import AllcontentSection from '~/resources/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/resources/components/sections/BannerSubscribeSection'
import { Author, Post } from '~/resources/interfaces/post'
import Wrapper from '~/resources/layout/Wrapper'
import { readToken } from '~/resources/lib/sanity.api'
import { getClient } from '~/resources/lib/sanity.client'
import {
  authorSlugsQuery,
  getAuthor,
  getauthorRelatedContents,
  getCategories,
  getFooterData,
  getHomeSettings,
  getTags,
} from '~/resources/lib/sanity.queries'
import {
  buildResourcesAbsoluteUrl,
  getRedirectToHome,
  sanitizeUrl,
} from '~/resources/utils/common'
import SEOHead from '~/resources/layout/SeoHead'
import { urlForImage } from '~/resources/lib/sanity.image'

import { SharedPageProps } from '../../_app'

interface Query {
  [key: string]: string
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    locale: string
    author: Author
    relatedContents: Post[]
    tags: any
    homeSettings: any
    categories: any
    footerData: any
  },
  Query
> = async ({ draftMode = false, params = {} }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region = params.locale as string
  let author = await getAuthor(client, params.slug, region)
  if (!author && region !== 'en') {
    author = await getAuthor(client, params.slug, 'en')
    if (author && !draftMode) {
      return {
        redirect: {
          destination: `/resources/author/${params.slug}`,
          permanent: true,
        },
      }
    }
  }
  if (!author) {
    if (!draftMode) return getRedirectToHome(region);
    return { notFound: true };
  }
  const authorId = author?._id
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const relatedContents = await getauthorRelatedContents(client, authorId, undefined,region)  
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)

  if (!author || author.length === 0) {
    if (!draftMode) return getRedirectToHome(region);
    return { notFound: true };
  }


  return {
    props: {
      locale: region,
      draftMode,
      token: draftMode ? readToken : '',
      author,
      relatedContents,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

export const getStaticPaths = async () => {
  const client = getClient()
  const slugs = await client.fetch(authorSlugsQuery, { locale: 'en' })

  const paths = (slugs as { slug: string }[]).map((item) => ({
    params: { slug: item.slug, locale: 'en' },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export default function AuthorPage({
  locale,
  author,
  relatedContents,
  tags,
  homeSettings,
  categories,
  footerData
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if(!author) return null
  const baseUrl = `/${siteConfig.pageURLs.author}`
  const seoTitle = author?.name || 'Author Profile'
  const seoDescription = author?.bio || `Learn more about ${author?.name} and their contributions to VoiceStack.`
  const seoCanonical = buildResourcesAbsoluteUrl(
    'en',
    `${siteConfig.pageURLs.author}/${author?.slug?.current || ''}`,
  )
  const jsonLD = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author?.name,
    "description": author?.bio,
    "image": author?.picture ? urlForImage(author.picture._id) : undefined,
    "url": seoCanonical
  })

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords=""
          robots="index,follow"
          canonical={seoCanonical}
          jsonLD={jsonLD}
          contentType="author"
          ogImage={author?.picture?._id ? urlForImage(author.picture._id) : undefined}
        />
        <Layout>
          <Section className="justify-center">
            <Wrapper className={`flex-col md:pt-headerSpacer pt-headerSpacerMob`}>
              <div className="flex md:flex-row justify-between flex-col gap-8 md:gap-16">
                <div className="md:min-w-[360px] md:h-full min-h-[370px]  ">
                  {author.picture && (
                    <ImageLoader
                      className="object-cover h-full w-full "
                      image={author.picture}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className=" flex flex-col gap-6">
                  <h2 className="md:text-6xl text-2xl text-zinc-900  font-extrabold font-manrope ">
                    {author.name}
                  </h2>
                  <p className="md:text-4xl text-xl text-cs-dark-500 font-manrope font-semibold pb-6 border-b-2 border-cs-darkBlack">
                    {author.role}
                  </p>
                  <p className="max-w-3xl text-xl text-zinc-900  font-normal">
                    {author.bio}
                  </p>
                </div>
              </div>
            </Wrapper>
          </Section>
          {relatedContents && (
            <AllcontentSection
              className={'pb-9'}
              allContent={relatedContents}
              itemsPerPage={6}
              redirect={true}
              authorName={author.name}
            />
          )}
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
