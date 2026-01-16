import React from 'react'

interface Feature {
  id?: string
  _id?: string
  _key?: string
  title?: string
  subheading?: string
  name?: string
  heading?: string
  description?: string
  [key: string]: any
}

interface FeatureCardSectionProps {
  // Card header
  cardTitle: string
  cardSubheading?: string
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

const TickIcon = ({ color }: { color?: string }) => {
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
          fill={color || '#030712'}
        />
      </svg>
    </span>
  )
}

const FeatureCardSection: React.FC<FeatureCardSectionProps> = ({
  cardTitle,
  cardSubheading,
  cardIcon,
  features,
  featureIdField = '_key',
  featureTitleField = 'title',
  className = '',
  showTickIcon = true,
}) => {
  const getFieldValue = (
    item: any,
    field: string | ((item: any) => any),
    fallback: any = '',
  ): any => {
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
    <div
      className={`bg-white w-full h-full md:px-6 md:py-8 px-3 py-4 flex flex-col border-b border-gray-200 border-t  ${className}`}
    >
      <div className="flex flex-col gap-1 px-3 md:px-6 mb-4 md:mb-8">
        {/* Category Label - Purple */}
        <h3 className="font-geist font-normal text-sm md:text-base text-[#7C3AED] mb-2">
          {cardTitle}
        </h3>

        {/* Card Subheading - Bold Title */}
        {cardSubheading && (
          <h4 className="text-lg md:text-xl font-medium text-gray-950 leading-[140%]">
            <p dangerouslySetInnerHTML={{ __html: cardSubheading }} />
            </h4>
        )}
      </div>

      {/* Key Features Label */}
      <p className="font-geist font-medium text-sm md:text-lg text-gray-950/50 mb-3 px-3 md:px-6">
        Key Features
      </p>

      {/* Features List */}
      <ul className="flex flex-col">
        {features.map((feature: Feature) => {
          const featureId = getFeatureId(feature)
          const featureTitle = getFeatureTitle(feature)

          return (
            <li
              key={featureId}
              className="flex py-2 gap-2 items-start text-gray-700"
            >
              {showTickIcon && <TickIcon color="#99A1AF" />}
              <span className="font-geist text-sm md:text-base leading-[150%] text-gray-700">
                {featureTitle}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FeatureCardSection
