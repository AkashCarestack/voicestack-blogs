import React from 'react'
import Button from '~/components/common/Button'

interface Feature {
  id: string
  title: string
  [key: string]: any
}

interface CategoryFeatures {
  [categoryKey: string]: Feature[]
}

interface CTACardProps {
  title?: string
  buttonText?: string
  buttonLink?: string
}

interface FeatureCategoryGridProps {
  groupedData: CategoryFeatures
  getCategoryDisplayName: (key: string) => string
  ctaCard?: CTACardProps
}

const TickIcon = () => {
  return (
    <span className="mt-[6px]">
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

const FeatureCategoryGrid: React.FC<FeatureCategoryGridProps> = ({
  groupedData,
  getCategoryDisplayName,
  ctaCard,
}) => {
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-6 justify-center md:py-32 py-6">
      {Object.entries(groupedData).map(
        ([categoryKey, categoryFeatures]: [string, Feature[]]) => {
          const categoryName = getCategoryDisplayName(categoryKey)
          const categoryIcon = categoryFeatures[0]?.icon

          return (
            <div
              key={categoryKey}
              className="bg-[#F4F3FA] w-full h-full md:p-8 p-6 md:rounded-[24px] rounded-[12px] flex flex-col"
            >
              {categoryIcon && (
                <div
                  className="w-fit md:mb-6 mb-4 bg-[#E0DDFF] md:px-6 px-4 md:py-3 py-2 rounded-full"
                  dangerouslySetInnerHTML={{ __html: categoryIcon }}
                />
              )}
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-950 pb-4">
                {categoryName}
              </h3>

              {categoryFeatures.map((feature: Feature) => (
                <div
                  key={feature.id}
                  className="flex md:py-2 py-1 items-start md:gap-3 gap-2 border-b-[#E6E7E8] last:border-b-0 border-b"
                >
                  <TickIcon />
                  <h4 className="font-geist md:text-base text-xs leading-[150%] text-gray-900">
                    {feature.title}
                  </h4>
                </div>
              ))}
            </div>
          )
        },
      )}
      {/* CTA Card */}
      {ctaCard && (
        <div className="bg-vs-blue backdrop-blur-sm md:rounded-3xl md:h-full h-[241px] rounded-xl py-6 md:px-12 px-6 flex flex-col justify-center items-center md:gap-6 gap-4 hover:bg-vs-blue transition-all">
          {ctaCard.title && (
            <h3 className="md:text-xl text-lg font-bold text-white font-manrope text-center">
              {ctaCard.title}
            </h3>
          )}
          <Button
            type="primary"
            className="w-fit"
            link={ctaCard.buttonLink || '/demo'}
          >
            <span>{ctaCard.buttonText || 'Book Free Demo'}</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default FeatureCategoryGrid

