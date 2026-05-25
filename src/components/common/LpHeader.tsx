import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/router'
import VoicestackLogo from 'public/assets/voicestack-logo.svg'
import Anchor from './anchor'
import Button from './Button'
import Container from '../structure/Container'

interface LpHeaderProps {
  data?: any 
  logo?: string | StaticImageData
  logoAlt?: string
  logoText?: string
}

const LpHeader = ({ data, logo, logoAlt, logoText }: LpHeaderProps) => {
  const router = useRouter()
  const safeData = data || {
    ctabutton: 'Book Free Demo',
  }

  return (
    <header className="bg-[#F9F9F9] py-4 fixed top-0 left-0 right-0 z-50">
      <Container className="flex items-center justify-between">
        {/* <Anchor href="/" className="flex-shrink-0"> */}
          {logoText ? (
            <span className="text-center md:text-left text-base font-geist font-medium leading-[150%] tracking-[0.8px] text-gray-950 uppercase">{logoText}</span>
          ) : (
            <Image
              src={logo || VoicestackLogo}
              alt={logoAlt || "VoiceStack"}
              title={logoAlt || "VoiceStack"}
              className={`${logo ? 'md:h-[45px] h-[36px] w-auto' : 'h-[26px] md:h-[36px] w-auto'}`}
              width={200}
              height={52}
            />
            // <></>
          )}
        {/* </Anchor> */}

       
          <Button type="primary" link="#demo" className="md:block hidden">
            <span className="text-sm font-medium">{safeData?.ctabutton || 'Book Free Demo'}</span>
          </Button>
      </Container>
    </header>
  )
}

export default LpHeader

