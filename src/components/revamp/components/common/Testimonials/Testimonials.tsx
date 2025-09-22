import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Button from '~/components/common/Button'
import { FormModal } from '~/components/common/FormModal'
import { VideoItem, VideoModal } from '~/components/common/VideoModal'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { BookDemoContext } from '~/providers/BookDemoProvider'

export default function Testimonials({ data, refer = null }) {
  const [openForm, setOpenForm] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [stickyStates, setStickyStates] = useState<boolean[]>([]) // Tracks if each card is sticky
  const [activeTab, setActiveTab] = useState('emerging-groups')
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
        description: 'Comprehensive solutions for large dental service organizations with multi-location management and advanced analytics.',
        metrics: [
          { value: '95%', label: 'Call Answer Rate' },
          { value: '78%', label: 'Conversion Rate' },
          { value: '$125,000', label: 'Additional Revenue' }
        ],
        testimonial: {
          name: 'Dr. Sarah Johnson',
          title: 'CEO, Premier Dental Group',
          location: 'California, United States',
          locations: '12 Locations',
          image: '/assets/testimonials/enterprise-ceo.jpg'
        }
      }
    },
    {
      id: 'emerging-groups',
      label: 'Emerging Groups',
      content: {
        title: 'Emerging Groups',
        description: 'Highly scalable across locations, with configurability for unique workflows and full-cycle patient relationship management.',
        metrics: [
          { value: '84%', label: 'Conversion rate from first-time inquiries' },
          { value: '90%', label: 'Call Answer Rate' },
          { value: '$87,000', label: 'in 90 days Estimated Additional Revenue' }
        ],
        testimonial: {
          name: 'Katie Post',
          title: 'CEO, Northwest Dental Group',
          location: 'Minnesota, United States',
          locations: '04 Locations',
          image: '/assets/testimonials/emerging-ceo.jpg'
        }
      }
    },
    {
      id: 'independent-practices',
      label: 'Independent Practices',
      content: {
        title: 'Independent Practices',
        description: 'Personalized solutions for single-location practices with focus on patient experience and operational efficiency.',
        metrics: [
          { value: '92%', label: 'Patient Satisfaction' },
          { value: '85%', label: 'Appointment Conversion' },
          { value: '$45,000', label: 'Monthly Revenue Increase' }
        ],
        testimonial: {
          name: 'Dr. Michael Chen',
          title: 'Owner, Downtown Dental Care',
          location: 'Texas, United States',
          locations: '01 Location',
          image: '/assets/testimonials/independent-owner.jpg'
        }
      }
    },
    {
      id: 'specialty-practices',
      label: 'Specialty Practices',
      content: {
        title: 'Specialty Practices',
        description: 'Specialized tools for orthodontics, oral surgery, and other dental specialties with custom workflow integration.',
        metrics: [
          { value: '88%', label: 'Treatment Acceptance Rate' },
          { value: '94%', label: 'Patient Retention' },
          { value: '$65,000', label: 'Quarterly Growth' }
        ],
        testimonial: {
          name: 'Dr. Lisa Rodriguez',
          title: 'Orthodontist, Smile Perfect',
          location: 'Florida, United States',
          locations: '02 Locations',
          image: '/assets/testimonials/specialty-ortho.jpg'
        }
      }
    }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)?.content

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

  return (
    <Section className="relative py-sm md:py-md pb-8 bg-[#F9F9F9]">
      <Container className="w-full relative">
        <div className="flex flex-col items-center w-full gap-16">
          <div className="flex justify-center w-full">
            <div className="flex flex-col w-full max-w-[780px] text-center gap-4">
            
            Heading here
            paragraph here
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex w-full justify-center">
            <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex w-full gap-12 z-10 relative">
            <div className="w-full relative">
              <div className="flex flex-col lg:flex-row w-full gap-8">
                {/* Left Panel - Description */}
                <div className="flex-1 bg-purple-100 rounded-2xl p-8">
                  <div className="flex flex-col gap-6">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{activeTabData?.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{activeTabData?.description}</p>
                    </div>
                    <a href="#" className="text-purple-600 font-medium underline decoration-dotted">
                      Learn More
                    </a>
                  </div>
                </div>

                {/* Right Panel - Testimonial */}
                <div className="flex-1 flex flex-col lg:flex-row gap-4">
                  {/* Metrics Section */}
                  <div className="flex-1 bg-gray-900 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                    <div className="relative z-10 flex flex-col gap-6">
                      {activeTabData?.metrics.map((metric, index) => (
                        <div key={index} className="text-white">
                          <div className="text-3xl font-bold">{metric.value}</div>
                          <div className="text-sm text-gray-300">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                    {/* Profile Image */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {activeTabData?.testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 bg-purple-600 rounded-2xl p-8 text-white">
                    <div className="flex flex-col gap-4">
                      {/* Logo placeholder */}
                      <div className="w-16 h-8 bg-white rounded flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">LOGO</span>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-bold">{activeTabData?.testimonial.name}</h4>
                        <p className="text-purple-200">{activeTabData?.testimonial.title}</p>
                      </div>
                      
                      <div className="text-sm text-purple-200">
                        <p>{activeTabData?.testimonial.location}</p>
                        <p className="font-medium">{activeTabData?.testimonial.locations}</p>
                      </div>
                    </div>
                  </div>
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
                      {/* {data?.bookBtnContent[0]?.buttonText || */}
                          {'Book Free Demo'}
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
