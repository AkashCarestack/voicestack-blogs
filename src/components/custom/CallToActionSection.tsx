import React from 'react'
import { urlForImage } from '~/lib/sanity.image'

interface CallToActionSectionProps {
  data: {
    title?: string
    description?: string
    primaryButton?: {
      text: string
      link: string
    }
    secondaryButton?: {
      text: string
      link: string
    }
    backgroundImage?: any
    overlay?: boolean
  }
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ data }) => {
  if (!data) return null

  const { title, description, primaryButton, secondaryButton, backgroundImage, overlay } = data

  return (
    <section 
      className="relative py-20"
      style={{
        backgroundImage: backgroundImage ? `url(${urlForImage(backgroundImage)})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      )}
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {title && (
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              backgroundImage ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h2>
          )}
          {description && (
            <p className={`text-xl mb-8 ${
              backgroundImage ? 'text-gray-200' : 'text-gray-600'
            }`}>
              {description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryButton && (
              <a
                href={primaryButton.link}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {primaryButton.text}
              </a>
            )}
            {secondaryButton && (
              <a
                href={secondaryButton.link}
                className={`px-8 py-4 rounded-lg text-lg font-semibold transition-colors ${
                  backgroundImage 
                    ? 'bg-white text-gray-900 hover:bg-gray-100' 
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToActionSection
