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
import { Webinars } from '~/resources/interfaces/post'
import { readToken } from '~/resources/lib/sanity.api'
import { getClient } from '~/resources/lib/sanity.client'
import {
  getCategories,
  getHomeSettings,
  getTags,
  getWebinars,
  getWebinarsCount,
} from '~/resources/lib/sanity.queries'
import { SharedPageProps } from '~/resources/pages/_app'
import { buildResourcesListingUrl } from '~/resources/utils/common'
import { CustomHead, customMetaTag } from '~/resources/utils/customHead'

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const locales = siteConfig.locales; 
  const paths = await Promise.all(
    locales.map(async (locale) => {
      const webinars = await getWebinars(client, 0, undefined, locale);
      const totalPages = Math.ceil(
        webinars.length / siteConfig.pagination.childItemsPerPage
      );

      return Array.from({ length: totalPages - 1 }, (_, i) => ({
        params: { pageNumber: (i + 2).toString(), locale },
      }));
    })
  );

  return { paths: paths.flat(), fallback: false };
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    webinars: Webinars[]
    pageNumber: number
    totalPages: number
  }
> = async (context) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region =  context.locale; 
  const pageNumber = Number(context.params?.pageNumber) || 1
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const skip = (pageNumber - 1) * itemsPerPage
  const webinars: any = await getWebinars(client, skip, itemsPerPage,region)
  const totalWebinars = await getWebinarsCount(client,region)
  const totalPages = Math.ceil(totalWebinars / itemsPerPage)
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)

  if (!webinars || webinars.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      webinars,
      pageNumber,
      totalPages,
      tags,
      homeSettings,
      categories
    },
  }
}

const PaginatedWebinarsPage = ({
  webinars,
  tags,
  homeSettings,
  pageNumber,
  totalPages,
  categories
}: {
  webinars: Webinars[]
  tags: any
  homeSettings: any
  pageNumber: number
  totalPages: number
  categories: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.webinar}`
  const locale = (router.query.locale as string) || 'en'
  const currentPageUrl = buildResourcesListingUrl(
    locale,
    siteConfig.pageURLs.webinar,
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
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {webinars?.map((e, i) => {
            return <CustomHead props={e} key={i} type="webinar" />
          })}
          {customMetaTag('webinar',false,currentPageUrl)}
          <AllcontentSection
            className={'pb-9'}
            allContent={webinars}
            cardType="left-image-card"
            hideHeader={true}
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            content={webinars}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default PaginatedWebinarsPage
