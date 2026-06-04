import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'

import MailIcon from '../icons/MailIcon'
import PhoneIcon from '../icons/PhoneIcon'
import { formatPhoneNumberWithCountryCode } from '../utils/helper'
import Anchor from './anchor'
import { usePricingModal } from './PricingModalContext'
import ArrowIcon from '../revamp/icons/arrowIcon'
import replaceUrl from '~/helpers/replaceUrl'
import { useLpDemoLink } from '~/providers/LpDemoLinkProvider'
import { PracticeTypeModal } from '~/v2/components/common/PracticeTypeModal'
import { useDemoFormData } from '~/providers/BookDemoProvider'
import { getPricingDemoModalCallback } from '~/utils/pricingDemoModal'
import { hasSecondaryMeetingLink, LOC_QUERY_PARAM } from '~/utils/resolveDemoMeetingLink'
import PrimarySwitchButton, {
  isPrimarySwitchButtonType,
} from '~/components/common/PrimarySwitchButton'

interface ButtonProps {
  type?: 'primary' | 'primarySm' | 'primarySwitch' | 'secondary' | 'underline'  | 'video' | 'borderless' | 'secondaryMail' | 'secondaryTel' | 'borderlessIcon' | 'secondaryWhite'
  alter?: 'bgWhite' | 'borderWhite' | 'disabled' | 'default'
  children?: React.ReactNode
  link?: any
  target?: '_blank' | '_self' | '_parent' | '_top' | ''
  isDemo?: boolean
  buttonVariant?: 'tel' | 'mail'
  [x: string]: any
  className?: string
  locale?: string | false
  disableLpDemoLinkOverride?: boolean
}

