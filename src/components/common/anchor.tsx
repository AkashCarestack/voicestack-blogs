import { useTracking } from 'cs-tracker'
import { getCssSelectorShort } from '~/helpers/createCSSSelector'
import generateButtonId from '~/helpers/generateButtonId'
import { filterInternalLinkQuery } from '~/helpers/stripTrackingParams'
import { getParams, getQueryParamFromLink } from '~/helpers/getQueryParams'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getCookie } from '~/utils/tracker/cookie'
import { useTrackUser } from '~/utils/tracker/intitialize'
import { capturePosthogEvent } from '../utils/common'


interface CustomLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  passHref?: Boolean
  prefetch?: boolean
  locale?: string | false
  elementId?: string
  replace?: boolean
}

const Anchor: React.FunctionComponent<CustomLinkProps> =
  ({ href, locale, elementId, passHref = true, replace = false, prefetch = true, children, ...rest }) => {

    const router = useRouter()
    const { Track, trackEvent } = useTracking({}, {})
    const [newLink, setNewLink] = useState('#')
    const trackCtx = useTrackUser()
    const [btnId, setBtnId] = useState<any>('')
    const abSegment:any = getCookie('__vs_ver')

    useEffect(() => {
      if (typeof href !== 'string' || !href) {
        setNewLink('#')
        return
      }

      const { query } = router

      const hrefPath = href.split('?')[0].split('#')[0]
      const isThankYouPage = hrefPath.includes('/thank-you')
      const isDemoDestination =
        hrefPath === '/demo' || (hrefPath?.length > 0 && hrefPath?.endsWith('/demo'));

      const queryParams = filterInternalLinkQuery(query, {
        isThankYouPage,
        isDemoDestination,
      })

      const existingParams = href.includes('?') ? href.split('?')[1].split('#')[0] : ''
      const mergedParams = new URLSearchParams(existingParams)

      if (!isThankYouPage && mergedParams.has('practiceType')) {
        mergedParams.delete('practiceType')
      }
      if (!isDemoDestination && mergedParams.has('locations')) {
        mergedParams.delete('locations')
      }
      if (!isDemoDestination && mergedParams.has('loc')) {
        mergedParams.delete('loc')
      }

      Object.entries(queryParams).forEach(([key, value]) => {
        mergedParams.set(key, value)
      })

      const updatedParams = mergedParams.toString()
      setNewLink(`${href.split('?')[0]}${updatedParams.length > 0 ? '?' + updatedParams : ''}`)
    }, [href, router, trackCtx])


    const dataId = elementId || btnId || ''

    const { onClick: externalOnClick, ...restProps } = rest

    return (
      <Link {...(dataId && { 'data-elementid': dataId })} href={newLink} locale={locale} replace={replace}
        onClick={(e) => {
          if (newLink === '#') e.preventDefault()
          const element = getCssSelectorShort(e.target as Element)
          let e_name = ''
          const utm_term = getQueryParamFromLink(newLink, 'utm_term')

          const linkPath = newLink.split('?')[0].split('#')[0]
          const isDemoLink = linkPath === '/demo' || linkPath.endsWith('/demo') || linkPath.includes('/pricing/demo')

          if (utm_term) {
            e_name = utm_term
          } else if (isDemoLink) {
            e_name = 'demo-button'
          } else {
            if (!newLink.includes('https://')) {
              e_name = (rest.className?.split('_')[0] !== undefined ? `${rest.className?.split('_')[0]}` :
                'internal-link')
            } else {
              e_name = 'external-link'
            }
          }
          const {
            utm_source = null,
            utm_content = null,
            utm_campaign = null,
            utm_medium = null,
            ...params
          } = getParams()

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
          })
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

          if (externalOnClick) {
            externalOnClick(e)
          }
        }}  {...restProps} passHref prefetch={false}>
        {children}
      </Link>

    )
  }


export default Anchor
