import clsx from 'clsx'
import Link from 'next/link'
import React, { useMemo } from 'react'
import Anchor from './anchor'
import { usePricingModal } from './PricingModalContext'
import { formatPhoneNumberWithCountryCode } from '../utils/helper'

interface ButtonProps {
  type?: 'primary' | 'primarySm' | 'secondary' | 'underline'  | 'video' | 'borderless'
  alter?: 'bgWhite' | 'borderWhite' | 'disabled' | 'default'
  children?: React.ReactNode
  link?: any
  target?: '_blank' | '_self' | '_parent' | '_top' | ''
  isDemo?: boolean
  buttonVariant?: 'tel' | 'mail'
  [x: string]: any
  className?: string
  locale?: string | false
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
  onClick,
  ...rest
}) => {
  // Get pricing modal context (may be undefined if provider is not available)
  const pricingModal = usePricingModal()
  const openPricingModal = pricingModal?.openPricingModal
  
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
  
  // Handle click - if it's a pricing button, open modal instead of navigating
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (isPricingButton && openPricingModal) {
      e.preventDefault()
      openPricingModal()
    }
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
      return `tel://${formattedNumber}`
    }
    
    if (variant === 'mail') {
      return `mailto:${linkValue}`
    }
    
    return linkValue
  }

  // If it's a pricing button, don't use the link
  const finalLink = isPricingButton ? undefined : (link ? formatLink(link, buttonVariant) : link)

  const combinedClasses = clsx(baseClasses, customClasses, className)
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
          {children}
        </Anchor>
      </>
    )
  }

  return (
    <button className={combinedClasses} onClick={handleClick} {...rest}>
      {children}
    </button>
  )
}

export default Button
