import Section from '~/components/structure/Section'
import FooterBottomBg from '../../../public/assets/Bg/image2.png'
import Button from '~/components/common/Button'
import { useLpCtaText } from '~/providers/LpMangoCopyProvider'
import Image from 'next/image'
import { urlForImage } from '~/lib/sanity.image'

interface FooterBottomProps {
  data?: {
    ctaBanner?: {
      title?: string
      description?: string
      buttonText?: string
      buttonLink?: string
      showBanner?: boolean
      backgroundImage?: {
        url?: string
        asset?: any
      }
    }
  }
}

export default function FooterBottom({ data }: FooterBottomProps) {
  const ctaBanner = data?.ctaBanner
  const buttonText = useLpCtaText(ctaBanner?.buttonText || 'Book Free Demo')

  // Don't render if showBanner is explicitly false
  if (ctaBanner && ctaBanner.showBanner === false) {
    return null
  }

  // Optimize image URL - use Sanity optimization if available, otherwise use Next.js Image for local images
  const getOptimizedImageSource = () => {
    if (ctaBanner?.backgroundImage?.asset) {
      // Sanity image - use urlForImage with optimization
      return urlForImage(ctaBanner.backgroundImage.asset, {
        width: 1920, // Max width for large displays
        quality: 85, // Good quality but smaller file size
      }) || ''
    }
    if (ctaBanner?.backgroundImage?.url) {
      // Direct URL from Sanity (fallback)
      return ctaBanner.backgroundImage.url
    }
    // Local image - Next.js will optimize automatically
    return FooterBottomBg
  }

  const imageSource = getOptimizedImageSource()

  // Use Sanity content or fallback defaults
  const title = ctaBanner?.title || 'Grow Your Practice with VoiceStack'
  const description = ctaBanner?.description || 'Smarter call management, automated follow-ups, and actionable insights designed to grow your practice.'
  const buttonLink = ctaBanner?.buttonLink || '/demo'

  return (
    <Section id="footer-bottom" className={'bg-black text-white'}>
      <div className="flex flex-col gap-3 items-center w-full">
        <div className="relative flex flex-col items-center self-stretch md:pt-24 pt-16 md:pb-16 pb-8 md:rounded-br-[24px] md:rounded-bl-[24px] rounded-bl-[12px] rounded-br-[12px] overflow-hidden">
          {/* Optimized background image */}
          <Image
            src={imageSource}
            alt=""
            fill
            className="object-cover object-center"
            priority
            quality={85}
            sizes="100vw"
          />
          {/* Content overlay */}
          <div className="relative z-10 max-w-[690px] mx-auto text-center px-4">
            <h3 className="font-manrope font-semibold lg:text-6xl text-3xl !leading-[113%]">
              {title}
            </h3>
            <p className="pt-3 pb-6 text-base md:text-lg !leading-[160%]">
              {description}
            </p>
            <Button
              type="primary"
              link={buttonLink}
              disableLpDemoLinkOverride={true}
              className="w-fit mx-auto"
            >
              <span>{buttonText}</span>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
