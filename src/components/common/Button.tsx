import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import Anchor from './anchor'

interface ButtonProps {
  type?:
    | 'primary'
    | 'primaryLg'
    | 'primaryWhite'
    | 'video'
    | 'primarySm'
    | 'secondary'
    | 'primaryXs'
  alter?: 'bgWhite' | 'borderWhite' | 'disabled' | 'default'
  children?: React.ReactNode
  link?: any
  target?: '_blank' | '_self' | '_parent' | '_top' | '';
  isDemo?: boolean
  [x: string]: any
  className?: string
  locale?: string | false;
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
  const baseClasses = `rounded-[7px] text-gray-900 font-inter text-base font-medium leading-6 flex items-center justify-center whitespace-nowrap gap-[8px] transition-all duration-300 ease-linear  ${className}`;
  // const customClasses = `bg-zinc-500 hover:bg-zinc-600 text-white`;
  const customClasses = clsx({
    'bg-vs-blue hover:bg-vs-blue-secondary hover:border-vs-blue-secondary text-white border border-vs-blue px-[17px] py-[10px] ': type === 'primary',
    'bg-vs-blue hover:bg-vs-blue-secondary hover:border-vs-blue-secondary text-white border border-vs-blue px-[17px] py-[14px] justify-center min-w-[200px]': type === 'primaryLg',
    'bg-vs-blue hover:bg-vs-blue-secondary hover:border-vs-blue-secondary text-white border border-vs-blue text-sm px-[12px] py-[8px]': type === 'primarySm',
    'bg-vs-blue hover:bg-vs-blue-secondary hover:border-vs-blue-secondary text-white border border-vs-blue text-[10px] px-[10px] py-[5px] rounded-[4px]': type === 'primaryXs',
    'bg-white hover:bg-white hover:text-vs-blue text-blue-500 border border-white px-[17px] py-[10px]': type === 'primaryWhite',
    'text-white border border-white/30 px-[17px] py-[10px] ': type === 'video',
    'text-white border border-white/30 px-[17px] py-[10px] flex ': type === 'secondary',
  });
  

  const combinedClasses = clsx(baseClasses, customClasses, className);
;
  

  if (link) {
    return (
      <>
      {/* <Link href={link} className={combinedClasses} target={target} locale={locale} {...rest}>
        {children}
      </Link> */}
      <Anchor href={link} className={combinedClasses} target={target} locale={locale} {...rest}>
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
