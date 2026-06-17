import track, { getDeviceData } from 'cs-tracker'
import { GeistSans } from 'geist/font/sans'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Manrope } from 'next/font/google'
import Router, { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { lazy, useEffect, useLayoutEffect } from 'react'

import BookDemoContextProvider from '~/resources/components/Context/BookDemoProvider'
import HeaderContextProvider from '~/providers/HeaderContextProvider'
import LayoutDataProvider from '~/providers/LayoutDataProvider'
import { capturePageview, initPosthog } from '~/resources/helpers/utils'
import { cookieSelector, getResourcesCmsLocale, slugToCapitalized } from '~/resources/utils/common'
import {
  getResourcesPublicPath,
  preserveResourcesPublicUrl,
  schedulePreserveResourcesPublicUrl,
} from '~/resources/utils/resourcesPublicPath'
import { orgSchema, siteLinkSchema } from '~/resources/utils/customHead'
import { checkCookie, eraseCookie, getCookie } from '~/resources/utils/tracker/cookie'
import { addEvent } from '~/resources/utils/tracker/events'
import {
  createObservedUser,
  createSession,
  createUser,
  getUserData,
  TrackUserProvider,
} from '~/resources/utils/tracker/intitialize'
import { getSession } from '~/resources/utils/tracker/session'
import { getUser } from '~/resources/utils/tracker/user'

export interface ResourcesSharedPageProps {
  draftMode?: boolean
  token?: string
  locale?: string
  region?: string
  layoutData?: {
    headerData?: unknown
    footerData?: unknown
    siteSettings?: unknown
    contactData?: unknown
    schemaData?: unknown
    featuresData?: unknown[]
    featureDataWithCategory?: unknown[]
  }
}

const PreviewProvider = lazy(() => import('~/resources/components/PreviewProvider'))

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

function ResourcesApp({
  Component,
  pageProps,
}: AppProps<ResourcesSharedPageProps>) {
  const { draftMode, token, locale: pageLocale, layoutData, region: pageRegion } = pageProps
  const router = useRouter()
  const pathname: any = usePathname()
  const currentWindow = pathname && pathname?.split('/') || []
  const index = pathname?.split('/').length - 1 || 0
  slugToCapitalized(currentWindow[index])

  useLayoutEffect(() => {
    if (!router.isReady) return

    const cmsLocale =
      pageLocale || getResourcesCmsLocale(router) || 'en'

    const expected = getResourcesPublicPath(router, cmsLocale)
    if (expected && typeof window !== 'undefined') {
      const fullExpected =
        expected + window.location.search + window.location.hash
      ;(window as any).__resourcesRegionalUrl = fullExpected
      ;(window as any).__resourcesRestoreRegionalUrl = () => {
        const current =
          window.location.pathname +
          window.location.search +
          window.location.hash
        if (current !== fullExpected) {
          window.history.replaceState(window.history.state, '', fullExpected)
        }
      }
    }

    ;(window as any).__resourcesRestoreRegionalUrl?.()
  }, [router.isReady, router.pathname, router.query, pageLocale])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
    }

    const handleRouteChange = (url: string) => {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'page_view',
          page_path: url,
        })
      }
    }

    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  useEffect(() => {
    if (!router.isReady) return

    const syncPublicUrl = () => {
      const cmsLocale =
        pageLocale || getResourcesCmsLocale(router) || 'en'
      preserveResourcesPublicUrl(router, cmsLocale)
    }

    let cancelSchedule = schedulePreserveResourcesPublicUrl(
      router,
      pageLocale || getResourcesCmsLocale(router),
    )

    const onRouteChange = () => {
      cancelSchedule()
      cancelSchedule = schedulePreserveResourcesPublicUrl(
        router,
        pageLocale || getResourcesCmsLocale(router),
      )
      syncPublicUrl()
    }

    Router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      cancelSchedule()
      Router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [router.isReady, router.pathname, router.query, pageLocale])

  useEffect(() => {
    initPosthog()
    capturePageview()

    const onPosthogRoute = () => capturePageview()
    Router.events.on('routeChangeComplete', onPosthogRoute)
    return () => {
      Router.events.off('routeChangeComplete', onPosthogRoute)
    }
  }, [])

  return (
    <main
      id="main"
      className={`${manrope.variable} font-geist ${GeistSans.variable}`}
    >
      <TrackUserProvider>
        <BookDemoContextProvider>
          <HeaderContextProvider>
            <LayoutDataProvider
              initialHeaderData={layoutData?.headerData}
              initialFooterData={layoutData?.footerData}
              initialSiteSettings={layoutData?.siteSettings}
              initialContactData={layoutData?.contactData}
              initialSchemaData={layoutData?.schemaData}
              initialFeaturesData={layoutData?.featuresData}
              initialFeatureDataWithCategory={layoutData?.featureDataWithCategory}
              initialRegion={pageRegion || pageLocale || 'en'}
            >
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-YY0CHYH7EY"
            strategy="afterInteractive"
          />
          <Script id="resources-google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YY0CHYH7EY');
          `}
          </Script>
          <Script id="resources-google-tag-manager" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KCX7H59S');
          `}
          </Script>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-KCX7H59S"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          <Head>
            <link
              rel="icon"
              href="/resources/favicon-32x32.ico"
              sizes="32x32"
              type="image/png"
            />
            <link
              rel="icon"
              href="/resources/VoiceStack.svg"
              sizes="16x16"
              type="image/png"
            />
            <link
              rel="shortcut icon"
              href="/resources/favicon.ico"
              type="image/x-icon"
            />
          </Head>
          {orgSchema()}
          {siteLinkSchema()}
          {draftMode ? (
            <PreviewProvider token={token}>
              <Component {...pageProps} />
            </PreviewProvider>
          ) : (
            <Component {...pageProps} />
          )}
            </LayoutDataProvider>
          </HeaderContextProvider>
        </BookDemoContextProvider>
      </TrackUserProvider>
    </main>
  )
}

