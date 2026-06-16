import siteConfig from '~/resources-config/siteConfig'
import { GetStaticPaths,GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'

import Pagination from '~/resources/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/resources/components/Context/UrlContext'
import Layout from '~/resources/components/Layout'
import AllcontentSection from '~/resources/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/resources/components/sections/BannerSubscribeSection'
import {  Ebooks } from '~/resources/interfaces/post'
import { readToken } from '~/resources/lib/sanity.api'
import { getClient } from '~/resources/lib/sanity.client'
import {
  getCategories,
  getEbooks,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getTags,
} from '~/resources/lib/sanity.queries'
import { SharedPageProps } from '~/resources/pages/_app'
import { buildResourcesListingUrl } from '~/resources/utils/common'
import { CustomHead, customMetaTag } from '~/resources/utils/customHead'

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const locales = siteConfig.locales; 
  const paths = await Promise.all(
    locales.map(async (locale) => {
      const ebooks = await getEbooks(client, 0, undefined, locale);
      const totalPages = Math.ceil(
        ebooks.length / siteConfig.pagination.childItemsPerPage
      );

      return Array.from({ length: totalPages - 1 }, (_, i) => ({
        params: { pageNumber: (i + 2).toString(), locale },
      }));
    })
  );

  return { paths: paths.flat(), fallback: false };
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & { ebooks: Ebooks[]; pageNumber: number; totalPages: number }
> = async (context) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region =  context.locale; 
  const pageNumber = Number(context.params?.pageNumber) || 1
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const skip = (pageNumber - 1) * itemsPerPage

  const ebooks: any = await getEbooks(client, skip, itemsPerPage,region)
  const totalEbooks = await getEbooksCount(client,region)
  const totalPages = Math.ceil(totalEbooks / itemsPerPage)
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      ebooks,
      pageNumber,
      totalPages,
      homeSettings,
      tags,
      categories,
      footerData
    },
  }
}

const PaginatedEbookPage = ({
  ebooks,
  homeSettings,
  pageNumber,
  totalPages,
  categories,
  footerData,
}: {
  ebooks: Ebooks[]
  tags: any
  pageNumber: number
  homeSettings: any
  totalPages: number
  categories: any
  footerData: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.ebook}`
  const locale = (router.query.locale as string) || 'en'
  const currentPageUrl = buildResourcesListingUrl(
    locale,
    siteConfig.pageURLs.ebook,
    pageNumber,
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
          {ebooks?.map((e, i) => {
            return <CustomHead props={e} type="articleExpanded" key={i} />
          })}
          {customMetaTag('ebook', false, currentPageUrl)}
          <AllcontentSection
            className={'pb-9'}
            allContent={ebooks}
            cardType="left-image-card"
            hideHeader={true}
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
            contentType="ebook"
            showCount={true}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            content={ebooks}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default PaginatedEbookPage
