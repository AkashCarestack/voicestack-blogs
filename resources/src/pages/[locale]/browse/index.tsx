import siteConfig from '~/resources-config/siteConfig'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'

import Pagination from '~/resources/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/resources/components/Context/UrlContext'
import Layout from '~/resources/components/Layout'
import AllcontentSection from '~/resources/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/resources/components/sections/BannerSubscribeSection'
import ContentHub from '~/resources/contentUtils/ContentHub'
import TagSelect from '~/resources/contentUtils/TagSelector'
import { getClient } from '~/resources/lib/sanity.client'
import {
  getArticlesCount,
  getCategories,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPosts,
  getPostsByLimit,
  getSiteSettings,
  getTags,
  getWebinarsCount,
} from '~/resources/lib/sanity.queries'
import { buildResourcesAbsoluteUrl } from '~/resources/utils/common'
import { defaultMetaTag } from '~/resources/utils/customHead'

interface Query {
  [key: string]: string
}


export const getStaticPaths: GetStaticPaths = async () => {

  const locales = siteConfig.locales

  const paths = locales.map((locale) => {
    if (locale === 'en') {
      return { params: { slug: '', locale } } 
    } else {
      return { params: { slug: locale, locale } }
    }
  })

  return {
    paths,
    fallback: false, // Changed from 'blocking' to prevent auto-generation
  }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient()
  const region = params?.locale as string
  
  const pageNumber = params?.pageNumber
    ? parseInt(params.pageNumber as string, 10)
    : 1

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
  const startLimit = (pageNumber - 1) * cardsPerPage

  const [
    tags,
    posts,
    totalPosts,
    siteSettings,
    totalPodcasts,
    totalWebinars,
    totalArticles,
    totalEbooks,
    homeSettings,
    categories,
    footerData
  ] = await Promise.all([
    getTags(client),
    getPostsByLimit(client, startLimit, cardsPerPage,undefined,region),
    getPosts(client,undefined,region),
    getSiteSettings(client),
    getPodcastsCount(client,region),
    getWebinarsCount(client,region),
    getArticlesCount(client,region),
    getEbooksCount(client,region),
    getHomeSettings(client,region),
    getCategories(client),
    getFooterData(client, region)
  ])
  

  const totalPages = Math.ceil(totalPosts.length / cardsPerPage)

  return {
    props: {
      locale: region,
      posts,
      tags,
      totalPages,
      totalPosts,
      categories,
      footerData,
      currentPage: pageNumber,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
      siteSettings: siteSettings,
      homeSettings: homeSettings,
    },
  }
}

export default function ProjectSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps> & {
    posts: any
    totalPages: any
    tags: any
  },
) {
  const {
    locale,
    posts,
    totalPages,
    tags,
    contentCount,
    totalPosts,
    siteSettings,
    homeSettings,
    categories,
    footerData
  } = props
  const totalCount: any = totalPosts.length ?? 0

  const baseUrl = `/${siteConfig.paginationBaseUrls.base}`
  const Url = buildResourcesAbsoluteUrl(
    locale,
    siteConfig.paginationBaseUrls.base,
  )

  const handlePageChange = (page: number) => {
    //   if (page === 1) {
    // 	router.push(baseUrl);
    //   } else {
    // 	router.push(`${baseUrl}/page/${page}`);
    //   }
  }
  const siteSettingWithImage = siteSettings?.find((e: any) => e?.openGraphImage)
  

  return (
    <>
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
        <BaseUrlProvider baseUrl={baseUrl}>
          <Layout>
            {siteSettingWithImage ? (
              defaultMetaTag(siteSettingWithImage,Url)
            ) : (
              <></>
            )}
            <ContentHub contentCount={contentCount} />
            <TagSelect tags={tags} tagLimit={5} showTags={true} />
            <AllcontentSection allItemCount={totalCount} allContent={posts} />
            <Pagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
              currentPage={0}
              enablePageSlug={true}
            />
            <BannerSubscribeSection />
          </Layout>
        </BaseUrlProvider>
      </GlobalDataProvider>
    </>
  )
}
