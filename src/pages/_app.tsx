/* globals.css */
import '~/styles/global.css'
import '~/resources/styles/global.scss'
import track, { getDeviceData } from 'cs-tracker'
import { GeistSans } from 'geist/font/sans';
import type { AppProps, AppContext } from 'next/app'
import { Inter, Manrope } from 'next/font/google'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { lazy, useEffect, useState } from 'react'

import { cookieSelector } from '~/helpers/cookieSelector'
import BookDemoContextProvider from '~/providers/BookDemoProvider'
import LayoutDataProvider from '~/providers/LayoutDataProvider'
import { PricingModalProvider } from '~/components/common/PricingModalContext'
import { checkCookie, eraseCookie, getCookie } from '~/utils/tracker/cookie'
import { addEvent } from '~/utils/tracker/events'
import { createObservedUser, createSession, createUser, getUserData, TrackUserProvider } from '~/utils/tracker/intitialize'
import { getSession } from '~/utils/tracker/session'
import { getUser } from '~/utils/tracker/user'
import { getClient } from '~/lib/sanity.client'
import { getHeaderData, getFooterData, getALLSiteSettings, getContactData, getDemoFormData, getSchemaData, getFeaturesForLayout } from '~/lib/sanity.queries'
import {
  isResourcesRoute,
  ResourcesApp,
  resourcesGetInitialProps,
} from '~/resources/integration/appBridge'
import Layout from '../components/Layout'
import ProgressLoader from '../components/common/ProgressLoader'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { config } from '~/config/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})


export interface SharedPageProps {
  heroSectionData(heroSectionData: any): any
  integrationPlatforms(integrationPlatforms: any): unknown
  comparisonTableData:any
  draftMode: boolean
  token: string
  layoutData?: {
    schemaData: unknown;
    headerData?: any
    footerData?: any
    siteSettings?: any
    contactData?: any
    featuresData?: any[]
  }
  demoFormData?: any
  region?: string
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'));
const countryCode = getCookie("__vs_ver");


function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { draftMode, token, layoutData, demoFormData, region } = pageProps
  const router = useRouter();
  
  // Check if current page is studio page
  const isStudioPage = router.pathname.startsWith('/studio') || router.pathname.startsWith('/legal');
  
