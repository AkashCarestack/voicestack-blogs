import * as React from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import { X } from 'lucide-react'
import Button from '~/components/common/Button'
import Image from 'next/image'
import { useLpDemoLink } from '~/providers/LpDemoLinkProvider'

// const MANGO_IMAGE_URL = '/assets/offers/mango-voice-offer.png'
const MANGO_IMAGE_URL = '/assets/offers/mango-voice-offer-v1.png'

export interface CampaignOfferModalProps {
  onClose: () => void
}

const CampaignOfferModal: React.FC<CampaignOfferModalProps> = ({ onClose }) => {
  const router = useRouter()
  const lpDemoLink = useLpDemoLink()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleCtaClick = () => {
    if (lpDemoLink) {
      router.push(lpDemoLink)
      onClose()
      return
    }

    const currentSearch = router.asPath.includes('?')
      ? router.asPath.split('?')[1].split('#')[0]
      : ''
    const currentParams = new URLSearchParams(currentSearch)

    currentParams.set('practiceType', 'Dental')
    currentParams.set('loc', 'lt15')

    const queryString = currentParams.toString()
    const finalUrl = queryString ? `/demo?${queryString}` : '/demo'

    router.push(finalUrl)
    onClose()
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999]"
      aria-labelledby="campaign-offer-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-950 bg-opacity-60 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-[850px] overflow-hidden rounded-xl bg-white text-left shadow-xl">
            <button
              type="button"
              className="absolute right-6 top-6 z-20 h-10 w-10 cursor-pointer items-start justify-end text-gray-400 hover:text-gray-950 flex"
              onClick={onClose}
              aria-label="Close popup"
            >
              <div className="w-5">
                <X className="h-6 w-6" />
              </div>
            </button>

            <div className="flex flex-col md:min-h-[450px] md:flex-row">
              <div className="relative h-[300px] overflow-hidden bg-[#fbf661] md:h-auto md:w-[450px] md:shrink-0">
                
                <Image
                  src={MANGO_IMAGE_URL}
                  alt="Mango Voice Offer"
                  title="Mango Voice Offer"
                  width={900}
                  height={900}
                  className="absolute inset-x-0 top-0 mx-auto h-full w-auto object-cover"
                />
               
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-end">
                <div className="px-6 pb-6 pt-8 md:px-12 md:pb-8 md:pt-12">
                  <h3
                    id="campaign-offer-modal-title"
                    className="font-manrope md:text-4xl text-2xl font-semibold leading-[1.1] text-gray-900"
                  >
                    Switching from
                    <br />
                    Mango Voice?
                  </h3>
                  <p className="mt-3 md:text-lg text-base leading-normal text-gray-700">
                    Switch from Mango Voice and
                    <br />
                    Get 2 months of VoiceStack FREE.
                  </p>
                </div>

                <div className="border-t border-gray-100 px-6 pb-10 pt-8 md:px-12">
                  <Button type="primary" onClick={handleCtaClick}>
                  {/* <Button type="primary" link="/demo?practiceType=Dental&loc=lt15"> */}
                    <span>Unlock Free 2 Months Subscription</span>
                  </Button>
                  <p className="mt-3 text-sm leading-5 text-gray-500">
                    Just schedule a demo and purchase to unlock your first two months at no cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!mounted) {
    return null
  }

  const portalRoot = document.getElementById('main')
  if (!portalRoot) {
    return null
  }

  return createPortal(modalContent, portalRoot)
}

export default CampaignOfferModal
