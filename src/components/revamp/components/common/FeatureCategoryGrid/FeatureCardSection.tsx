import React from 'react'

interface Feature {
  id?: string
  _id?: string
  _key?: string
  title?: string
  name?: string
  heading?: string
  description?: string
  [key: string]: any
}

interface FeatureCardSectionProps {
  // Card header
  cardTitle: string
  cardIcon?: string
  showTitle?: boolean
  showTickIcon?: boolean
  
  // Features list
  features: Feature[]
  
  // Field mapping for features
  featureIdField?: string | ((feature: Feature) => string)
  featureTitleField?: string | ((feature: Feature) => string)
  
  // Custom className
  className?: string
}

const TickIcon = () => {
  return (
    <span className="md:mt-[6px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.3631 3.32223C13.4259 3.36993 13.4787 3.42956 13.5185 3.49769C13.5583 3.56583 13.5842 3.64114 13.5948 3.71931C13.6055 3.79748 13.6006 3.87698 13.5804 3.95325C13.5603 4.02953 13.5253 4.10109 13.4775 4.16383L7.07749 12.5638C7.02558 12.6319 6.95971 12.688 6.8843 12.7285C6.8089 12.769 6.72571 12.7929 6.64031 12.7986C6.55492 12.8042 6.46929 12.7916 6.38919 12.7615C6.30909 12.7313 6.23636 12.6844 6.17589 12.6238L2.57589 9.02383C2.46991 8.91009 2.41221 8.75965 2.41495 8.60421C2.41769 8.44877 2.48066 8.30046 2.59059 8.19053C2.70052 8.0806 2.84883 8.01763 3.00427 8.01489C3.15971 8.01215 3.31015 8.06985 3.42389 8.17583L6.53909 11.2902L12.5231 3.43663C12.6194 3.31019 12.7619 3.22713 12.9194 3.20569C13.0769 3.18424 13.2365 3.22615 13.3631 3.32223Z"
          fill="#030712"
        />
      </svg>
    </span>
  )
}

const FeatureCardSection: React.FC<FeatureCardSectionProps> = ({
  cardTitle,
  cardIcon,
  features,
  featureIdField = '_key',
  featureTitleField = 'title',
  className = '',
  showTickIcon = true,
}) => {
  const getFieldValue = (item: any, field: string | ((item: any) => any), fallback: any = ''): any => {
    if (!field) return fallback
    if (typeof field === 'function') {
      return field(item)
    }
    return item?.[field] ?? fallback
  }

  const getFeatureId = (feature: Feature): string => {
    const id = getFieldValue(feature, featureIdField)
    if (id) return String(id)
    return feature.id || feature._id || feature._key || Math.random().toString()
  }

  const getFeatureTitle = (feature: Feature): string => {
    const title = getFieldValue(feature, featureTitleField)
    if (title) return String(title)
    return feature.title || feature.name || feature.heading || ''
  }

  return (
    <div className={`bg-[#F4F3FA] w-full h-full md:p-6 p-3 md:rounded-[24px] rounded-[12px] flex flex-col ${className}`}>
      {cardIcon && (
        <div
          className="w-fit md:mb-6 mb-4 bg-[#E0DDFF] md:px-6 px-4 md:py-3 py-2 rounded-full"
          dangerouslySetInnerHTML={{ __html: cardIcon }}
        />
      )}
      {/* Card Title */}
      <h3 className="text-xl md:mb-6 mb-4 font-manrope font-bold text-gray-950 ">
        {cardTitle}
      </h3>

      {/* Features List */}
      <ul className="flex flex-col">
        {features.map((feature: Feature) => {
          const featureId = getFeatureId(feature)
          const featureTitle = getFeatureTitle(feature)
          const showTitle = cardTitle !== featureTitle // Don't show duplicate if card title matches feature title
          
          return (
            <li
              key={featureId}
              className="flex md:py-3.5 py-2  md:gap-3 gap-2 border-b-[#E6E7E8] last:border-b-0 border-b"
            >
            {showTickIcon && <TickIcon />}
              {showTitle ? (
                <h4 className="font-geist md:text-base text-xs leading-[150%] text-gray-900">
                  {featureTitle}
                </h4>
              ) : (
                feature.description && (
                  <p className="font-geist md:text-base text-xs leading-[150%] text-gray-700">
                    {feature.description}
                  </p>
                )
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FeatureCardSection

