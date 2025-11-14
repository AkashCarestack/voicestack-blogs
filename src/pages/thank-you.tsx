
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Button from '~/components/common/Button'

interface DemoData {
  firstname?: string
  lastname?: string
  email?: string
  meetingLink?: string | null
}

export default function ThankYouPage() {
  const router = useRouter()
  const [demoData, setDemoData] = useState<DemoData | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    document.body.appendChild(script);
  }, [])

  useEffect(() => {
    setIsClient(true)
    const storedData = localStorage.getItem('demoData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setDemoData(parsedData)
      } catch (error) {
        console.error('Error parsing demoData from localStorage:', error)
      }
    }
  }, [])

  const handleMeetingClick = () => {
    if (demoData?.meetingLink) {
      router.push(demoData.meetingLink)
    }
  }

  const firstName = demoData?.firstname || ''
  const lastName = demoData?.lastname || ''
  const fullName = `${firstName} ${lastName}`.trim() || 'there'

  return (
    <>
      <Head>
        <title>Thank You | Your VoiceStack® Demo Request Has Been Submitted</title>
        <meta name="description" content="Thank you for requesting a demo with VoiceStack. One of our team members will contact you shortly to discuss your needs and provide a complete overview." />
        <meta name="keywords" content="voicestack thank you, voicestack demo thank you, voicestack demo request received" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="py-24 px-4">
        <div className="w-full gap-16 flex flex-col justify-center items-center min-h-[500px]">
          <div className="flex flex-col w-full items-center text-center gap-4 pb-8 max-w-[1020px]">
            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                Thank you, {isClient ? fullName : 'there'}!
              </h1>
              <p className="text-gray-500">
                A VoiceStack representative will reach out to you shortly.
              </p>
              
              
              {demoData?.meetingLink && ( 
                <div
                  className="meetings-iframe-container"
                  data-src={`${demoData?.meetingLink}?embed=true`}
                  // data-src="https://meetings.hubspot.com/marcomm-admin/test-link-harsha?embed=true"
                ></div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center items-center w-full">
                <Button
                  type="primary"
                  className="w-fit"
                  link="/"
                >
                  <span>Go to Home page</span>
                </Button>
                {/* {isClient && demoData?.meetingLink && (
                  <Button type="secondary" className="w-fit" onClick={handleMeetingClick}>
                    Schedule Your Meeting
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

