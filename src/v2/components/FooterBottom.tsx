import Section from '~/components/structure/Section'
import FooterBottomBg from '../../../public/assets/Bg/image2.png'
import Button from '~/components/common/Button'

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
      }
    }
  }
}

export default function FooterBottom({ data }: FooterBottomProps) {
  const ctaBanner = data?.ctaBanner

  // Don't render if showBanner is explicitly false
  if (ctaBanner && ctaBanner.showBanner === false) {
    return null
  }

  // Use Sanity background image if available, otherwise fallback to default
  const backgroundImageUrl = ctaBanner?.backgroundImage?.url || FooterBottomBg.src

  // Use Sanity content or fallback defaults
  const title = ctaBanner?.title || 'Grow your practice with Voicestack'
  const description = ctaBanner?.description || 'Join leading Australian dental practices who never miss a patient call. See how VoiceStack can transform your front desk in just 15 minutes.'
  const buttonText = ctaBanner?.buttonText || 'Book Free Demo'
  const buttonLink = ctaBanner?.buttonLink || '/demo'

  return (
    <Section id="footer-bottom" className={'bg-black text-white'}>
      <div className="flex flex-col gap-3 items-center w-full">
        <div
          className="flex flex-col items-center self-stretch md:pt-24 pt-16 md:pb-16 pb-8 md:rounded-br-[24px] md:rounded-bl-[24px] rounded-bl-[12px] rounded-br-[12px]"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="max-w-[690px] mx-auto text-center px-4">
            <h3 className="font-manrope font-semibold lg:text-6xl text-3xl !leading-[113%]">
              {title}
            </h3>
            <p className="pt-3 pb-6 text-base md:text-lg !leading-[160%]">
              {description}
            </p>
            <Button type="primary" link={buttonLink} className="w-fit mx-auto">
              <span>{buttonText}</span>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
