import { isEmpty } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef, useState } from 'react'

import Button from '~/components/common/Button'
import { FormModal } from '~/components/common/FormModal'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { VideoItem, VideoModal } from '~/components/common/VideoModal'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { BookDemoContext } from '~/providers/BookDemoProvider'

import SectionHeader from '../sectionHeader'
import SwitchableTabs from '../switchableTabs'
import IconBadge from '../iconBadge'

export default function Testimonials({ data, refer = null }) {
  const [openForm, setOpenForm] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [stickyStates, setStickyStates] = useState<boolean[]>([]) // Tracks if each card is sticky
  const [activeTab, setActiveTab] = useState<string>('emerging-groups')
  const { isDemoPopUpShown } = useContext(BookDemoContext)
  const router = useRouter()

  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsOpen(true)
  }

  const tabs = [
    {
      id: 'enterprise-dsos',
      label: 'Enterprise DSOs',
      content: {
        title: 'Enterprise DSOs',
        description:
          'Comprehensive solutions for large dental service organizations with multi-location management and advanced analytics.',
        metrics: [
          { value: '95%', label: 'Call Answer Rate' },
          { value: '78%', label: 'Conversion Rate' },
          { value: '$125,000', label: 'Additional Revenue' },
        ],
        testimonial: {
          name: 'Dr. Sarah Johnson',
          title: 'CEO, Premier Dental Group',
          location: 'California, United States',
          locations: '12 Locations',
          image: '/edgedummy.png',
        },
      },
    },
    {
      id: 'emerging-groups',
      label: 'Emerging Groups',
      content: {
        title: 'Emerging Groups',
        description:
          'Highly scalable across locations, with configurability for unique workflows and full-cycle patient relationship management.',
        metrics: [
          { value: '84%', label: 'Conversion rate from first-time inquiries' },
          { value: '90%', label: 'Call Answer Rate' },
          {
            value: '$87,000',
            label: 'in 90 days Estimated Additional Revenue',
          },
        ],
        testimonial: {
          name: 'Katie Post',
          title: 'CEO, Northwest Dental Group',
          location: 'Minnesota, United States',
          locations: '04 Locations',
          image: '/edgedummy.png',
        },
      },
    },
    {
      id: 'independent-practices',
      label: 'Independent Practices',
      content: {
        title: 'Independent Practices',
        description:
          'Personalized solutions for single-location practices with focus on patient experience and operational efficiency.',
        metrics: [
          { value: '92%', label: 'Patient Satisfaction' },
          { value: '85%', label: 'Appointment Conversion' },
          { value: '$45,000', label: 'Monthly Revenue Increase' },
        ],
        testimonial: {
          name: 'Dr. Michael Chen',
          title: 'Owner, Downtown Dental Care',
          location: 'Texas, United States',
          locations: '01 Location',
          image: '/edgedummy.png',
        },
      },
    },
    {
      id: 'specialty-practices',
      label: 'Specialty Practices',
      content: {
        title: 'Specialty Practices',
        description:
          'Specialized tools for orthodontics, oral surgery, and other dental specialties with custom workflow integration.',
        metrics: [
          { value: '88%', label: 'Treatment Acceptance Rate' },
          { value: '94%', label: 'Patient Retention' },
          { value: '$65,000', label: 'Quarterly Growth' },
        ],
        testimonial: {
          name: 'Dr. Lisa Rodriguez',
          title: 'Orthodontist, Smile Perfect',
          location: 'Florida, United States',
          locations: '02 Locations',
          image: '/edgedummy.png',
        },
      },
    },
  ]

  const activeTabData = tabs.find((tab) => tab.id === activeTab)?.content

  useEffect(() => {
    const handleScroll = () => {
      const updatedStickyStates = data.map((_, index) => {
        const card = cardRefs.current[index]
        if (card) {
          const rect = card.getBoundingClientRect()
          // Check if the card is at the top of the viewport (sticky point)
          return rect.top <= 200
        }
        return false
      })
      setStickyStates(updatedStickyStates)
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup listener on unmount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data])

  if (isEmpty(data)) {
    return (
      <>
        <p>Testimonial Section is Loading...</p>
      </>
    )
  }

  const rightSectionLayout = () => {
    return (
      <div className="relative md:h-full md:min-h-[400px] md:mb-0 mb-4 rounded-[18px] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-[#CAC5FF] to-[#4A3CE1] flex left-0 right-0 top-0 bottom-0 absolute" />

        {/* mobile */}
        <div className="relative md:absolute flex flex-col md:flex-row bottom-0 w-full h-full md:hidden text-white p-3">
          <div className="flex flex-col py-8 px-4 gap-8">
            {/* Company Logo */}
            <div className="flex">
              <div className="w-20 h-10 bg-white rounded flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">
                  {activeTabData?.testimonial.title.split(',')[0]}
                </span>
              </div>
            </div>

            {/* Metrics Display */}
            <div className="flex flex-col gap-4">
              {activeTabData?.metrics.map((metric, index) => (
                <div key={index} className="text-white">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-purple-200">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 mb-4">
                <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {activeTabData?.testimonial.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  {activeTabData?.testimonial.name}
                </p>
                <p className=" text-white/60">
                  {activeTabData?.testimonial.title}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full bg-white/10 backdrop-blur-md py-8 px-4 text-white flex flex-col justify-between flex-1 gap-6">
            <div className="flex gap-12">
              <div>
                <p className="font-semibold ">
                  {activeTabData?.testimonial.location.split(',')[0]}
                </p>
                <p className="text-white/60">
                  {activeTabData?.testimonial.location.split(',')[1]?.trim()}
                </p>
              </div>
              <div>
                <p className="font-semibold ">
                  {activeTabData?.testimonial.locations}
                </p>
                <p className="text-white/60">
                  {activeTabData?.testimonial.locations.includes('+') ||
                  parseInt(activeTabData?.testimonial.locations) > 1
                    ? 'Locations'
                    : 'Location'}
                </p>
              </div>
            </div>
            <Button className="bg-[#C8F46E] text-tiber-950 text-base font-medium px-6 py-3 rounded-md border-none">
              Book Free Demo
            </Button>
          </div>
        </div>

        {/* desktop */}
        <div className="absolute md:flex flex-col md:flex-row bottom-0 w-full h-full hidden p-3 gap-3">
          <div className="relative flex-1 text-white flex w-full items-end h-full rounded-[12px] overflow-hidden">
            <Image
              src={activeTabData?.testimonial.image}
              alt={activeTabData?.testimonial.name}
              width={600}
              height={600}
              className="w-full h-full object-cover absolute left-0 right-0 top-0 bottom-0"
            />

            {/* Metrics overlay */}
            <div className="relative z-10 flex flex-col gap-4  p-4 md:p-8 flex-1">
              {activeTabData?.metrics.map((metric, index) => (
                <div key={index} className="text-white">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-purple-200">{metric.label}</div>
                </div>
              ))}
            </div>
            <div className="relative w-full max-w-[300px] h-[400px] flex flex-1 items-end justify-end">
              <Image
                src={activeTabData?.testimonial.image}
                alt={activeTabData?.testimonial.name}
                width={60}
                height={60}
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="w-full max-w-[215px] rounded-xl bg-black/20 backdrop-blur-[10px] gap-6 p-3 md:p-8 text-white flex flex-col justify-between">
            {/* Company Logo */}
            <div className="flex">
              <div className="w-20 h-10 bg-white rounded flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">
                  {activeTabData?.testimonial.title.split(',')[0]}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:gap-12">
              <div className="flex flex-col gap-4 text-sm md:text-base">
                <div className="flex flex-col">
                  <p className="font-semibold">
                    {activeTabData?.testimonial.name}
                  </p>
                  <p className=" text-white/60">
                    {activeTabData?.testimonial.title}
                  </p>
                </div>
                <div>
                  <p className="font-semibold ">
                    {activeTabData?.testimonial.location.split(',')[0]}
                  </p>
                  <p className="text-white/60">
                    {activeTabData?.testimonial.location.split(',')[1]?.trim()}
                  </p>
                </div>
                <div>
                  <p className="font-semibold ">
                    {activeTabData?.testimonial.locations}
                  </p>
                  <p className="text-white/60">
                    {activeTabData?.testimonial.locations.includes('+') ||
                    parseInt(activeTabData?.testimonial.locations) > 1
                      ? 'Locations'
                      : 'Location'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <Section className="relative py-sm md:py-md pb-8 bg-[#F9F9F9]">
      <Container className="w-full relative">
        <div className="flex flex-col items-center w-full gap-16">
          <div className="flex justify-center w-full">
            <SectionHeader
              heading="Success Stories from Our Clients"
              description="See how dental practices are transforming their operations with VoiceStack"
            />
          </div>

          {/* Tab Navigation */}
          <SwitchableTabs
            data={(tabs || []).map((e: any) => ({
              key: e.id,
              title: e.label,
              setActiveTab: (key: string) => setActiveTab(key),
            }))}
            setActiveTab={(e: any) => setActiveTab(e)}
          />
        

          {/* Tab Content */}
          <div className="flex w-full gap-8 z-10 relative">
            <div className="w-full relative">
              <div className="flex flex-col lg:flex-row w-full gap-8">
                {/* Left Panel - Description */}
                <div className="max-w-[292px] w-full bg-[#F0EFFA] rounded-[24px] p-7">
                  <div className="group flex flex-col gap-6 justify-between h-full">
                   <IconBadge/>
                    <div className="flex flex-col gap-6 items-start ">
                      <div className="">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {activeTabData?.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {activeTabData?.description}
                        </p>
                      </div>
                      <Button type="underline" >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Testimonial */}
                <div className="max-w-[936px] w-full">
                  {rightSectionLayout()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Button
              type="primary"
              className="w-fit"
              onClick={() => {
                setOpenForm(true)
              }}
            >
              <span className="rounded-[8px] border border-white/10 bg-[#B5EB92] px-6 py-2.5 text-black font-medium">
                Book Free Demo
              </span>
            </Button>
          </div>
        </div>
        {/* comment test */}
        {isOpen && (
          <VideoModal
            refer={refer}
            isPopup={true}
            videoDetails={selectedVideo}
            className={`pt-9 z-30 flex items-start`}
            onClose={() => setIsOpen(false)}
            openForm={() => setOpenForm(true)}
            hasDemoBanner={true}
          />
        )}
        {openForm && (
          <FormModal
            className={`pt-9  flex items-start`}
            onClose={() => setOpenForm(false)}
            data={isDemoPopUpShown}
          />
        )}
      </Container>
    </Section>
  )
}