  // Only load GTM on voicestack.com production domain
  const [isVoicestackDomain, setIsVoicestackDomain] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const domain = window.location.origin;
      setIsVoicestackDomain(domain === 'https://voicestack.com' || domain === 'https://www.voicestack.com');
    }
  }, []);
  


  // Global UTM parameter capture - runs on every page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      const utmKeys = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'lead_source'];
      
      // Store UTM params in sessionStorage when present in URL
      // Always update if new UTM params are in the URL (allows updating with new campaign)
      utmKeys.forEach(key => {
        const value = currentParams.get(key);
        if (value) {
          sessionStorage.setItem(key, value);
        }
      });
    }
  }, [router.asPath]); // Run on every route change




  /* ************** posthog Installation code ************** */


  useEffect(() => {
    if (typeof window === 'undefined' || !config.NEXT_PUBLIC_POSTHOG_KEY) return

    const origin = window.location.origin
    const isProduction =
      origin === 'https://voicestack.com' || origin === 'https://www.voicestack.com'
    if (!isProduction) return

    posthog.init(config.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: config.NEXT_PUBLIC_POSTHOG_HOST,
      autocapture: true,
      capture_pageview: true,
    })
  }, [])
  
  return (
    <main id="main" className={`${inter.variable} ${manrope.variable} font-geist ${GeistSans.variable}`}>
      <ProgressLoader />
      <TrackUserProvider>
      {/* <style jsx global>{`
          body {
            font-family: ${inter.style.fontFamily};
          }
          .manrope {
            font-family: ${manrope.style.fontFamily};
          }
        `}</style> */}

        {/* Google Analytics */}

        {/* Start of HubSpot Embed Code */}
        <Script type="text/javascript" 
           id="hs-script-loader" 
           async 
           defer 
           src="//js.hs-scripts.com/4832409.js?businessUnitId=2351862"
          strategy='lazyOnload'
          >
        </Script>
        {/* End of HubSpot Embed Code */}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YY0CHYH7EY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YY0CHYH7EY');
          `}
        </Script>

        {/* Google Tag Manager - only on voicestack.com */}
        {isVoicestackDomain && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KCX7H59S');
            `}
          </Script>
        )}

        {/* Start cookieyes banner */}
        {countryCode && countryCode == "2" && (
          <Script id="cookieyes" strategy="afterInteractive" 
            src="https://cdn-cookieyes.com/client_data/892b60d226bd40003a3303d6/script.js">
          </Script>
        )}    
       

        {/* <!-- Meta Pixel Code --> */}
        <Script
          id="meta-pixel-code"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2084124085767237');
              fbq('track', 'PageView');`
          }}
        >
        </Script>

        <noscript>
          <img height="1" width="1" style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=2084124085767237&ev=PageView&noscript=1"
          />
        </noscript>
        {/* <!-- End Meta Pixel Code --> */}

        {/* LinkedIn Insight Tag */}
        <Script id="linkedin-insight-partner-id" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "8476516";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `}
        </Script>
        <Script id="linkedin-insight-loader" strategy="afterInteractive">
          {`
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=8476516&fmt=gif"
          />
        </noscript>

        {/* Google Tag Manager (noscript) - only on voicestack.com */}
        {isVoicestackDomain && (
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KCX7H59S" height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        )}
      
        {isStudioPage ? (
          // Render studio page without layout
          <Component {...pageProps}/>
        ) : (
          // Render regular pages with layout
          <PricingModalProvider>
            <BookDemoContextProvider initialFormData={demoFormData} region={region || 'en'}>
              <LayoutDataProvider
                initialHeaderData={layoutData?.headerData}
                initialFooterData={layoutData?.footerData}
                initialSiteSettings={layoutData?.siteSettings}
                initialContactData={layoutData?.contactData}
                initialSchemaData={layoutData?.schemaData}
                initialFeaturesData={layoutData?.featuresData}
              >
                {/* <GlobalHead /> */}
                <Layout>
                  {draftMode ? (
                    <PreviewProvider token={token}>
                      <Component {...pageProps}/>
                    </PreviewProvider>
                  ) : (
                    <PostHogProvider client={posthog}>
                      <Component {...pageProps}/>
                    </PostHogProvider>
                  )}
                </Layout>
              </LayoutDataProvider>
            </BookDemoContextProvider>
          </PricingModalProvider>
        )}
      </TrackUserProvider>
     
    </main>
  )
}

// Fetch layout data server-side
App.getInitialProps = async (appContext: AppContext) => {
  const { ctx, Component } = appContext;
  const locale = ctx.locale || ctx.defaultLocale || 'en';
  
  // Call the page's getInitialProps if it exists
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  
  try {
    const client = getClient();
    const [headerData, footerData, siteSettings, contactData, formData, schemaData, featuresData] = await Promise.all([
      getHeaderData(client, locale),
      getFooterData(client, locale),
      client.fetch(getALLSiteSettings(locale)),
      getContactData(client, locale),
      getDemoFormData(client, locale),
      getSchemaData(client, locale),
      getFeaturesForLayout(client, locale)
    ]);

    return {
      pageProps: {
        ...pageProps,
        layoutData: {
          headerData,
          footerData,
          siteSettings,
          contactData,
          schemaData,
          featuresData,
        },
        demoFormData: formData || null,
        region: locale,
      },
    };
  } catch (error) {
    console.error('Error fetching layout data in getInitialProps:', error);
    // Return empty layout data on error - provider will handle fallback
    return {
      pageProps: {
        ...pageProps,
        layoutData: {
          headerData: null,
          footerData: null,
          siteSettings: null,
          contactData: null,
          featuresData: null,
        },
        demoFormData: null,
        region: locale,
      },
    };
  }
};

let trackData: any[] = [];
let isSending = false;
const TrackWrapper = track(
  { app: "voicestack", },
  {
    dispatch: dispatchEvent
  },
  // }
)(App);

function RootApp(props: AppProps<SharedPageProps>) {
  const router = useRouter()
  if (isResourcesRoute(router.pathname)) {
    return <ResourcesApp {...props} />
  }
  return <TrackWrapper {...props} />
}

RootApp.getInitialProps = async (appContext: AppContext) => {
  if (isResourcesRoute(appContext.router.pathname)) {
    return resourcesGetInitialProps(appContext)
  }
  return App.getInitialProps!(appContext)
}

export default RootApp;


function dispatchEvent(data: any) {      
  const cookieAnalytics = cookieSelector(getCookie('cookieyes-consent'),'analytics')
  const countryVersion:any = getCookie("__vs_ver"); 
  const pageVersion:any = getCookie("__cs_pc");       
                
  if((cookieAnalytics && cookieAnalytics !== "yes") && countryVersion == 2 && !(pageVersion === "ph-c")){
    return
  }

  if (checkCookie()) {
    // const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";
    // if (isProduction) {
    const temp = { ...data };
    delete temp.internalData; // deleting because it is using for internal purpose only.
    trackData.push(temp);
    const domain = window.location.origin;
    // if (window !== undefined && trackData.length > 0 && !isSending) {

    
    if (window !== undefined && trackData.length > 0 && !isSending && (domain == "https://voicestack.com" || domain == "https://www.voicestack.com") ) {
      const user = getUser()
      if (user) {

        if (!data.internalData.observedUser) {
          getUserData(user).then(res => {
            if (res) {
              const observedUser = createObservedUser(res)
              data.internalData.setObservedUser(observedUser)
            }
          })
        }
        data.internalData.setUserId(getUser())
        isSending = true
        const session = getSession()
        // If session is not present create
        if (!session) {

          createSession().then(res => {

            if (res) {
              data.internalData.setSessionId(res.sessionId)
              trackData.forEach(item => {
                item.session_id = res?.sessionId;
              })
            }
            setTimeout(() => {
              addEvent(trackData).then((res) => {
                if (res.msg === "success") {
                  trackData = [];
                }
              }).finally(() => { isSending = false });
            }, 1000);
          }).catch(err => {
            console.log(err);

            if (err?.error === "user_key_invalid") {
              eraseCookie('__cs_pv');
              eraseCookie('session');
              isSending = false;
              trackData = [];
              dispatchEvent(data);
            }
          })
        } else {
          setTimeout(() => {
            addEvent(trackData).then((res) => {
              /**
               *  If there is any error occur on session_id or user_id;
               *  or deleted from the database for some reason, we need to create
               * new user. 
               * 
               * the flow will be like this:
               *  posts data -> errored from api (must have response <session|user>_key_invalid)
               *  -> delete cookie of user and session ( if error is in user_id, session_id cookie should be deleted as well.)
               * -> resetting all the settings for dispatchEvent -> recurse dispatchEvent.
               */
              if (res.error) {
                if (res.error === "session_key_invalid") {
                  eraseCookie('session');
                  isSending = false;
                  trackData = [];
                  dispatchEvent(data);
                }
                if (res.error === "user_key_invalid") {
                  eraseCookie('__cs_pv');
                  eraseCookie('session');
                  isSending = false;
                  trackData = [];
                  dispatchEvent(data);
                }
              }
              if (res.msg === "success") {
                trackData = [];
              }
            }).finally(() => {
              isSending = false
            });
          }, 1000);
        }
      } else {
        trackData = []; // emptying the current data for not duplicating from what we already have, (It should only have one data which occur on firs event)
        getDeviceData().then(res => {
          createUser(res).then(res => {
            if (res) {
              const observedUser = createObservedUser(res);
              data.internalData.setObservedUser(observedUser)
              data.internalData.setUserId(res.id);
              dispatchEvent(data);
            }
          })
        })
      }
    }
  }
}
