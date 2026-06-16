import siteConfig from '~/resources-config/siteConfig'
import { GetStaticPaths, GetStaticProps } from 'next'

import Pagination from '~/resources/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/resources/components/Context/UrlContext'
import Layout from '~/resources/components/Layout'
import AllcontentSection from '~/resources/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/resources/components/sections/BannerSubscribeSection'
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
} from '~/resources/lib/sanity.queries'
import ogMetaData from '~/resources-config/ogData.json'
import { SharedPageProps } from '~/resources/pages/_app'
import {
  buildResourcesHomeUrl,
  buildResourcesListingUrl,
} from '~/resources/utils/common'
import { defaultMetaTag } from '~/resources/utils/customHead'

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales
  const paths = await Promise.all(
    locales.map(async (locale) => {
      const articles = await getArticles(client, 0, undefined, locale)
      const totalPages = Math.ceil(
        articles.length / siteConfig.pagination.childItemsPerPage,
      )

      return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
        params: { pageNumber: (i + 2).toString(), locale },
      }))
    }),
  )

  return { paths: paths.flat(), fallback: false }
}

export const getStaticProps: GetStaticProps<SharedPageProps & {}> = async (
  context,
) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const locale = (context.params?.locale as string) || 'en'
  const pageNumber = Number(context.params?.pageNumber) || 1
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const skip = (pageNumber - 1) * itemsPerPage

  try {
    const [articles, totalArticles, homeSettings, siteSettings, categories, footerData] =
      await Promise.all([
        getArticles(client, skip, itemsPerPage, locale),
        getArticlesCount(client, locale),
        getHomeSettings(client, locale),
        getSiteSettings(client),
        getCategories(client),
        getFooterData(client, locale),
      ])

    const totalPages = Math.ceil(totalArticles / itemsPerPage)

    return {
      props: {
        locale,
        draftMode,
        token: draftMode ? readToken : '',
        articles,
        pageNumber,
        totalPages,
        homeSettings,
        siteSettings,
        categories,
        footerData,
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        locale,
        draftMode,
        token: draftMode ? readToken : '',
        articles: [],
        pageNumber: 1,
        totalPages: 1,
        homeSettings: [],
        siteSettings: [],
        categories: [],
        footerData: null,
      },
    }
  }
}

const PaginatedArticlesPage = ({
  locale,
  articles,
  homeSettings,
  pageNumber,
  totalPages,
  siteSettings,
  categories,
  footerData,
}: {
  locale: string
  articles: Articles[]
  homeSettings: any
  pageNumber: number
  totalPages: number
  siteSettings: any[]
  categories: any
  footerData: any
}) => {
  const baseUrl = `/${siteConfig.pageURLs.article}`
  const pageUrl = buildResourcesListingUrl(
    locale,
    siteConfig.pageURLs.article,
    pageNumber,
  )

  const siteSettingWithImage = siteSettings?.find((e: any) => e?.openGraphImage)
  const articleOg = (ogMetaData as Record<string, Record<string, string>>).article

  const hubJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${articleOg?.title || 'Articles'} · Page ${pageNumber}`,
    description: articleOg?.description || '',
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      url: buildResourcesHomeUrl(locale),
      name: 'VoiceStack',
    },
  })

  const handlePageChange = (_page: number) => {}

  return (
    <GlobalDataProvider
      data={categories}
      featuredTags={homeSettings?.featuredTags}
      footerData={footerData}
    >
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {siteSettingWithImage ? (
            defaultMetaTag(siteSettingWithImage, pageUrl)
          ) : (
            <SEOHead
              title={`${articleOg?.title || 'Articles'} · Page ${pageNumber}`}
              description={articleOg?.description || ''}
              keywords={articleOg?.keywords || ''}
              robots="index,follow"
              canonical={pageUrl}
              jsonLD={hubJsonLd}
              contentType="article"
              ogImage={articleOg?.['og:image']}
            />
          )}
          <AllcontentSection
            className={'pb-9'}
            allContent={articles}
            cardType="left-image-card"
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
            contentType="article"
            showCount={true}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={pageNumber}
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

export default PaginatedArticlesPage
