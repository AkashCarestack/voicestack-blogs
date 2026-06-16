import type { AppContext, AppProps } from 'next/app'
import type { ComponentType } from 'react'

import ResourcesTrackWrapper from '~/resources/ResourcesRoot'

export function isResourcesRoute(pathname: string) {
  return pathname.startsWith('/resources')
}

export const ResourcesApp =
  ResourcesTrackWrapper as ComponentType<AppProps>

export async function resourcesGetInitialProps(appContext: AppContext) {
  const { Component, ctx } = appContext
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return { pageProps }
}
