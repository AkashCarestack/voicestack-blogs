import React from 'react'
import { PreviewProps } from 'sanity'
import { urlFor } from '~/lib/sanity.image'

interface FeatureCategoryPreviewProps extends PreviewProps {
  title?: string
  countryFlag?: any
  language?: string
}

const FeatureCategoryPreviewComponent: React.FC<FeatureCategoryPreviewProps> = ({
  title,
  countryFlag,
  language,
  ...props
}) => {
  const getLanguageFlag = () => {
    if (countryFlag) {
      return urlFor(countryFlag).width(20).height(15).url()
    }
    
    // Fallback to emoji flags based on language
    switch (language) {
      case 'en':
        return '🇺🇸'
      case 'en-GB':
        return '🇬🇧'
      case 'en-AU':
        return '🇦🇺'
      default:
        return '🏷️'
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '16px' }}>{getLanguageFlag()}</span>
      <div>
        <div style={{ fontWeight: 'bold' }}>{title || 'Untitled Category'}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {language ? `${language.toUpperCase()}` : 'No language set'}
        </div>
      </div>
    </div>
  )
}

export default FeatureCategoryPreviewComponent
