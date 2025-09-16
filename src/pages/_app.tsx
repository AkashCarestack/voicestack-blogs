import '~/styles/global.css'

import type { AppProps } from 'next/app'

import { lazy } from 'react'
import Layout from '../components/Layout'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { checkCookie, eraseCookie, getCookie } from '~/utils/tracker/cookie'
import track, { getDeviceData } from 'cs-tracker'
import { createObservedUser, createSession, createUser, getUserData, TrackUserProvider } from '~/utils/tracker/intitialize'
import { addEvent } from '~/utils/tracker/events'
import { getSession } from '~/utils/tracker/session'
import { getUser } from '~/utils/tracker/user'
import { cookieSelector } from '~/helpers/cookieSelector'
import { Inter, Manrope } from 'next/font/google'
import BookDemoContextProvider from '~/providers/BookDemoProvider'
import LayoutDataProvider from '~/providers/LayoutDataProvider'

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
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'));
const countryCode = getCookie("__vs_ver");


function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps
  const router = useRouter();
  return (
    <main className={`${inter.variable} ${manrope.variable} font-sans`}>
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
          id="hs-script-loader" async defer 
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

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KCX7H59S');
          `}
        </Script>

        {/* Start cookieyes banner */}
        {countryCode && countryCode == "2" && (
          <Script id="cookieyes" strategy="afterInteractive" 
            src="https://cdn-cookieyes.com/client_data/892b60d226bd40003a3303d6/script.js">
          </Script>
        )}    

        {/* Meta Pixel Code */}
        <Script id='meta-pixel-code'
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '474197578586490');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Fallback for users with disabled JavaScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=474197578586490&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>

        {/* <!--[BEGIN Google Tag Manager (noscript)]--> */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KCX7H59S" height="0" width="0"
          style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        {/* <!--[END Google Tag Manager (noscript)]--> */}
      
        <BookDemoContextProvider>
          <LayoutDataProvider>
            <Layout>
              {draftMode ? (
                <PreviewProvider token={token}>
                  <Component {...pageProps}/>
                </PreviewProvider>
              ) : (
                <Component {...pageProps}/>
              )}
            </Layout>
          </LayoutDataProvider>
        </BookDemoContextProvider>
      </TrackUserProvider>
    </main>
  )
}

let trackData: any[] = [];
let isSending = false;
const TrackWrapper = track(
  { app: "voicestack", },
  {
    dispatch: dispatchEvent
  },
  // }
)(App);

export default TrackWrapper;


function dispatchEvent(data: any) {      
  const cookieAnalytics = cookieSelector(getCookie('cookieyes-consent'),'analytics')
  const countryVersion:any = getCookie("__cs_ver"); 
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
