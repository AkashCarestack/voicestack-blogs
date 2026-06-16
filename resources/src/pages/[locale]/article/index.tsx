import siteConfig from '~/resources-config/siteConfig'
import { GetStaticPaths, GetStaticProps } from 'next'

import Pagination from '~/resources/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/resources/components/Context/UrlContext'
import Layout from '~/resources/components/Layout'
import AllcontentSection from '~/resources/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/resources/components/sections/BannerSubscribeSection'
import LatestBlogs from '~/resources/components/sections/LatestBlogSection'
import TagSelect from '~/resources/contentUtils/TagSelector'
import { Articles } from '~/resources/interfaces/post'
import SEOHead from '~/resources/layout/SeoHead'
import { readToken } from '~/resources/lib/sanity.api'
import { getClient } from '~/resources/lib/sanity.client'
import {
  getArticles,
  getArticlesCount,
  getCategories,
  getFooterData,
  getHomeSettings,
  getSiteSettings,
  getTags,
} from '~/resources/lib/sanity.queries'
import ogMetaData from '~/resources-config/ogData.json'
import { SharedPageProps } from '~/resources/pages/_app'
import {
  buildResourcesHomeUrl,
  buildResourcesListingUrl,
  mergeAndRemoveDuplicates,
} from '~/resources/utils/common'
import { defaultMetaTag } from '~/resources/utils/customHead'

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
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<SharedPageProps & {}> = async (
  context,
) => {
  const locale:any = context.params.locale || 'en'; 
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const totalArticles = await getArticlesCount(client,locale)
  const totalPages = Math.ceil(totalArticles / itemsPerPage)
  

  const [articles, latestArticles, tags, homeSettings, siteSettings, categories, footerData] =
    await Promise.all([
      getArticles(client, 0, itemsPerPage, locale),
      getArticles(client, 0, 5, locale),
      getTags(client),
      getHomeSettings(client, locale),
      getSiteSettings(client),
      getCategories(client),
      getFooterData(client, locale),
    ])
  return {
    props: {
      locale,
      draftMode,
      token: draftMode ? readToken : '',
      articles,
      latestArticles,
      totalPages,
      tags,
      siteSettings,
      homeSettings,
      categories,
      footerData,
    },
  }
}

const ArticlesPage = ({
  locale,
  articles,
  latestArticles,
  totalPages,
  tags,
  siteSettings,
  homeSettings,
  categories,
  footerData,
}: {
  locale: string
  articles: Articles[]
  latestArticles: Articles[]
  totalPages: number
  tags: any
  siteSettings?: any[]
  homeSettings?: any
  categories?: any
  footerData?: any
}) => {
  const baseUrl = `/${siteConfig.pageURLs.article}`
  const pageUrl = buildResourcesListingUrl(locale, siteConfig.pageURLs.article)
  const siteSettingWithImage = siteSettings?.find((e: any) => e?.openGraphImage)
  const articleOg = (ogMetaData as Record<string, Record<string, string>>).article
  const hubJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: articleOg?.title || 'Articles | VoiceStack',
    description: articleOg?.description || '',
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      url: buildResourcesHomeUrl(locale),
      name: 'VoiceStack',
    },
  })

  const featuredArticles = homeSettings?.featuredArticle || []

  const latestContents = mergeAndRemoveDuplicates(
    featuredArticles,
    latestArticles,
  )

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
          {siteSettingWithImage ? (
            defaultMetaTag(siteSettingWithImage, pageUrl)
          ) : (
            <SEOHead
              title={articleOg?.title || 'Articles | VoiceStack'}
              description={articleOg?.description || ''}
              keywords={articleOg?.keywords || ''}
              robots="index,follow"
              canonical={pageUrl}
              jsonLD={hubJsonLd}
              contentType="article"
              ogImage={articleOg?.['og:image']}
            />
          )}
          <TagSelect tags={tags} tagLimit={7} />
          <LatestBlogs
            className={'pt-11 pr-9 pb-16 pl-9'}
            reverse={true}
            contents={latestContents}
          />
          <AllcontentSection
            className={'pb-9'}
            allContent={articles}
            hideHeader={true}
            cardType="left-image-card"
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={1}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            content={articles}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default ArticlesPage
