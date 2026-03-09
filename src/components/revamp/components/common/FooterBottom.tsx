import FooterBottomBg from '../../../../../public/assets/Bg/image2.png'
import Button from '../../../common/Button'
import Section from '../../../structure/Section'

interface FooterBottomProps {
  data: {
    ctaBanner?: {
      title?: string
      description?: string
      buttonText?: string
      buttonLink?: string
      showBanner?: boolean
      backgroundImage?: {
        url?: string
        metadata?: {
          lqip?: string
        }
      }
    }
  }
}

export default function FooterBottom({ data }: FooterBottomProps) {
  const ctaBanner = data?.ctaBanner

  // Don't render if showBanner is false or no ctaBanner data
  if (!ctaBanner?.showBanner) {
    return null
  }

  // Use Sanity background image if available, otherwise fallback to default
  const backgroundImageUrl = ctaBanner?.backgroundImage?.url || FooterBottomBg.src

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
            {ctaBanner?.title && (
              <h3 className="font-manrope font-semibold lg:text-6xl text-3xl !leading-[113%]">
                {ctaBanner.title}
              </h3>
            )}
            {ctaBanner?.description && (
              <p className="pt-3 pb-6 text-base md:text-lg !leading-[160%]">
                {ctaBanner.description}
              </p>
            )}
            {ctaBanner?.buttonText && (
              <Button 
                type="primary" 
                link={ctaBanner?.buttonLink || '/demo'} 
                className="w-fit mx-auto"
              >
                <span>{ctaBanner.buttonText}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
