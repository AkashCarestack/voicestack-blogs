import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

import SuperChargeIcon from '~/components/icons/superCharge'
import { BookDemoContext } from '~/providers/BookDemoProvider'

import Button from '../../common/Button'
import { VideoItem } from '../../common/VideoModal'
import Container from '../../structure/Container'

const HeroSection = ({ data, refer = null, video }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const router = useRouter();
  const videoId = router.locale == "en" ? "3CsThXKvcvRrR3hwRsWWJY" : "Hj4GYLXARVjqQEnaejq3Bz";

  const overviewVideo: VideoItem = {
    videoPlatform: 'vidyard',
    videoId: videoId,
  }

  const [activeIndex, setActiveIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const searchParams = useSearchParams();
  const source2 = searchParams.get("source"); // Get 'source' param from URL

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-white font-inter text-lg font-medium leading-[160%] text-center max-w-[600px] w-full">
          {children}
        </p>
      ),
    },
  }
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext)
  


  useEffect(()=>{
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
      document.body.appendChild(script);
  },[])

  return (
    <section className="min-h-screen bg-[#F9F9F9] px-12 pt-3 pb-6 font-geist">
         <div className=" rounded-[24px] bg-[linear-gradient(270deg,rgba(202,197,255,0.70)_0%,rgba(202,197,255,0.15)_51.44%,rgba(202,197,255,0.20)_100%)] justify-center">
         <Container className='justify-center py-12'>
        <div className="">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Feature Tag */}
              <div className="inline-flex items-center space-x-2 rounded-full border border-[rgba(174,160,255,0.20)] bg-[rgba(174,160,255,0.20)] py-[9px] pl-4 pr-[14px]">
               <SuperChargeIcon/>
                <span className="text-sm font-medium text-gray-950">Supercharge Your Practice Growth</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope">
                  <span className="text-vs-purple">AI Powered</span>
                  <br />
                  <span className="text-gray-950">Enterprise Phone System</span>
                  <br />
                  <span className="text-gray-950">to Grow Your Practice.</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-950 leading-[28px] max-w-[607px] line-clamp-2 self-stretch">
                The most modern AI tools + The best enterprise phone system. For faster practice growth and more efficient workflows.
              </p>

              {data?.bookBtnContent && (
                <div className='flex gap-4'>
                    <Button type="primary">
                      <span className="rounded-[8px] border border-white/10 bg-[#B5EB92] px-6 py-2.5 text-black font-medium">
                       {data?.bookBtnContent[0]?.buttonText || "Book Free Demo"}
                      </span>
                    </Button>
                    <Button type="secondary">
                      {data?.bookBtnContent[1]?.buttonText || "See Pricing"}
                    </Button>
                  </div>
                  )}
                
            </div>

            {/* Right Content - Abstract Graphics */}
            <div className="relative">
              <div className="relative w-full h-full max-h-[550px]">
              
              </div>
            </div>
          </div>
        </div>
        </Container>
      </div>
    </section>
  )
}

export default HeroSection
