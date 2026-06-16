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
  postSlugsQuery,
} from '~/resources/lib/sanity.queries'
import {
  buildResourcesAbsoluteUrl,
  slugToCapitalized,
} from '~/resources/utils/common'
import { defaultMetaTag } from '~/resources/utils/customHead'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const region = params?.locale as string;
  const pageNumber = params?.number ? parseInt(params.number as string, 10) : 1;

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5;
  const startLimit = (pageNumber - 1) * cardsPerPage;
  const endLimit = startLimit + cardsPerPage;

  const [
    posts,
    totalPosts,
    tags,
    totalPodcasts,
    totalWebinars,
    totalArticles,
    totalEbooks,
    homeSettings,
    categories,
    footerData,
    siteSettings,
  ] = await Promise.all([
    getPostsByLimit(client, startLimit, endLimit, undefined, region),
    getPosts(client, undefined, region),
    getTags(client),
    getPodcastsCount(client, region),
    getWebinarsCount(client, region),
    getArticlesCount(client, region),
    getEbooksCount(client, region),
    getHomeSettings(client, region),
    getCategories(client),
    getFooterData(client, region),
    getSiteSettings(client),
  ])

  return {
    props: {
      locale: region,
      posts,
      tags,
      totalPages: Math.ceil(totalPosts.length / cardsPerPage),
      totalPosts,
      currentPage: pageNumber,
      categories,
      footerData,
      homeSettings,
      siteSettings,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
    },
  }
}

export const getStaticPaths = async () => {
  const client = getClient();
  const locales = siteConfig.locales;

  const paths = (await Promise.all(
    locales.map(async (locale) => {
      const slugs = await client.fetch(postSlugsQuery, { locale });
      const numberOfPages = Math.ceil(slugs.length / siteConfig.pagination.childItemsPerPage || 5);
      return Array.from({ length: numberOfPages - 1 }, (_, i) => ({
        params: { number: (i + 2).toString(), locale },
      }));
    })
  )).flat();

  return {
    paths,
    fallback: 'blocking',
  };
};


export default function TagPagePaginated({
  locale,
  tags,
  posts,
  totalPages,
  currentPage,
  contentCount,
  totalPosts,
  homeSettings,
  categories,
  footerData,
  siteSettings,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const totalCount: any = totalPosts?.length ?? 0

  const baseUrl = `/${siteConfig.paginationBaseUrls.base}`
  const browsePagePath = `${siteConfig.paginationBaseUrls.base}/page/${currentPage}`
  const pageUrl = buildResourcesAbsoluteUrl(locale, browsePagePath)
  const baseSiteSetting = siteSettings?.find((e: any) => e?.openGraphImage)
  const siteSettingForMeta = baseSiteSetting
    ? {
        ...baseSiteSetting,
        siteTitle: `${slugToCapitalized(siteConfig.paginationBaseUrls.base)} · Page ${currentPage}`,
      }
    : null

  const handlePageChange = (page: number) => {
    // if (page === 1) {
    //   router.push(baseUrl)
    // } else {
    //   router.push(`${baseUrl}/page/${page}`)
    // }
  }

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {siteSettingForMeta ? defaultMetaTag(siteSettingForMeta, pageUrl) : null}
          <ContentHub contentCount={contentCount} />
          <TagSelect
            tags={tags}
            tagLimit={5}
            className="mt-12"
            showTags={true}
          />
          <AllcontentSection allItemCount={totalCount} allContent={posts} />
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            enablePageSlug={true}
            content={posts}
            type="customs"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
