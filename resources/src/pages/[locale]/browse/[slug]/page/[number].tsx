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
} from '~/resources/lib/sanity.queries'
import { SharedPageProps } from '~/resources/pages/_app'
import {
  buildResourcesAbsoluteUrl,
  getRedirectToHome,
  slugToCapitalized,
} from '~/resources/utils/common'
import { defaultMetaTag } from '~/resources/utils/customHead'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    locale: string
    tag: Tag
    posts: Post[]
    allTags: Tag[]
    totalPages: number
    currentPage: number
    contentCount: any
    totalPostCount: any[]
    homeSettings: any
    categories: any
    footerData: any
    siteSettings: any[]
  }
> = async ({ params }) => {
  const client = getClient()

  const slug = params?.slug as string
  const region = params?.locale as string  
  const pageNumber = parseInt(params?.number as string, 10) || 1

  const tag = await getTag(client, slug)
  const allTags = await getTags(client)

  if (!tag) {
    return getRedirectToHome(region)
  }

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
  const startLimit = (pageNumber - 1) * cardsPerPage
  const endLimit = startLimit + cardsPerPage

  const posts = await getPostsByTagAndLimit(
    client,
    tag._id,
    startLimit,
    endLimit,
    region
  )
  const allPostsForTag = await getPostsByTag(client, tag._id,region)
  const totalPages = Math.ceil(allPostsForTag.length / cardsPerPage)

  const totalPodcasts = await getPodcastsCount(client,region)
  const totalWebinars = await getWebinarsCount(client,region)
  const totalArticles = await getArticlesCount(client,region)
  const totalEbooks = await getEbooksCount(client,region)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)
  const siteSettings = await getSiteSettings(client)

  return {
    props: {
      locale: region,
      tag,
      allTags,
      totalPages,
      totalPostCount: allPostsForTag.length,
      posts,
      currentPage: pageNumber,
      draftMode: false,
      token: null,
      homeSettings,
      categories,
      footerData,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
      siteSettings,
    },
  }
}

export const getStaticPaths = async () => {
  const client = getClient()
  const tags = await getTags(client)  
  const locales = siteConfig.locales; 
  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
  
  const paths = []
  
  for (const locale of locales) {
    for (const tag of tags) {
      const posts = await getPostsByTag(client, tag._id, locale)
      const totalPages = Math.ceil(posts.length / cardsPerPage)
  
      for (let i = 2; i <= totalPages; i++) {
        paths.push({ params: { locale, slug: tag.slug.current, number: i.toString() } })
      }
    }
  }

  return {
    paths, 
    fallback: 'blocking', // Allow dynamic generation for tags that exist but weren't pre-generated
  };
}

export default function TagPagePaginated({
  locale,
  tag,
  posts,
  allTags,
  totalPages,
  currentPage,
  contentCount,
  totalPostCount,
  homeSettings,
  categories,
  footerData,
  siteSettings,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const handlePageChange = (page: number) => {
    console.log(`Navigating to page: ${page}`)
  }

  const baseUrl = 
    `/${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current}`;

  const browsePath = `${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current}/page/${currentPage}`
  const pageUrl = buildResourcesAbsoluteUrl(locale, browsePath)
  const baseSiteSetting = siteSettings?.find((e: any) => e?.openGraphImage)
  const siteSettingForMeta = baseSiteSetting
    ? {
        ...baseSiteSetting,
        siteTitle: slugToCapitalized(tag?.slug?.current),
      }
    : null

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {siteSettingForMeta ? defaultMetaTag(siteSettingForMeta, pageUrl) : null}
          <ContentHub contentCount={contentCount} />
          <TagSelect
            tags={allTags}
            tagLimit={5}
            className="mt-12"
          />
          <AllcontentSection allItemCount={totalPostCount} allContent={posts} />
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            enablePageSlug={true}
            content={posts}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
