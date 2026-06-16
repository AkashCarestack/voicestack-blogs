import siteConfig from '~/resources-config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

import Pagination from '~/resources/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/resources/components/Context/UrlContext'
import Layout from '~/resources/components/Layout'
import AllcontentSection from '~/resources/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/resources/components/sections/BannerSubscribeSection'
import ContentHub from '~/resources/contentUtils/ContentHub'
import TagSelect from '~/resources/contentUtils/TagSelector'
import { Post, Tag } from '~/resources/interfaces/post'
import SEOHead from '~/resources/layout/SeoHead'
import { getClient } from '~/resources/lib/sanity.client'
import {
  getArticlesCount,
  getCategories,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPostsByTag,
  getPostsByTagAndLimit,
  getSiteSettings,
  getTag,
  getTags,
  getWebinarsCount,
  tagsSlugsQuery,
} from '~/resources/lib/sanity.queries'
import { SharedPageProps } from '~/resources/pages/_app'
import {
  buildResourcesAbsoluteUrl,
  buildResourcesHomeUrl,
  getRedirectToHome,
  slugToCapitalized,
} from '~/resources/utils/common'
import { defaultMetaTag } from '~/resources/utils/customHead'

interface Query {
  slug: string
}


export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    tag: Tag
    posts: Post[]
    allTags: Tag[]
    totalPages: number
    contentCount: any
    totalPostCount: number
    siteSettings: any[]
    homeSettings: any
    categories: any
    footerData: any
  }
> = async ({ params }) => {
  const client = getClient()
  const slug = params?.slug as string
  const region = params?.locale as string
  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5

  try {
    const tag = await getTag(client, slug)

    if (!tag) {
      return getRedirectToHome(region)
    }

    const [
      allTags,
      posts,
      allPostsForTag,
      totalPodcasts,
      totalWebinars,
      totalArticles,
      totalEbooks,
      siteSettings,
      homeSettings,
      categories,
      footerData
    ] = await Promise.all([
      getTags(client),
      getPostsByTagAndLimit(client, tag._id, 0, cardsPerPage, region),
      getPostsByTag(client, tag._id, region),
      getPodcastsCount(client, region),
      getWebinarsCount(client, region),
      getArticlesCount(client, region),
      getEbooksCount(client, region),
      getSiteSettings(client),
      getHomeSettings(client, region),
      getCategories(client),
      getFooterData(client, region)
    ])

    const totalPages = Math.ceil(allPostsForTag.length / cardsPerPage)

    return {
      props: {
        locale: region,
        tag,
        allTags,
        totalPages,
        posts,
        draftMode: false,
        token: null,
        totalPostCount: allPostsForTag.length,
        contentCount: {
          podcasts: totalPodcasts,
          webinars: totalWebinars,
          articles: totalArticles,
          ebooks: totalEbooks,
        },
        siteSettings,
        homeSettings,
        categories,
        footerData
      },
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return getRedirectToHome(region)
  }
}

export const getStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales

  try {
    const slugsPromises = locales.map(locale => 
      client.fetch(tagsSlugsQuery, { locale })
        .then(data => data.map((item: { slug: string; locale: string }) => ({
          params: { slug: item.slug, locale: item.locale }
        })))
    )

    const localePaths = await Promise.all(slugsPromises)
    const paths = localePaths.flat()

    return {
      paths,
      fallback: 'blocking', // Allow dynamic generation for tags that exist but weren't pre-generated
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export default function TagPage({
  locale,
  tag,
  posts,
  allTags,
  totalPages,
  contentCount,
  totalPostCount,
  siteSettings,
  homeSettings,
  categories,
  footerData
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const handlePageChange = (page: number) => {
    console.log(`Navigating to page: ${page}`)
  }
  const baseUrl =
    `/${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current}`

  const browsePath = `${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current}`
  const pageUrl = buildResourcesAbsoluteUrl(locale, browsePath)

  const baseSiteSetting = siteSettings?.find((e: any) => e?.openGraphImage)
  const siteSettingForMeta = baseSiteSetting
    ? {
        ...baseSiteSetting,
        siteTitle: slugToCapitalized(tag?.slug?.current),
      }
    : null

  const tagTitle = slugToCapitalized(tag?.slug?.current)
  const browseFallbackJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tagTitle} | VoiceStack Resources`,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      url: buildResourcesHomeUrl(locale),
      name: 'VoiceStack',
    },
  })

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {siteSettingForMeta ? (
            defaultMetaTag(siteSettingForMeta, pageUrl)
          ) : (
            <SEOHead
              title={`${tagTitle} | Browse resources | VoiceStack`}
              description={`Articles and resources tagged ${tagTitle} on VoiceStack.`}
              keywords=""
              robots="index,follow"
              canonical={pageUrl}
              jsonLD={browseFallbackJsonLd}
              contentType="browse"
            />
          )}
          <ContentHub contentCount={contentCount} />
          
          <TagSelect
            tags={allTags}
            tagLimit={5}
            className="mt-12"
            showTags={true}
          />
          <AllcontentSection allItemCount={totalPostCount} allContent={posts} />
          <Pagination
            totalPages={totalPages}
            // baseUrl={`/${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current}`}
            onPageChange={handlePageChange}
            currentPage={1}
            enablePageSlug={true}
            content={posts}
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
