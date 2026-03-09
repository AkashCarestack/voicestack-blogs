
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Button from '~/components/common/Button'
import { months } from '~/v2/helpers/formatDate'

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
  const [demoMeetingData, setDemoMeetingData] = useState<any | null>(null)
  
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

    const storedMeetingData = localStorage.getItem('demoMeetingData')
    if (storedMeetingData) {
      try {
        const parsedData = JSON.parse(storedMeetingData)
        setDemoMeetingData(parsedData)
      } catch (error) {
        console.error('Error parsing demoMeetingData from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    const meetingLink = router.query.meeting_link as string
    if (meetingLink) {
      const decodedMeetingLink = decodeURIComponent(meetingLink)
      setTimeout(() => {
        window.location.href = decodedMeetingLink
      }, 1500)
    }
  }, [router.query.meeting_link])

  const handleMeetingClick = () => {
    if (demoData?.meetingLink) {
      router.push(demoData.meetingLink)
    }
  }

  const firstName = demoData?.firstname || ''
  const lastName = demoData?.lastname || ''
  const fullName = `${firstName} ${lastName}`.trim() || 'there'
  const dateTime = new Date(demoMeetingData?.dateTime);
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
            
            {router.query.meeting ? (
              <div className="flex flex-col gap-4 w-full">
                <h1 className="text-2xl font-semibold leading-6 text-gray-900 text-center">
                  {`You’re booked with ${demoMeetingData?.organizer}.`}
                </h1>
                <p className="text-gray-500 text-center">
                  An invitation has been emailed to you.
                </p>
                <div className="flex gap-2 justify-center items-center">
                  <p className="text-gray-500">
                    {dateTime &&
                      `${
                        months[dateTime.getMonth()]
                      } ${dateTime.getDate()}, ${dateTime.getFullYear()} `}
                  </p>
                  <p className="text-gray-500">
                    {dateTime &&
                      `${dateTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center items-center w-full">
                  <Button
                    type="primary"
                    className="w-fit"
                    link="/"
                  >
                    <span>Go to Home page</span>
                  </Button>
                
                </div>
              </div>
              ):(

              <div className="flex flex-col gap-4 w-full">
                <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                  Thank you, {isClient ? fullName : 'there'}!
                </h1>
                <p className="text-gray-500">
                  A VoiceStack representative will reach out to you shortly.
                </p>
                

                <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center items-center w-full">
                  <Button
                    type="primary"
                    className="w-fit"
                    link="/"
                  >
                    <span>Go to Home page</span>
                  </Button>
                
                </div>
              </div>
              )}
          </div>
        </div>
      </div>
    </>
  )
}

