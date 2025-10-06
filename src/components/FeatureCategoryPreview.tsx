import React from 'react'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { urlForImage } from '~/lib/sanity.image'

interface FeatureCategoryPreviewProps {
  name: string
  countryFlag?: SanityImageSource
  language?: string
}

const FeatureCategoryPreview: React.FC<FeatureCategoryPreviewProps> = ({ 
  name, 
  countryFlag, 
  language 
}) => {
  const getLanguageFlag = () => {
    if (countryFlag) {
      return urlForImage(countryFlag, { width: 20, height: 15 })
    }
    
    // Fallback to default flags based on language
    switch (language) {
      case 'en':
        return '/assets/countryFlags/EN-usa.png'
      case 'en-GB':
        return '/assets/countryFlags/EN-GB.png'
      case 'en-AU':
        return '/assets/countryFlags/EN-AU.png'
      default:
        return '/assets/countryFlags/EN-usa.png'
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {countryFlag && (
        <img 
          src={getLanguageFlag()} 
          alt={`${language} flag`}
          style={{ 
            width: '20px', 
            height: '15px', 
            objectFit: 'cover',
            borderRadius: '2px'
          }} 
        />
      )}
      <span>{name}</span>
    </div>
  )
}

export default FeatureCategoryPreview
