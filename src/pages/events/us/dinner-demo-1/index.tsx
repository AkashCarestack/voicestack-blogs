import Image from 'next/image'
import Button from '~/components/common/Button'
import HubSpotForm from '~/components/common/HubspotForm'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import H2 from '~/components/typography/H2'
import H3 from '~/components/typography/H3'
import Paragraph from '~/components/typography/Paragraph'
import Subtext from '~/components/typography/Subtext'
import BoltIcon from "~/components/icons/BoltIconEvent";
import PhoneIcon from "~/components/icons/PhoneIcon";
import TickSolidIcon from "~/components/icons/TickSolidIcon";
import StarIcon from "~/components/icons/StarIcon";
import Head from 'next/head'
import Link from 'next/link'

function DinnerDemo() {
  const features = [
    'AI Driven Automation',
    'AI-Driven Tasks to Identify Opportunities',
    'Analyze Every Phone Call for Continuous Improvement',
    'Benchmark and Level-up your Staff Performance',
    'Know Where Your Patients Are Coming From',
  ]
  return (
    <>
    <Head>
        {/* Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VoiceStack - AI-Driven Phone System for Dental Offices</title>
        <meta
          name="description"
          content="VoiceStack is an AI-Driven Phone System for Dental Offices that enhances business communication with smart routing, real-time analytics, and seamless integrations."
        />
        <meta
          name="keywords"
          content="VoiceStack, AI phone system, phone system, business communication, smart routing, real-time analytics"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="VoiceStack" />

        <title>VoiceStack - Dinner & Demo</title>

        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content="VoiceStack - Dinner & Demo"
        />
        <meta
          property="og:description"
          content="Enhance your business communication with VoiceStack, an AI-driven phone system offering smart call routing, real-time analytics, and seamless integration with your existing tools."
        />
        <meta
          property="og:image"
          content="https://www.voicestack.com/images/og.png"
        />
        <meta property="og:url" content="https://www.voicestack.com" />
        <meta property="og:type" content="website" />
        
      </Head>
      <Section className="relative flex-col items-center w-full min-h-lvh bg-gradient-to-br from-purple-800 via-black  to-vs-purple text-white overflow-hidden">
        <Container className="flex flex-col items-center gap-10 z-10 px-4 py-2 leading-[1.375] md:py-32">
          <a href="/" className="text-xl font-semibold">
            <Image
              className={`w-48`}
              sizes="min(200px, 100vw)"
              width={200}
              height={200}
              alt="image"
              loading="eager"
              src="/assets/logo-white.png"
            />
          </a>

          <div className="flex flex-col text-center gap-4 mt-4 items-center">
            <div>
              <span className="border border-white/20 px-2.5 py-1 rounded-full bg-white/10">
                Witness AI that works ✨
              </span>
            </div>
            <h1 className="md:text-6xl sm:text-5xl text-3xl font-semibold md:max-w-4xl max-w-max text-center">
              <span className="text-white">VoiceStack Dinner & Demo</span>
            </h1>

            <p className="text-xl font-medium">
              The event for practice owners ready to maximize growth
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <p className="uppercase font-bold text-sm">Join us on</p>
            <p className="md:text-2xl text-xl font-semibold">
              Friday, June 13, 2025 | 5:00pm - 8:30pm CST
            </p>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 md:flex hidden"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="font-light md:text-xl text-base opacity-80">
                Del Frisco&apos;s Double Eagle Steakhouse, Dallas, TX
              </span>

              
            </div>
          </div>

          <div className="flex md:flex-row flex-col relative gap-8 border border-white/10 backdrop-blur-md rounded-2xl p-10 bg-white bg-opacity-5 text-white max-w-3xl items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="md:w-40 w-20 md:h-40 h-20 bg-white rounded overflow-hidden">
                <Image
                  className="md:w-40 w-20 md:h-40 h-20 object-cover"
                  alt="Himesh Kana"
                  src="/assets/events/himesh-kana.jpg"
                  sizes="min(250px, 100vw)"
                  loading="eager"
                  width={200}
                  height={200}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-white absolute left-0 top-0 ml-48 -mt-1.5 opacity-20 scale-[.2]">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 28 23"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.5 19.3V9.40005C16.5 7.46671 16.8667 5.86671 17.6 4.60005C19 2.06672 21.4667 0.800049 25.0001 0.800049H25.9L27 1.00005V4.50005H26.8001C24.6 4.50005 23.5 5.63339 23.5 7.90005V10.6H24.8C26.6 10.6 27.5001 11.5334 27.5001 13.4V19.3C27.5001 21.3001 26.6 22.3001 24.8 22.3001H19.2001C17.4 22.3001 16.5 21.3001 16.5 19.3ZM9.20005 0.800049C9.60005 0.800049 10.1 0.866718 10.7 1.00005V4.50005H10.5C8.36672 4.50005 7.30005 5.63339 7.30005 7.90005V10.6H8.50005C10.3667 10.6 11.3 11.5334 11.3 13.4V19.3C11.3 21.3001 10.3667 22.3001 8.50005 22.3001H2.90005C1.16672 22.3001 0.300049 21.3001 0.300049 19.3V9.40005C0.300049 3.66672 3.26672 0.800049 9.20005 0.800049Z" />
                </svg>
              </div>

              <div className="text-white absolute right-0 bottom-0 p-10 opacity-10 rotate-180">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 28 23"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.5 19.3V9.40005C16.5 7.46671 16.8667 5.86671 17.6 4.60005C19 2.06672 21.4667 0.800049 25.0001 0.800049H25.9L27 1.00005V4.50005H26.8001C24.6 4.50005 23.5 5.63339 23.5 7.90005V10.6H24.8C26.6 10.6 27.5001 11.5334 27.5001 13.4V19.3C27.5001 21.3001 26.6 22.3001 24.8 22.3001H19.2001C17.4 22.3001 16.5 21.3001 16.5 19.3ZM9.20005 0.800049C9.60005 0.800049 10.1 0.866718 10.7 1.00005V4.50005H10.5C8.36672 4.50005 7.30005 5.63339 7.30005 7.90005V10.6H8.50005C10.3667 10.6 11.3 11.5334 11.3 13.4V19.3C11.3 21.3001 10.3667 22.3001 8.50005 22.3001H2.90005C1.16672 22.3001 0.300049 21.3001 0.300049 19.3V9.40005C0.300049 3.66672 3.26672 0.800049 9.20005 0.800049Z" />
                </svg>
              </div>
              <p className="text-2xl md:text-left text-center font-medium ">
                "With VoiceStack, we saw a 15% increase in new patient growth."
              </p>
              <div className="flex flex-col md:text-left text-center">
                <span className="font-medium"> Himesh Kana </span>
                <span>CEO, Dental Depot DFW</span>
              </div>
            </div>
          </div>

          {/* <div className="flex flex-col items-center gap-4">
             <Button type="primary" link="https://share.hsforms.com/1NRK3g7SnRLmCEEBi1qjzfg2vkpl" target="_blank">Secure My Spot</Button>
            <p>
              <span className="text-red-600">*</span>
              <span className="text-sm text-white/60 ml-1">
                Limited seats available
              </span>
            </p>
          </div> */}
          <CtaButton></CtaButton>
        </Container>

        <div className="w-[2000px] h-[500px] bg-[#ff236c] rounded-full -rotate-45 blur-[200px] bg-opacity-40 absolute bottom-0 z-0 left-0"></div>

        <div className="absolute w-full h-full bg-blend-color opacity-10 border top-0 bottom-0">
          <Image
            className={`w-full h-full saturate-0 object-cover`}
            sizes="min(1200px, 100vw)"
            alt="image"
            loading="eager"
            src="/assets/events/bg-dinner.png"
              width={200}
              height={200}
          />
        </div>
        
      </Section>

      <Section className="flex py-2 md:py-32  leading-[1.375]0 bg-gray-50">
        <Container className="flex flex-col items-center px-4">
          <div className="text-center text-2xl md:text-4xl md:max-w-3xl">
            Discover our{' '}
            <span className=" text-vs-purple">AI-driven phone system</span>{' '}
            custom-made for dental practices.
          </div>

          <div className=" md:text-xl text-lg leading-normal text-center md:max-w-3xl mt-2 text-gray-500">
            Analyze phone calls, identify missed opportunities, and re-engage
            with prospects. Increase new patient growth with state-of-the-art
            features, including Call Transcriptions, Call Analytics, Two-way
            Texts & more.
          </div>
        </Container>
      </Section>

      <Section className="md:py-32 py-2 leading-[1.375]4">
        <Container className="md:gap-20 gap-8 flex-col items-center px-4">
          <H2 className="text-center">
            How VoiceStack can{' '}
            <span className=" text-vs-purple">revolutionise</span> your
            practice.
          </H2>

          <div className="flex md:flex-row flex-col w-full md:gap-16 gap-8 items-center md:max-w-5xl max-w-max">
            <div className="bg-gray-100 md:w-1/2 w-full h-full border min-h-[300px] rounded-md">
              <Image
                className="w-full h-full object-cover bg-purple-200 rounded-lg"
                alt="Simon Chard"
                src="/assets/events/b.png"
                sizes="min(500px, 100vw)"
                loading="eager"
              width={200}
              height={200}
              />
            </div>

            <ul className="md:w-1/2 w-full flex flex-col">
              {features.map((feature: any, index:number) => {
                return (
                  <li className="flex items-start gap-2 md:text-xl text-lg border-b py-4" key={index}>
                    <span className="text-vs-purple py-1">
                      <TickSolidIcon></TickSolidIcon>
                      </span> <span>{feature}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <CtaButton></CtaButton>
        </Container>
      </Section>

      <Section
        id="features"
        className="flex w-full justify-center relative bg-purple-50"
      >
        <Container className="flex flex-col z-10 md:py-32 py-2 leading-[1.375]4 px-8 gap-3">
          <div className="flex gap-3 flex-col items-center text-center">
            <H2 className="md:!text-4xl">
              Integrated AI to{' '}
              <span className=" text-vs-purple">supercharge</span> <br /> your
              practice workflows.
            </H2>
          </div>

          <div className="grid md:grid-cols-3 mt-8 gap-4">
            {/* <!-- CARD STARTS --> */}
            <div className="flex flex-col bg-white py-8 px-8 rounded-xl gap-1">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center p-2 w-11 h-11 rounded text-vs-purple bg-purple-50">
                  <PhoneIcon></PhoneIcon>
                </div>

                <H3>Enterprise VOIP System</H3>
              </div>
              <ul>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>IVR & Call Routing</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Call Pop w/ Patient Details</Subtext>
                </li>

                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Visual Voicemail</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Missed Call Response Tracking</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Call Flow Analytics</Subtext>
                </li>
              </ul>
            </div>

            {/* <!-- CARD ENDS --> */}

            {/* <!-- CARD STARTS --> */}
            <div className="flex flex-col bg-white py-8 px-8 rounded-xl gap-1 ">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center p-2 w-11 h-11 rounded text-vs-purple bg-purple-50">
                  <BoltIcon></BoltIcon>
                </div>
                <H3>AI Features</H3>
              </div>
              <ul>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Call Summary</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Tx Detection</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Call Outcome Analysis</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Intelligent Missed Call Text</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Missed Opportunity Tracking</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Post Call Task Automation</Subtext>
                </li>
              </ul>
            </div>

            {/* <!-- CARD ENDS --> */}

            {/* <!-- CARD STARTS --> */}
            <div className="flex flex-col bg-white py-8 px-8 rounded-xl gap-1">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center p-2 w-11 h-11 rounded text-vs-purple bg-purple-50">
                  <StarIcon></StarIcon>
                </div>
                <H3>Call Attribution</H3>
              </div>
              <ul>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Call Source Tracking</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Ad Keywords Tracking</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Campaigns Tracking</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Google Analytics Integration</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Google Adwords Integration</Subtext>
                </li>
                <li>
                  <Subtext className='text-gray-600 font-light !text-[16px] !py-3 leading-[1.375] border-b border-[#e5e7eb]'>Call Scoring</Subtext>
                </li>
              </ul>
            </div>
          </div>

          <slot></slot>
        </Container>
      </Section>

      <Section className="md:py-32 py-2 leading-[1.375]4 bg-white overflow-hidden">
        <Container className="flex-col items-center rounded-3xl px-4 md:gap-16 gap-8">
          <div className="max-w-3xl flex text-center flex-col gap-4">
            <H2>
              If you&apos;re ready to transform your practice,{' '}
              <span className=" text-vs-purple">this dinner and demo</span> is
              for you.
            </H2>

            <Paragraph>
              Join us to experience how VoiceStack&apos;s AI-driven phone system can
              supercharge your practice.
            </Paragraph>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 md:p-4 p-0 w-full">
            <Image
              className="w-full h-auto bg-cover rounded overflow-hidden"
              alt="Event 1"
              src="/assets/events/uk/1.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
            <Image
              className="w-full h-auto bg-cover rounded overflow-hidden"
              alt="Event 2"
              src="/assets/events/uk/2.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
            <Image
              className="w-full h-auto bg-cover rounded overflow-hidden"
              alt="Event 3"
              src="/assets/events/uk/3.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
            <Image
              className="w-full h-auto bg-cover rounded overflow-hidden"
              alt="Event 4"
              src="/assets/events/uk/4.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
            <Image
              className="w-full h-auto bg-cover rounded overflow-hidden"
              alt="Event 5"
              src="/assets/events/uk/5.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
            <Image
              className="w-full md:block hidden h-auto bg-cover rounded overflow-hidden"
              alt="Event 6"
              src="/assets/events/uk/6.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
            <Image
              className="w-full md:block hidden h-auto bg-cover rounded overflow-hidden"
              alt="Event 7"
              src="/assets/events/uk/7.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
            <Image
              className="w-full md:block hidden h-auto bg-cover rounded overflow-hidden"
              alt="Event 8"
              src="/assets/events/uk/8.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
            <Image
              className="w-full md:block hidden h-auto bg-cover rounded overflow-hidden"
              alt="Event 9"
              src="/assets/events/uk/9.png"
              sizes="min(250px, 100vw)"
              loading="eager"
              width={200}
              height={200}
            />
          </div>

          <CtaButton></CtaButton>
        </Container>
      </Section>

      <Section className="md:py-32 py-2 leading-[1.375]4 bg-purple-50">
        <Container className="flex-col items-center gap-16 px-4">
          <div className="text-center sm:max-w-3xl w-full gap-4 flex flex-col">
            <H2>Who else is attending?</H2>
            <Paragraph>
              Ambitious practice owners, managers, and dental professionals
              eager to build or grow their practices with the right systems.
            </Paragraph>
          </div>

          <div className="flex sm:flex-row flex-col sm:max-w-5xl max-w-max rounded-2xl overflow-hidden items-center bg-purple-100">
            <div className="sm:flex hidden w-auto h-full bg-purple-400 relative">
              <Image
                className="w-full sm:max-w-sm max-w-max min-h-full h-full object-cover bg-purple-400"
                alt="Mide Ojo"
                src="/assets/events/mide-ojo.png"
                sizes="min(600px, 100vw)"
                loading="eager"
              width={200}
              height={200}
              />
            </div>

            <div className=" w-full flex flex-col gap-4 md:p-12 p-8">
              <h3 className="sm:text-2xl text-xl font-semibold">
                “If you&apos;re looking to take your practice to the next level,
                I highly recommend attending.”
              </h3>
              <p className="text-base">
                As a practice owner, staying updated is key, which is why I
                attended the Dinner and Demo event—and I&apos;m so glad I did.
                The experience was eye-opening.
              </p>
              <div className="flex flex-col">
                <span className="font-semibold">Dr. Mide Ojo</span>
                <span>Practice Owner, Refresh Dental Health</span>
              </div>
            </div>
          </div>

          <CtaButton></CtaButton>
        </Container>
      </Section>

      <Section className="bg-gray-950 md:py-32 py-2 leading-[1.375]4 text-white ">
        <Container className="flex-col items-center gap-16 px-8">
          <div className="text-center md:max-w-3xl gap-4 flex flex-col">
            <H2>Frequently Asked Questions</H2>
            {/* <!-- <Paragraph>
                        Ambitious practice owners, managers, and dental professionals
                        eager to build or grow their practices with the right systems.
                    </Paragraph> --> */}
          </div>

          <ul className="flex flex-col max-w-4xl">
            <li className="py-6 border-b border-white/10">
              <p className="text-xl font-medium">
                What should I expect from the event?
              </p>
              <p className="text-base text-gray-500">
                An intimate dinner combined with a live demonstration of
                VoiceStack&apos;s software. Ask questions and network with
                peers.
              </p>
            </li>
            <li className="py-6 border-b border-white/10">
              <p className="text-xl font-medium">How long will the event be?</p>
              <p className="text-base text-gray-500">
                Plan for approximately 2.5 hours, including dinner, the demo,
                and an interactive Q&A session.
              </p>
            </li>
            <li className="py-6 border-b border-white/10">
              <p className="text-xl font-medium">
                Do I need to pre-order my food?
              </p>
              <p className="text-base text-gray-500">
                Prior to the presentation starting the restaurant will take all food orders for dinner service.  
                At the conclusion of the demonstration, dinner service will begin promptly after.
              </p>
            </li>
            <li className="py-6 border-b border-white/10">
              <p className="text-xl font-medium">
                Do I need to bring anything?
              </p>
              <p className="text-base text-gray-500">
                Just bring your curiosity and appetite. We&apos;ve got the rest
                covered.
              </p>
            </li>
            <li className="py-6 border-b border-white/10">
              <p className="text-xl font-medium">
                What happens after I reserve my spot?
              </p>
              <p className="text-base text-gray-500">
                Immediately following registration you will receive an automated email confirmation.
              </p>
            </li>
            
          </ul>

          
          <CtaButton></CtaButton>
        </Container>
      </Section>
        <footer className="flex w-full justify-center py-8 bg-gray-50 px-8 text-center">
          <p>&copy;2017 - 2024 Good Methods Global Inc. All rights reserved.</p>
        </footer>
    </>
  )
}

export default DinnerDemo;

const CtaButton = () => {
  return(
    <div className="flex flex-col items-center gap-4">
        <Button type="primaryLg" link="https://carestack.regfox.com/voicestack-dinner--demo" target="_blank">Secure My Spot</Button>
      {/* <p>
        <span className="text-red-600">*</span>
        <span className="text-sm text-white/60 ml-1">
          Limited seats available
        </span>
      </p> */}
    </div>
  )
}
