import siteConfig from '~/resources-config/siteConfig';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';

import Pagination from '~/resources/components/commonSections/Pagination';
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext';
import { BaseUrlProvider } from '~/resources/components/Context/UrlContext';
import Layout from '~/resources/components/Layout';
import AllcontentSection from '~/resources/components/sections/AllcontentSection';
import BannerSubscribeSection from '~/resources/components/sections/BannerSubscribeSection';
import ContentHub from '~/resources/contentUtils/ContentHub';
import TagSelect from '~/resources/contentUtils/TagSelector';
import { getClient } from '~/resources/lib/sanity.client';
import {
  getArticlesCount,
  getCategories,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPosts,
  getPostsByLimit,
  getTags,
  getWebinarsCount,
  postSlugsQuery,
} from '~/resources/lib/sanity.queries';
import {
  buildResourcesListingUrl,
} from '~/resources/utils/common';
import SEOHead from '~/resources/layout/SeoHead';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const pageNumber = params?.number ? parseInt(params.number as string, 10) : 1;
  const region = params?.locale as string  


  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5;
  const startLimit = (pageNumber - 1) * cardsPerPage;

  // Concurrently fetch data
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
    footerData
  ] = await Promise.all([
    getPostsByLimit(client, startLimit, cardsPerPage,region),
    getPosts(client,undefined,region),
    getTags(client),
    getPodcastsCount(client,region),
    getWebinarsCount(client,region),
    getArticlesCount(client,region),
    getEbooksCount(client,region),
    getHomeSettings(client,region),
    getCategories(client),
    getFooterData(client, region)
  ]);

  const totalPages = Math.ceil(totalPosts.length / cardsPerPage);

  return {
    props: {
      posts,
      tags,
      totalPages,
      currentPage: pageNumber,
      totalPostCount: totalPosts.length,
      homeSettings,
      categories,
      footerData,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
    },
    
  };
};

export const getStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales; 
  const paths = await Promise.all(
    locales.map(async (locale) => {
      const slugs = await client.fetch(postSlugsQuery, { locale });
      const numberOfPosts = slugs.length
      const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
      const numberOfPages = Math.ceil(numberOfPosts / cardsPerPage)
      const pagePaths = []
      for (let i = 2; i <= numberOfPages; i++) {
        pagePaths.push({ params: { number: i.toString(), locale } })
      }

      return pagePaths
    })
  );
  
  return {
    paths: paths.flat(),
    fallback: 'blocking',
  }
}

export default function TagPagePaginated({
  tags,
  posts,
  totalPages,
  currentPage,
  totalPostCount,
  homeSettings,
  categories,
  contentCount,
  footerData
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const locale = (router.query.locale as string) || 'en';

  const baseUrl = `/${siteConfig.paginationBaseUrls.base}`;
  const pageUrl = buildResourcesListingUrl(
    locale,
    siteConfig.paginationBaseUrls.base,
    currentPage > 1 ? currentPage : undefined,
  );

  const handlePageChange = (page: number) => {
    // if (page === 1) {
    //   router.push(baseUrl);
    // } else {
    //   router.push(`${baseUrl}/page/${page}`);
    // }
  };

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          <SEOHead
            title="Topics | VoiceStack® Resources"
            description={
              homeSettings?.topicDescription ||
              'Browse topics and categories from VoiceStack® Resources.'
            }
            keywords="voicestack resources, topics, categories"
            robots="index, follow, archive"
            canonical={pageUrl}
            jsonLD=""
          />
          <ContentHub contentCount={contentCount} />
          <TagSelect tags={tags} tagLimit={5} className="mt-12" />
          <AllcontentSection allItemCount={totalPostCount} allContent={posts} />
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
  );
}
