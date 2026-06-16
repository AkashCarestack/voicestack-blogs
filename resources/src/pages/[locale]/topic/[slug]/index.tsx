import siteConfig from '~/resources-config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

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
  catsSlugsQuery,
  getArticlesCount,
  getCategories,
  getCategory,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPostsByCategoryAndLimit,
  getPostsByTag,
  getSiteSettings,
  getTags,
  getWebinarsCount,
} from '~/resources/lib/sanity.queries'
import {
  buildResourcesAbsoluteUrl,
  getRedirectToHome,
  slugToCapitalized,
} from '~/resources/utils/common'
import { defaultMetaTag } from '~/resources/utils/customHead'

interface Query {
  slug: string
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const slug = params?.slug as string;
  const region = params?.locale as string || 'en';
  
  if (!slug) {
    return getRedirectToHome(region);
  }

  const categoryPromise = getCategory(client, slug);
  const siteSettingsPromise = getSiteSettings(client);
  const homeSettingsPromise = getHomeSettings(client, region);

  const [category, siteSettings, homeSettings] = await Promise.all([
    categoryPromise,
    siteSettingsPromise,
    homeSettingsPromise,
  ]);
  
  if (!category) {
    return getRedirectToHome(region);
  }
  
  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5;

  const [
    categoryPosts,
    allPostsForTag,
    totalPodcasts,
    totalWebinars,
    totalArticles,
    totalEbooks,
    allTags,
    categories,
    footerData
  ] = await Promise.all([
    getPostsByCategoryAndLimit(client, category._id, 0, cardsPerPage, region),
    getPostsByTag(client, category._id, region),
    getPodcastsCount(client, region),
    getWebinarsCount(client, region),
    getArticlesCount(client, region),
    getEbooksCount(client, region),
    getTags(client),
    getCategories(client),
    getFooterData(client, region)
  ]);

  // Filter out categories with no posts for ContentHub
  const allCategoryPosts = await Promise.all(
    categories.map((cat) => getPostsByCategoryAndLimit(client, cat._id, 0, 3, region))
  );
  const categoriesWithPosts = categories.filter((cat, index) => {
    return allCategoryPosts[index] && allCategoryPosts[index].length > 0;
  });

  const totalPages = Math.ceil(allPostsForTag.length / cardsPerPage);

  return {
    props: {
      category,
      categories,
      categoriesWithPosts,
      allTags,
      totalPages,
      categoryPosts,
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
      footerData,
    },
  };
};

export const getStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales

  const slugs = await Promise.all(
    locales.map(async (locale) => {
      const data = await client.fetch(catsSlugsQuery, { locale });
      return data.map((item: any) => ({
        slug: item.slug,
        locale: item.locale
      }));
    })
  );

  return {
    paths: slugs.flat().map((item: any) => ({
      params: { slug: item.slug, locale: item.locale },
    })),
    fallback: 'blocking', // Allow dynamic generation for new categories
  }
}

export default function TagPage({
  category,
  categories,
  categoriesWithPosts,
  categoryPosts,
  allTags,
  totalPages,
  contentCount,
  totalPostCount,
  siteSettings,
  homeSettings,
  footerData
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const locale = (router.query.locale as string) || 'en'

  const handlePageChange = (page: number) => {
    console.log(`Navigating to page: ${page}`)
  }
  const baseUrl =
    `/${siteConfig.categoryBaseUrls.base}/${category?.slug?.current}`;
  const topicPath = `${siteConfig.categoryBaseUrls.base}/${category?.slug?.current}`
  const pageUrl = buildResourcesAbsoluteUrl(locale, topicPath)
  let siteSettingWithImage = siteSettings && siteSettings?.find((e: any) => e?.openGraphImage);

  if (siteSettingWithImage) {
    siteSettingWithImage.siteTitle = slugToCapitalized(category?.slug?.current);
  }


  return (
    <GlobalDataProvider data={categoriesWithPosts} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {siteSettingWithImage ? defaultMetaTag(siteSettingWithImage, pageUrl) : <></>}
          <ContentHub categories={categoriesWithPosts} contentCount={contentCount}   />
          <TagSelect
            tags={allTags}
            tagLimit={5}
            className="mt-12"
          />
          <AllcontentSection  uiType='category' allItemCount={totalPostCount} allContent={categoryPosts} />
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={1}
            enablePageSlug={true}
            content={categoryPosts}
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
