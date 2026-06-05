import { useTracking } from 'cs-tracker';
// import { useBlokComponent } from '~/helpers/blokComponentContext';
// import { useBlok } from '~/helpers/blokContext';
import { getCssSelectorShort } from '~/helpers/createCSSSelector';
import generateButtonId from '~/helpers/generateButtonId';
import { getParams, getQueryParamFromLink } from '~/helpers/getQueryParams';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { getCookie } from '~/utils/tracker/cookie';
import { useTrackUser } from '~/utils/tracker/intitialize';
import { capturePosthogEvent } from '../utils/common';


interface CustomLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  passHref?: Boolean;
  prefetch?: boolean;
  locale?: string | false;
  elementId?: string
  replace?: boolean
}

const Anchor: React.FunctionComponent<CustomLinkProps> =
  ({ href, locale, elementId, passHref = true, replace = false, prefetch = true, children, ...rest }) => {

    const router = useRouter();
    const { Track, trackEvent } = useTracking({}, {})
    const [newLink, setNewLink] = useState("#");
    const trackCtx = useTrackUser();
    const [btnId, setBtnId] = useState<any>("");
    const abSegment:any = getCookie("__vs_ver");     

    useEffect(() => {

      const { query } = router

      // Check if destination is a thank-you page
      const hrefPath = href?.split('?')[0].split('#')[0];
      const isThankYouPage = hrefPath?.includes('/thank-you');
      const isDemoDestination =
        hrefPath === '/demo' || (hrefPath?.length > 0 && hrefPath?.endsWith('/demo'));

      const queryParams: Record<string, string> = Object.entries(query).reduce((acc: any, [key, value]) => {
        if (value !== undefined && key !== "flag" && key !== "slug") {
          // Exclude practiceType unless navigating to a thank-you page
          if (key === "practiceType" && !isThankYouPage) {
            return acc;
          }
          // Exclude locations unless navigating to /demo (same idea as practiceType on non-demo pages)
          if (key === "locations" && !isDemoDestination) {
            return acc;
          }
          // Exclude loc unless navigating to /demo (new internal param for demo location bucket)
          if (key === "loc" && !isDemoDestination) {
            return acc;
          }
          acc[key] = value.toString();
        }
        return acc;
      }, {});

      // Get the existing URL parameters from href
      const existingParams = href?.includes('?') ? href.split('?')[1] : '';
      
      // Merge existing parameters with router query params using URLSearchParams to avoid duplicates
      const mergedParams = new URLSearchParams(existingParams);
      
      // Remove practiceType from existing params unless navigating to a thank-you page
      if (!isThankYouPage && mergedParams.has('practiceType')) {
        mergedParams.delete('practiceType');
      }
      if (!isDemoDestination && mergedParams.has('locations')) {
        mergedParams.delete('locations');
      }
      if (!isDemoDestination && mergedParams.has('loc')) {
        mergedParams.delete('loc');
      }
      
      // Add router query params (they will overwrite duplicates)
      Object.entries(queryParams).forEach(([key, value]) => {
        mergedParams.set(key, value);
      });
      
      const updatedParams = mergedParams.toString();
      // Append updated URL params to href
      // if (router.asPath.startsWith("/lp") || router.asPath.startsWith("/uk")) {
      //   setNewLink(`${href}`);
      // } else {
        setNewLink(`${href?.split('?')[0]}${updatedParams.length > 0 ? "?" + updatedParams : ""}`);
      // }
    }, [href, router, trackCtx]);


    
    const dataId = elementId || btnId || '';

    // Extract onClick from rest to prevent it from overriding tracking handler
    // This is the root cause - Button passes onClick which was overriding tracking
    const { onClick: externalOnClick, ...restProps } = rest;

    return (
      <Link {...(dataId && { 'data-elementid': dataId })} href={newLink} locale={locale} replace={replace}
        onClick={(e) => {
          if (newLink === "#") e.preventDefault();
          const element = getCssSelectorShort(e.target as Element);
          let e_name = "";
          const utm_term = getQueryParamFromLink(newLink, 'utm_term');
          
          // Check if this is a demo button link
          const linkPath = newLink.split('?')[0].split('#')[0];
          const isDemoLink = linkPath === '/demo' || linkPath.endsWith('/demo') || linkPath.includes('/pricing/demo');
          
          if (utm_term) {
            e_name = utm_term;
          } else if (isDemoLink) {
            e_name = "demo-button";
          } else {
            if (!newLink.includes('https://')) {
              e_name = (rest.className?.split('_')[0] !== undefined ? `${rest.className?.split('_')[0]}` :
                "internal-link")
            } else {
              e_name = "external-link"
            }
          }
          const {
            utm_source = null,
            utm_content = null,
            utm_campaign = null,
            utm_medium = null,
            ...params
          } = getParams();

          trackEvent({
            e_type: 'click',
            e_name,
            e_time: new Date(),
            element,
            element_id: dataId,
            user_segment:abSegment,
            destination_url: newLink,
            current_path: window.location.href,
            utm_campaign,
            utm_content,
            utm_source,
            utm_term,
            utm_medium,
            url_params: params,
            base_path: window.location.origin + window.location.pathname,
            domain: window.location.origin,
            referrer_url: window.document.referrer
          });
          capturePosthogEvent('button_click', {
            e_name,
            e_type: 'click',
            e_time: new Date(),
            element,
            element_id: dataId,
            user_segment:abSegment,
            destination_url: newLink,
            current_path: window.location.href,
            utm_campaign,
            utm_content,
            utm_source,
            utm_term,
            utm_medium,
            url_params: params,
            base_path: window.location.origin + window.location.pathname,
            domain: window.location.origin,
            referrer_url: window.document.referrer
          })

          // Call external onClick if provided (from Button component, etc.)
          // This ensures both tracking AND button's onClick work
          if (externalOnClick) {
            externalOnClick(e);
          }
        }}  {...restProps} passHref /*{...(prefetch === false ? { prefetch } : {})}*/ prefetch={false}>
        {children}
      </Link>

    )
  };


export default Anchor;