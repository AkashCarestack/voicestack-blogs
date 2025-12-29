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
}

const LpHeader = ({ data, logo, logoAlt }: LpHeaderProps) => {
  const router = useRouter()
  const safeData = data || {
    ctabutton: 'Book Free Demo',
  }

  return (
    <header className="bg-[#F9F9F9] py-4 fixed top-0 left-0 right-0 z-50">
      <Container className="flex items-center justify-between">
        <Anchor href="/" className="flex-shrink-0">
          <Image
            src={logo || VoicestackLogo}
            alt={logoAlt || "VoiceStack"}
            title={logoAlt || "VoiceStack"}
            className="max-h-[45px] w-auto"
          />
        </Anchor>
        <Button type="primary" link="#demo">
          <span className="text-sm font-medium">{safeData?.ctabutton || 'Book Free Demo'}</span>
        </Button>
      </Container>
    </header>
  )
}

export default LpHeader

