import type { AppContext, AppProps } from 'next/app'
import type { ComponentType } from 'react'

import { getClient } from '~/lib/sanity.client'
import {
  getALLSiteSettings,
  getFeaturesForHeaderMenu,
  getFeaturesForLayout,
  getFooterData,
  getHeaderData,
  getSchemaData,
} from '~/lib/sanity.queries'
import ResourcesTrackWrapper from '~/resources/ResourcesRoot'
import { resolveResourcesCmsLocale } from '~/resources/utils/common'

export function isResourcesRoute(pathname: string) {
  return pathname.startsWith('/resources')
}

export const ResourcesApp =
  ResourcesTrackWrapper as ComponentType<AppProps>

export async function resourcesGetInitialProps(appContext: AppContext) {
  const { Component, ctx } = appContext

  let pageProps: Record<string, unknown> = {}
  if (Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(ctx)) || {}
  }

  const locale = resolveResourcesCmsLocale({
    pageLocale: pageProps.locale as string | undefined,
    asPath: ctx.asPath,
    queryLocale: ctx.query?.locale,
    fallbackLocale: ctx.locale || ctx.defaultLocale || 'en',
  })

  try {
    const client = getClient()
    const [
      headerData,
      footerData,
      siteSettings,
      schemaData,
      featuresData,
      featureDataWithCategory,
    ] = await Promise.all([
      getHeaderData(client, locale),
      getFooterData(client, locale),
      client.fetch(getALLSiteSettings(locale)),
      getSchemaData(client, locale),
      getFeaturesForLayout(client, locale),
      getFeaturesForHeaderMenu(client, locale),
    ])

    return {
      pageProps: {
        ...pageProps,
        locale,
        region: locale,
        layoutData: {
          headerData,
          footerData,
          siteSettings,
          contactData: null,
          schemaData,
          featuresData,
          featureDataWithCategory,
        },
      },
    }
  } catch (error) {
    console.error('Error fetching VS layout data for resources:', error)
    return {
      pageProps: {
        ...pageProps,
        locale,
        region: locale,
        layoutData: {
          headerData: null,
          footerData: null,
          siteSettings: null,
          contactData: null,
          schemaData: null,
          featuresData: null,
          featureDataWithCategory: null,
        },
      },
    }
  }
}