const Button: React.FunctionComponent<ButtonProps> = ({
  type,
  alter,
  children,
  link,
  isDemo,
  target,
  className,
  locale,
  buttonVariant,
  disableLpDemoLinkOverride = false,
  onClick,
  ...rest
}) => {
  const router = useRouter()
  const lpDemoLink = useLpDemoLink()
  // Get pricing modal context (may be undefined if provider is not available)
  const pricingModal = usePricingModal()
  const openPricingModal = pricingModal?.openPricingModal
  
  // Get demo form data from context
  const { formData, region } = useDemoFormData()
  
  // State for practice type modal
  const [showPracticeTypeModal, setShowPracticeTypeModal] = useState(false)
  
  // Check if we're on a partner child page (with slug), not the landing page
  const isPartnerChildPage = useMemo(() => {
    const pathname = router.pathname
    // Match /company/partners/[slug] pattern (has a slug after /company/partners/)
    // Exclude /company/partners (landing page) - only child pages should override
    return pathname.startsWith('/company/partners/') && pathname !== '/company/partners'
  }, [router.pathname])

  // Check if we're on a pricing page
  const isPricingPage = useMemo(() => {
    const pathname = router.pathname
    return pathname == '/pricing'
  }, [router.pathname])

  // Check if we're on a lp page
  const isLpPage = useMemo(() => {
    const pathname = router.pathname
    return pathname.startsWith('/lp/')
  }, [router.pathname])

  const isDemoPage = useMemo(() => router.pathname === '/demo', [router.pathname])
  
  // Extract text from children to check for "get pricing"
  const buttonText = useMemo(() => {
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === 'string') {
        return node
      }
      if (typeof node === 'number') {
        return String(node)
      }
      if (React.isValidElement(node) && node.props.children) {
        if (typeof node.props.children === 'string') {
          return node.props.children
        }
        if (Array.isArray(node.props.children)) {
          return node.props.children.map(extractText).join(' ')
        }
        return extractText(node.props.children)
      }
      return ''
    }
    
    if (typeof children === 'string') {
      return children
    }
    if (Array.isArray(children)) {
      return children.map(extractText).join(' ')
    }
    return extractText(children)
  }, [children])
  
  // Check if button text contains "get pricing" (case-insensitive)
  const isPricingButton = useMemo(() => {
    return buttonText.toLowerCase().includes('get pricing')
  }, [buttonText])
  
  // Check if button text contains "book free demo" (case-insensitive)
  const isBookFreeDemoButton = useMemo(() => {
    return buttonText.toLowerCase().includes('book free demo')
  }, [buttonText])
  
  // Get available practice types from form data
  const availablePracticeTypes = useMemo(() => {
    if (!formData) return []
    
    // On pricing page, use pricingDemoForms; otherwise use demoForms
    const forms = isPricingPage ? formData.pricingDemoForms : formData.demoForms
    
    if (!forms || !Array.isArray(forms)) return []
    
    // Extract practice types, filtering out null/undefined
    return forms
      .map((form) => form?.practiceType)
      .filter((practiceType): practiceType is string => Boolean(practiceType))
  }, [formData, isPricingPage])
  
  // Handle click - if it's a "book free demo" button, show practice type modal
  // BUT on partner pages, allow anchor links to work (scroll to #demo)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // On partner child/LP pages, keep default link behavior and skip demo modal overrides.
    if (isPartnerChildPage || isLpPage) {
      if (onClick) {
        onClick(e)
      }
      return
    }
    
    // If it's a "book free demo" button, check available practice types
    if (isBookFreeDemoButton) {
      e.preventDefault()

      const firstQueryValue = (value: unknown): string | undefined => {
        if (typeof value === 'string') return value
        if (Array.isArray(value)) {
          const first = value[0]
          return typeof first === 'string' ? first : undefined
        }
        return undefined
      }

      const isUSLocale = (router.locale ?? 'en') === 'en'
      const utmSource = firstQueryValue(router.query.utm_source)
      const utmMedium = firstQueryValue(router.query.utm_medium)
      const isLinkedinPaid =
        utmSource === 'linkedin' && utmMedium === 'paid'

      if (isUSLocale && isLinkedinPaid) {
        const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
        const basePath = `${localePrefix}/demo`

        const currentSearch = router.asPath.includes('?')
          ? router.asPath.split('?')[1].split('#')[0]
          : ''
        const currentParams = new URLSearchParams(currentSearch)

        currentParams.delete('flag')
        currentParams.delete('slug')
        currentParams.delete('locations')

        currentParams.set('practiceType', 'Dental')
        currentParams.set(LOC_QUERY_PARAM, 'lt15')

        const queryString = currentParams.toString()
        const finalUrl = queryString ? `${basePath}?${queryString}` : basePath
        router.push(finalUrl)
        return
      }

      // Already on demo: header CTA should not reopen modal or change URL
      // if (isDemoPage) {
      //   return
      // }
      
      // Check for referrer query param and override demo forms
      const referrer = router.query.referrer as string | undefined
      if (referrer && formData?.overrideDemoForms) {
        const overrideForm = formData.overrideDemoForms.find(
          (form) => form.referralName === referrer
        )
        
        if (overrideForm) {
          // Found matching override form - skip modal and navigate directly
          const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
          const basePath = `${localePrefix}/demo`
          
          // Get current query params from URL
          const currentSearch = router.asPath.includes('?') 
            ? router.asPath.split('?')[1].split('#')[0] 
            : ''
          const currentParams = new URLSearchParams(currentSearch)
          
          // Preserve referrer param and remove internal params
          currentParams.set('referrer', referrer)
          currentParams.delete('flag')
          currentParams.delete('slug')
          
          const queryString = currentParams.toString()
          const finalUrl = queryString ? `${basePath}?${queryString}` : basePath
          router.push(finalUrl)
          return
        }
      }
      
      // If only one practice type is available, skip modal and proceed directly
      if (availablePracticeTypes.length === 1) {
        const singlePracticeType = availablePracticeTypes[0]
        
        // On pricing page, call the pricing demo modal callback directly
        if (isPricingPage) {
          const pricingDemoCallback = getPricingDemoModalCallback()
          if (pricingDemoCallback) {
            const pricingRow = formData?.pricingDemoForms?.find(
              (form) => form?.practiceType === singlePracticeType
            )
            if (hasSecondaryMeetingLink(pricingRow)) {
              setShowPracticeTypeModal(true)
              return
            }
            pricingDemoCallback(singlePracticeType)
            return
          }
        }
        
        // On other pages, navigate to demo page
        // Work exactly like US version: add practiceType to URL for all regions
        // The demo page will handle removing it from URL for AU if needed
        const localePrefix = router.locale && router.locale !== 'en' ? `/${router.locale}` : ''
        const basePath = `${localePrefix}/demo`
        
        // Get current query params from URL
        const currentSearch = router.asPath.includes('?') 
          ? router.asPath.split('?')[1].split('#')[0] 
          : ''
        const currentParams = new URLSearchParams(currentSearch)
        
        // Add practiceType param (for all regions, including AU)
        currentParams.set('practiceType', singlePracticeType)
        // Preserve referrer param if it exists
        if (router.query.referrer) {
          currentParams.set('referrer', router.query.referrer as string)
        }
        currentParams.delete('flag')
        currentParams.delete('slug')
        
        const queryString = currentParams.toString()
        const finalUrl = queryString ? `${basePath}?${queryString}` : basePath
        router.push(finalUrl)
        return
      }
      
      // If 2+ practice types, show modal as before
      setShowPracticeTypeModal(true)
      return
    }
    
    // if (isPricingButton && openPricingModal) {
    //   e.preventDefault()
    //   openPricingModal()
    // }
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e)
    }
  }
  
  const baseClasses = `relative [&>*]:relative inline-block rounded-[8px] text-gray-950 font-geist font-medium tracking-[0]  !leading-[150%] flex items-center  justify-center whitespace-nowrap gap-[8px] transition-all duration-300 ease-linear  ${className}`
  // const customClasses = `bg-zinc-500 hover:bg-zinc-600 text-white`;
  const customClasses = clsx({
    'px-6 py-2.5 before:content-[""] md:h-[44px] before:absolute before:inset-[1px] before:rounded-[8px] before:border before:border-white/10 before:bg-[#B5EB92] p-[1px] text-base bg-gradient-to-r from-[#B5EB92] to-white shadow-[0_0_0_1px_#92D96A] hover:shadow-[0_0_0_2px_#92D96A] hover:from-white hover:to-[#B5EB92]':
      type === 'primary',
    'border-none text-sm md:h-[44px] font-medium leading-[142%] tracking-normal':
      type === 'borderless',
    'p-[1px] text-sm bg-gradient-to-r from-[#B5EB92] to-white shadow-[0_0_0_1px_#92D96A] hover:shadow-[0_0_0_2px_#92D96A] hover:from-white hover:to-[#B5EB92]':
      type === 'primarySm',
    'border-2 md:h-[44px] bg:white/10 border-[rgba(74,60,225,0.15)] hover:border-[rgba(74,60,225,0.15)] hover:bg-black/5 py-2.5 px-6':
      type === 'secondary',
    'text-base font-normal underline decoration-dotted decoration-2 underline-offset-4':
      type === 'underline',
    'text-white border border-white/30 px-[17px] py-[10px]':
      type === 'video',
    'border-2 md:h-[44px] bg:white/10 border-[rgba(74,60,225,0.15)] hover:border-[rgba(74,60,225,0.15)] hover:bg-black/5 py-2.5 px-6 flex items-center':
      type === 'secondaryMail',
    'border-2 md:h-[44px] bg:white/10 border-[rgba(74,60,225,0.15)] hover:border-[rgba(74,60,225,0.15)] hover:bg-black/5 py-2.5 px-6 items-center':
      type === 'secondaryTel',
      'border-none text-base font-medium leading-[150%] tracking-normal flex text-codgray-950 hover:text-vs-blue':
      type === 'borderlessIcon',
      'border-2 md:h-[44px] bg:white/10 border-white/40 hover:border-white/50 hover:bg-white/5 py-2.5 px-6 text-white':
      type === 'secondaryWhite',

  }) 

  // Format link based on buttonVariant
  const formatLink = (linkValue: string, variant?: 'tel' | 'mail'): string => {
    if (!linkValue) return linkValue
    
    // If link already has protocol prefix, return as is
    if (linkValue.startsWith('tel:') || linkValue.startsWith('tel://') || linkValue.startsWith('mailto:') || linkValue.startsWith('http://') || linkValue.startsWith('https://') || linkValue.startsWith('/')) {
      return linkValue
    }
    
    // Format based on variant
    if (variant === 'tel') {
      // Format phone number with country code and dashes
      const formattedNumber = formatPhoneNumberWithCountryCode(linkValue, locale)
      return `tel:${formattedNumber}`
    }
    
    if (variant === 'mail') {
      return `mailto:${linkValue}`
    }
    
    return linkValue
  }

  // If it's a pricing button, don't use the link
  // Extract URL from link (handle both string and object with cached_url)
  const linkUrl = typeof link === 'string' ? link : (link?.cached_url || link?.url || link)
  const processedLink = linkUrl ? replaceUrl(linkUrl) : linkUrl
  const formattedLink = processedLink ? formatLink(processedLink, buttonVariant) : processedLink
  
  // On partner child pages, override "book free demo" buttons to #demo (but preserve special links)
  // Pricing buttons keep their original behavior (open modal)
  const finalLink = useMemo(() => {
    // Pricing buttons should open modal, not navigate
    // if (isPricingButton) return undefined
    const shouldUseLpDemoLink =
      isLpPage &&
      !disableLpDemoLinkOverride &&
      lpDemoLink &&
      (!formattedLink ||
        formattedLink === '#demo' ||
        formattedLink === '/demo' ||
        formattedLink === '/demo/')

    if (shouldUseLpDemoLink) {
      return lpDemoLink
    }

    if (!formattedLink) return formattedLink
    
    // Don't override if already #demo
    if (formattedLink === '#demo') return formattedLink
    
    // Don't override special protocol links (mailto, tel, external URLs)
    if (
      formattedLink.startsWith('mailto:') ||
      formattedLink.startsWith('tel:') ||
      formattedLink.startsWith('tel://') ||
      formattedLink.startsWith('http://') ||
      formattedLink.startsWith('https://')
    ) {
      return formattedLink
    }
    
    // Don't override hash links (anchors)
    if (formattedLink.startsWith('#')) {
      return formattedLink
    }
    
    // On partner child pages (with slug), override buttons to #demo (scrolls to form)
    // Landing page (/company/partners) is excluded
    // This preserves interlinking buttons to other pages
    if (isPartnerChildPage && formattedLink) {
      return '#demo'
    }

    // On lp pages, override buttons to the link
    if (isLpPage && formattedLink) {
      return formattedLink
    }
    
    // For "book free demo" buttons, link to /demo (unless on partner page, handled above)
    // Next.js Link with locale prop will handle locale-aware routing automatically
    if (isBookFreeDemoButton) {
      return '/demo'
    }
    // if (isPricingPage && formattedLink) {
    //   return '/pricing/demo'
    // }
    
    return formattedLink
  }, [isPricingButton, formattedLink, isPartnerChildPage, isLpPage, isBookFreeDemoButton, lpDemoLink, router, disableLpDemoLinkOverride])

  const combinedClasses = clsx(baseClasses, customClasses, className)

  if (isPrimarySwitchButtonType(type)) {
    return (
      <>
        <PrimarySwitchButton
          link={finalLink || formattedLink}
          buttonText={buttonText}
          className={className}
          target={target}
          locale={locale}
        />
        {showPracticeTypeModal && (
          <PracticeTypeModal
            onClose={() => setShowPracticeTypeModal(false)}
            locale={locale || router.locale}
          />
        )}
      </>
    )
  }

  if (finalLink) {
    return (
      <>
        <Anchor
          href={finalLink}
          className={combinedClasses}
          target={target}
          locale={locale}
          onClick={handleClick}
          {...rest}
        >
          {type === 'secondaryMail' && <MailIcon className='size-6'/>}
          {type === 'secondaryTel' && <PhoneIcon className='size-6'/>}
          {children}
        </Anchor>
        {showPracticeTypeModal && (
          <PracticeTypeModal
            onClose={() => setShowPracticeTypeModal(false)}
            locale={locale || router.locale}
          />
        )}
      </>
    )
  }

  return (
    <>
      <button className={combinedClasses} onClick={handleClick} {...rest}>
        {children}
      </button>
      {showPracticeTypeModal && (
        <PracticeTypeModal
          onClose={() => setShowPracticeTypeModal(false)}
          locale={locale || router.locale}
        />
      )}
    </>
  )
}

export default Button
