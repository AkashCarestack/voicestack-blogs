import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Button from '~/components/common/Button'

interface PricingData {
  firstname?: string
  lastname?: string
  email?: string
}

export default function PricingThankYouPage() {
  const router = useRouter()
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedData = localStorage.getItem('pricingData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setPricingData(parsedData)
      } catch (error) {
        console.error('Error parsing pricingData from localStorage:', error)
      }
    }
  }, [])

  const firstName = pricingData?.firstname || ''
  const lastName = pricingData?.lastname || ''
  const email = pricingData?.email || ''
  const fullName = `${firstName} ${lastName}`.trim() || 'there'
  const metaDescriptn = "Thank you for requesting VoiceStack pricing. One of our team members will contact you shortly to discuss your needs & provide a pricing overview."
  const metaKeywords = "voicestack thank you, voicestack pricing thank you, voicestack pricing request received"
  const fullTitle = "Thank You | VoiceStack® Pricing Request Has Been Received"

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <link rel="canonical" href={'https://www.voicestack.com/pricing/thank-you'} />
        <meta name="description" content={metaDescriptn} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="author" content="VoiceStack®" />
        <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:url" content={'https://www.voicestack.com/pricing/thank-you'} />
      <meta property="og:description" content={metaDescriptn} />
      <meta name="title" content={fullTitle} />
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Head>
      <div className="py-24 px-4">
        <div className="w-full gap-16 flex flex-col justify-center items-center min-h-[500px]">
          <div className="flex flex-col w-full items-center text-center gap-4 pb-8 max-w-[1020px]">
            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                Thank you, {isClient ? fullName : 'there'}!
              </h1>
              <p className="text-gray-500">
                A VoiceStack representative will reach out to you shortly with our best pricing plans.
              </p>
              
              

              <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center items-center w-full">
                <Button
                  type="primary"
                  className="w-fit"
                  link="/pricing"
                >
                  <span>Back to Pricing</span>
                </Button>
                <Button
                  type="secondary"
                  className="w-fit"
                  link="/"
                >
                  <span>Go to Home page</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

