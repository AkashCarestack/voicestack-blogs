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

      const queryParams: Record<string, string> = Object.entries(query).reduce((acc: any, [key, value]) => {
        if (value !== undefined && key !== "slug" && key !== "flag") {
          acc[key] = value.toString();
        }
        return acc;
      }, {});

      const noParams = Object.keys(queryParams).length === 0;
      const urlSearchParams = new URLSearchParams(queryParams);
      // Get the existing URL parameters from href
      const existingParams = href.includes('?') ? href.split('?')[1] : '';

      // Merge existing parameters with updated URL params
      let updatedParams = `${existingParams ? (noParams ? existingParams : existingParams + '&') : ""}${urlSearchParams.toString()}`;
      // Append updated URL params to href
      if (router.asPath.startsWith("/lp") || router.asPath.startsWith("/uk")) {
        setNewLink(`${href}`);
      } else {
        setNewLink(`${href.split('?')[0]}${updatedParams.length > 0 ? "?" + updatedParams : ""}`);
      }
    }, [href, router, trackCtx]);


    
    const dataId = elementId || btnId || '';

    return (
      <Link {...(dataId && { 'data-elementid': dataId })} href={newLink} locale={router.locale} replace={replace}
        onClick={(e) => {
          if (newLink === "#") e.preventDefault();
          const element = getCssSelectorShort(e.target as Element);
          let e_name = "";
          const utm_term = getQueryParamFromLink(newLink, 'utm_term');
          if (utm_term) {
            e_name = utm_term;
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
        }}  {...rest} passHref /*{...(prefetch === false ? { prefetch } : {})}*/ prefetch={false}>
        {children}
      </Link>

    )
  };


export default Anchor;