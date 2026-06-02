import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import Anchor from '~/components/common/anchor'
import replaceUrl from '~/helpers/replaceUrl'
import { useLpDemoLink } from '~/providers/LpDemoLinkProvider'
import sparkleIcon from 'public/assets/primary-switch/sparkle.svg'

interface PrimarySwitchButtonProps {
  link?: string
  buttonText?: string
  className?: string
  target?: '_blank' | '_self' | '_parent' | '_top' | ''
  locale?: string | false
}

export function isPrimarySwitchButtonType(buttonType?: string) {
  if (!buttonType) return false
  const normalized = buttonType.toLowerCase().replace(/[\s_-]/g, '')
  return normalized === 'primaryswitch'
}

export default function PrimarySwitchButton({
  link,
  buttonText,
  className,
  target,
  locale,
}: PrimarySwitchButtonProps) {
  const router = useRouter()
  const lpDemoLink = useLpDemoLink()
  const primaryLabel = buttonText

  const finalLink = useMemo(() => {
    const linkUrl = typeof link === 'string' ? link : ''
    const processedLink = linkUrl ? replaceUrl(linkUrl) : linkUrl
    const isLpPage = router.pathname.startsWith('/lp/')
    const shouldUseLpDemoLink =
      isLpPage &&
      lpDemoLink &&
      (!processedLink ||
        processedLink === '#demo' ||
        processedLink === '/demo' ||
        processedLink === '/demo/')

    if (shouldUseLpDemoLink) {
      return lpDemoLink
    }

    return processedLink || '/demo'
  }, [link, lpDemoLink, router.pathname])

  if (!primaryLabel?.trim()) {
    return null
  }

  return (
    <Anchor
      href={finalLink}
      target={target}
      locale={locale}
      className={clsx('inline-flex w-auto max-w-full', className)}
    >
      <span
        className={clsx(
          'relative inline-flex w-full  f min-h-[62px] items-center justify-center sm:gap-6 gap-1 overflow-hidden rounded-[8px]',
          'border border-solid border-white/10 bg-[#B5EB92] px-8 py-3',
          'shadow-[0_0_0_1px_#92D96A] transition-all duration-300 ease-linear',
          'hover:shadow-[0_0_0_2px_#92D96A]',
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-0 z-[1] h-[1000px] w-[300px] animate-primary-switch-glare bg-gradient-to-l from-transparent via-white to-transparent"
        />

        <span className="relative z-10 shrink-0 whitespace-nowrap font-geist text-lg font-medium leading-7 tracking-normal text-gray-950">
          {primaryLabel}
        </span>

        <span className="relative z-10 flex shrink-0 flex-row items-center self-stretch">
          <span aria-hidden className="h-full w-px shrink-0 bg-gray-950/10" />
        </span>

        <span className="relative z-10 flex shrink-0 flex-col items-start justify-center gap-1">
          <span className="whitespace-nowrap font-geist text-sm font-normal leading-4 tracking-normal text-gray-950 opacity-70">
            Switch today & get
          </span>

          <span className="flex items-center gap-0.5">
            <span className="whitespace-nowrap font-geist text-sm font-normal leading-4 tracking-normal text-[#030712] opacity-70">
              2 months free
            </span>
            <Image
              src={sparkleIcon}
              alt=""
              aria-hidden
              width={12}
              height={12}
              className="size-3 shrink-0"
            />
          </span>
        </span>
      </span>
    </Anchor>
  )
}