let trackData: any[] = []
let isSending = false

function dispatchEvent(data: any) {
  const cookieAnalytics = cookieSelector(
    getCookie('cookieyes-consent'),
    'analytics',
  )
  const countryVersion: any = getCookie('__cs_ver')
  const pageVersion: any = getCookie('__cs_pc')

  if (
    cookieAnalytics &&
    cookieAnalytics !== 'yes' &&
    countryVersion == 2 &&
    !(pageVersion === 'ph-c')
  ) {
    return
  }

  if (checkCookie()) {
    const temp = { ...data }
    delete temp.internalData
    trackData.push(temp)
    const onResources =
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/resources')

    if (window !== undefined && trackData.length > 0 && !isSending && onResources) {
      const user = getUser()
      if (user) {
        if (!data.internalData.observedUser) {
          getUserData(user).then((res) => {
            if (res) {
              const observedUser = createObservedUser(res)
              data.internalData.setObservedUser(observedUser)
            }
          })
        }
        data.internalData.setUserId(getUser())
        isSending = true
        const session = getSession()
        if (!session) {
          createSession()
            .then((res) => {
              if (res) {
                data.internalData.setSessionId(res.sessionId)
                trackData.forEach((item) => {
                  item.session_id = res?.sessionId
                })
              }
              setTimeout(() => {
                addEvent(trackData)
                  .then((res) => {
                    if (res.msg === 'success') {
                      trackData = []
                    }
                  })
                  .finally(() => {
                    isSending = false
                  })
              }, 1000)
            })
            .catch((err) => {
              if (err?.error === 'user_key_invalid') {
                eraseCookie('__cs_pv')
                eraseCookie('session')
                isSending = false
                trackData = []
                dispatchEvent(data)
              }
            })
        } else {
          setTimeout(() => {
            addEvent(trackData)
              .then((res) => {
                if (res.error) {
                  if (res.error === 'session_key_invalid') {
                    eraseCookie('session')
                    isSending = false
                    trackData = []
                    dispatchEvent(data)
                  }
                  if (res.error === 'user_key_invalid') {
                    eraseCookie('__cs_pv')
                    eraseCookie('session')
                    isSending = false
                    trackData = []
                    dispatchEvent(data)
                  }
                }
                if (res.msg === 'success') {
                  trackData = []
                }
              })
              .finally(() => {
                isSending = false
              })
          }, 1000)
        }
      } else {
        trackData = []
        getDeviceData().then((res) => {
          createUser(res).then((res) => {
            if (res) {
              const observedUser = createObservedUser(res)
              data.internalData.setObservedUser(observedUser)
              data.internalData.setUserId(res.id)
              dispatchEvent(data)
            }
          })
        })
      }
    }
  }
}

const ResourcesTrackWrapper = track(
  { app: 'voicestack' },
  { dispatch: dispatchEvent },
)(ResourcesApp)

export default ResourcesTrackWrapper
