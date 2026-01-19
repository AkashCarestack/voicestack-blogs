'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import Button from './common/Button'
import Section from './structure/Section'
import Container from './structure/Container'

interface IntegrationCategory {
  _id: string
  name: string
  subheading?: string
  description?: string
  mainImage?: any
  icon?: any
  iconSvgCode?: string
  language: string
}

interface IntegrationList {
  _id: string
  title: string
  headline: string
  description?: any
  shortDescription?: string
  image?: any
  link?: string
  integrationCategory?: {
    _id: string
    name: string
    subheading?: string
    description?: string
    mainImage?: any
    icon?: any
    iconSvgCode?: string
  }
  language: string
}

interface IntegrationsSectionProps {
  className?: string
}

const IntegrationsSection: React.FC<IntegrationsSectionProps> = ({ className = '' }) => {
  const router = useRouter()
  const [integrations, setIntegrations] = useState<IntegrationList[]>([])
  const [loading, setLoading] = useState(true)
  // Render integration icon
  const renderIntegrationIcon = (integration: IntegrationList) => {
    if (integration.image && integration.image.asset?.url) {
      return (
        <img
          src={urlForImage(integration.image, { width: 60, height: 60 })}
          alt={integration.title}
          className="w-full h-full object-contain"
        />
      )
    } else if (integration.integrationCategory?.iconSvgCode) {
      return (
        <div 
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{
            __html: integration.integrationCategory.iconSvgCode
          }}
        />
      )
    } else if (integration.integrationCategory?.icon?.asset?.url) {
      return (
        <img
          src={urlForImage(integration.integrationCategory.icon, { width: 60, height: 60 })}
          alt={integration.title}
          className="w-full h-full object-contain"
        />
      )
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <Section className={`py-16 bg-gradient-to-r from-[#f4f3fa] to-[#f4f3fa] ${className}`}>
        <Container className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vs-blue mx-auto mb-4"></div>
            <p className="text-gray-600 font-geist">Loading integrations...</p>
          </div>
        </Container>
      </Section>
    )
  }

  if (integrations.length === 0) {
    return (
      <Section className={`py-16 bg-gradient-to-r from-[#f4f3fa] to-[#f4f3fa] ${className}`}>
        <Container className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 font-geist">No integrations found.</p>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section className={`py-16 bg-gradient-to-r from-[#f4f3fa] to-[#f4f3fa] relative overflow-hidden ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-20 mix-blend-multiply">
        <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl transform rotate-12"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-20 mix-blend-multiply">
        <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl transform -rotate-12"></div>
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col items-center gap-16">
          {/* Header Section */}
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-manrope leading-tight">
              Centralize Your Work to Make Informed Strategic Choices.
            </h2>
            <p className="text-lg text-[#364153] leading-7 font-geist">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Integrations Grid */}
          <div className="flex flex-wrap gap-8 justify-center items-end max-w-6xl">
            {integrations.map((integration, index) => (
              <div 
                key={integration._id} 
                className="flex flex-col items-center justify-end h-[70px] group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Integration Icon */}
                <div className="bg-gradient-to-b from-[#4a3ce1] to-[#191078] relative rounded-xl w-15 h-15 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 border-2 border-white/20 rounded-xl" />
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                    {renderIntegrationIcon(integration)}
                  </div>
                </div>
                
                {/* Integration Name Label */}
                <div className="absolute bg-[#efeeea] bottom-[-20px] px-1 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs font-geist text-[#52525c] whitespace-nowrap">
                    {integration.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 items-center">
            <Button type="primary" className="relative group">
              <span className="relative z-10">Book Free Demo</span>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <img 
                  alt="" 
                  className="w-[126px] h-5" 
                  src="https://www.figma.com/api/mcp/asset/89d097ba-a132-4455-a205-8c940c5e8693" 
                />
              </div>
            </Button>
            
            <Button type="secondary" className="bg-black/5 hover:bg-black/10 border-2 border-purple-200/15">
              See All Integrations
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default IntegrationsSection

