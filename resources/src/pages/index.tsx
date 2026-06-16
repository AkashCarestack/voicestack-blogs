import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { buildAlternatePathData } from '~/resources/components/utils/alternatePaths'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import Layout from '~/resources/components/Layout'
import { Post } from '~/resources/interfaces/post'
import DynamicPages from '~/resources/layout/DynamicPages'
import { readToken } from '~/resources/lib/sanity.api'
import { getClient } from '~/resources/lib/sanity.client'
import {
  getCategories,
  getEbooks,
  getEventCards,
  getFooterData,
  getHomeSettings,
  getPosts,
  getSiteSettings,
  getTags,
  getTagsByOrder,
  getTestiMonials,
  getWebinars,
} from '~/resources/lib/sanity.queries'
import type { ResourcesSharedPageProps } from '~/resources/ResourcesRoot'
import {
  buildResourcesHomeUrl,
  getResourcesCmsLocale,
  getResourcesSiteOrigin,
} from '~/resources/utils/common'
import { defaultMetaTag } from '~/resources/utils/customHead'

interface IndexPageProps {
  footerData: unknown
  categories: any
  allEventCards: any
  tagsByOrder: any
  webinars: any
  ebooks: any
  siteSettings: any
  contentType: string
  latestPosts: any
  podcastData: any
  draftMode: boolean
  token: string
  posts: Array<Post>
  tags: Array<any>
  testimonials: Array<any>
  homeSettings: any
}

export const getStaticProps: GetStaticProps<
  ResourcesSharedPageProps & { posts: Post[] }
> = async ({ draftMode = false}) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region:any = 'en'; 

  try {
    const [
      latestPosts,
      posts,
      tags,
      tagsByOrder,
      testimonials,
      homeSettings,
      siteSettings,
      ebooks,
      webinars,
      allEventCards,
      categories,
      footerData
    ] = await Promise.all([
      getPosts(client, 5),
      getPosts(client),
      getTags(client),
      getTagsByOrder(client),
      getTestiMonials(client),
      getHomeSettings(client),
      getSiteSettings(client),
      getEbooks(client),
      getWebinars(client),
      getEventCards(client),
      getCategories(client),
      getFooterData(client, region)
    ])

    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        posts,
        latestPosts,
        tags,
        tagsByOrder,
        testimonials,
        homeSettings,
        siteSettings,
        ebooks,
        webinars,
        allEventCards,
        categories,
        footerData
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        posts: [],
        tags: [],
        testimonials: [],
        homeSettings: [],
        ebooks: [],
        webinars: [],
        footerData: [],
        error: true,
      },
    }
  }
}

export default function IndexPage(props: IndexPageProps) {
  const homeSettings = props?.homeSettings
  const latestPosts = props?.latestPosts
  const siteSettings = props?.siteSettings
  const eventCards = props?.allEventCards
  const router = useRouter()
  const cmsLocale = getResourcesCmsLocale(router) || 'en'
  const canonical = buildResourcesHomeUrl(cmsLocale)
  const { alternatePaths, defaultUrl } = buildAlternatePathData(
    '/',
    getResourcesSiteOrigin(),
  )

  return (
    <GlobalDataProvider
      data={props?.categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
      footerData={props?.footerData}
    >
      <Layout>
        {siteSettings?.map((e: any) => {
          return defaultMetaTag(e)
        })}
        <Head>
          <link rel="canonical" href={canonical} key="canonical" />
          {alternatePaths.map((alt) => (
            <link
              key={alt.hrefLang}
              rel="alternate"
              href={alt.href}
              hrefLang={alt.hrefLang}
            />
          ))}
          <link rel="alternate" href={defaultUrl} hrefLang="x-default" />
        </Head>
        <DynamicPages
          posts={props.posts}
          tags={props.tags}
          testimonials={props.testimonials}
          homeSettings={homeSettings}
          podcastData={props?.podcastData}
          latestPosts={latestPosts}
          ebooks={props?.ebooks}
          webinars={props?.webinars}
          eventCards={eventCards}
        />
      </Layout>
    </GlobalDataProvider>
  )
}
