import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import Anchor from './anchor'

interface ButtonProps {
  type?: 'primary' | 'primarySm' | 'secondary' | 'underline'
  alter?: 'bgWhite' | 'borderWhite' | 'disabled' | 'default'
  children?: React.ReactNode
  link?: any
  target?: '_blank' | '_self' | '_parent' | '_top' | ''
  isDemo?: boolean
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
  ...rest
}) => {
  const baseClasses = `inline-block rounded-[8px] text-gray-950 font-geist font-medium leading-[24px] flex items-center tracking-wide justify-center whitespace-nowrap gap-[8px] transition-all duration-300 ease-linear  ${className}`
  // const customClasses = `bg-zinc-500 hover:bg-zinc-600 text-white`;
  const customClasses = clsx({
    'p-[1px] text-base bg-gradient-to-r from-[#B5EB92] to-white shadow-[0_0_0_1px_#92D96A] hover:shadow-[0_0_0_2px_#92D96A] hover:from-white hover:to-[#B5EB92]':
      type === 'primary',
    'p-[1px] text-sm bg-gradient-to-r from-[#B5EB92] to-white shadow-[0_0_0_1px_#92D96A] hover:shadow-[0_0_0_2px_#92D96A] hover:from-white hover:to-[#B5EB92]':
      type === 'primarySm',
    'border-2 border-[rgba(74,60,225,0.15)] hover:border-[rgba(74,60,225,0.15)] hover:bg-[rgba(0,0,0,0.05)] py-2.5 px-6':
      type === 'secondary',
    'text-base font-normal underline decoration-dotted decoration-2 underline-offset-4':
      type === 'underline',
  })

  const combinedClasses = clsx(baseClasses, customClasses, className)
  if (link) {
    return (
      <>
        <Anchor
          href={link}
          className={combinedClasses}
          target={target}
          locale={locale}
          {...rest}
        >
          {children}
        </Anchor>
      </>
    )
  }

  return (
    <button className={combinedClasses} {...rest}>
      {children}
    </button>
  )
}

export default Button
