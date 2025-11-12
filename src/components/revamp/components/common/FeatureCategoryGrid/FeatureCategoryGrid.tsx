import React from 'react'
import Button from '~/components/common/Button'
import FeatureCardSection from './FeatureCardSection'

interface Feature {
  id?: string
  _id?: string
  title?: string
  name?: string
  icon?: string
  [key: string]: any
}

interface CategoryCard {
  key: string
  name: string
  icon?: string
  features: Feature[]
}

interface CategoryFeatures {
  [categoryKey: string]: Feature[]
}

interface CTACardProps {
  title?: string
  buttonText?: string
  buttonLink?: string
}

interface FieldMapping {
  // Feature fields
  id?: string | ((item: any) => string) // Field name or function to get id
  title?: string | ((item: any) => string) // Field name or function to get title
  icon?: string | ((item: any) => string | undefined) // Field name or function to get icon
  
  // Category fields (for grouped data)
  categoryKey?: string | ((item: any) => string) // Field name or function to get category key
  categoryName?: string | ((key: string, item?: any) => string) // Field name or function to get category name
  categoryIcon?: string | ((items: Feature[]) => string | undefined) // Field name or function to get category icon
}

interface DataTransformer {
  getCategoryKey?: (item: any) => string
  getCategoryName?: (key: string, item?: any) => string
  getCategoryIcon?: (items: Feature[]) => string | undefined
  getFeatureId?: (feature: Feature) => string
  getFeatureTitle?: (feature: Feature) => string
}

interface FeatureCategoryGridProps {
  // Option 1: Pre-grouped data (current structure)
  groupedData?: CategoryFeatures
  getCategoryDisplayName?: (key: string) => string
  
  // Option 2: Raw data array with simple field mapping (EASIEST)
  data?: any[]
  fieldMapping?: FieldMapping
  
  // Option 3: Raw data array with transformer functions
  dataTransformer?: DataTransformer
  
  // Option 4: Pre-formatted category cards
  categoryCards?: CategoryCard[]
  
  // Display mode
  displayMode?: 'grouped' | 'individual' // 'grouped' = group by category, 'individual' = one card per item
  
  // CTA Card
  ctaCard?: CTACardProps
  
  // Custom className
  className?: string
}


const FeatureCategoryGrid: React.FC<FeatureCategoryGridProps> = ({
  groupedData,
  getCategoryDisplayName,
  data,
  fieldMapping,
  dataTransformer,
  categoryCards,
  displayMode = 'grouped',
  ctaCard,
  className = '',
}) => {
  // Helper function to get value from field mapping
  const getFieldValue = (
    item: any,
    field: string | ((item: any) => any) | undefined,
    fallback: any = undefined
  ): any => {
    if (!field) return fallback
    if (typeof field === 'function') {
      return field(item)
    }
    return item?.[field] ?? fallback
  }

  // Transform raw data into category cards if provided
  const transformDataToCards = (): CategoryCard[] => {
    if (categoryCards) {
      return categoryCards
    }

    // Simple field mapping approach (easiest to use)
    if (data && fieldMapping) {
      if (displayMode === 'individual') {
        // Each item becomes its own card
        return data.map((item: any, index: number) => {
          const id = getFieldValue(item, fieldMapping.id, item._key || item.id || item._id || `item-${index}`)
          const title = getFieldValue(item, fieldMapping.title, item.heading || item.title || item.name || '')
          const icon = getFieldValue(item, fieldMapping.icon, item.dynamicSvg || item.icon || item.featureCategory?.iconSvgCode)
          
          return {
            key: id,
            name: title,
            icon: icon,
            features: [item], // Single item as feature
          }
        })
      } else {
        // Grouped mode
        const grouped: { [key: string]: Feature[] } = {}
        
        data.forEach((item: any) => {
          const categoryKey = getFieldValue(
            item,
            fieldMapping.categoryKey,
            item?.category || item?.featureCategory?.name || 'Uncategorized'
          )
          
          if (!grouped[categoryKey]) {
            grouped[categoryKey] = []
          }
          grouped[categoryKey].push(item)
        })

        return Object.entries(grouped).map(([key, features]) => {
          const categoryName = getFieldValue(
            features[0],
            fieldMapping.categoryName,
            typeof fieldMapping.categoryName === 'function'
              ? fieldMapping.categoryName(key, features[0])
              : key.replaceAll('-', ' ')
          )
          
          const categoryIcon = getFieldValue(
            features,
            fieldMapping.categoryIcon,
            features[0]?.icon || features[0]?.dynamicSvg || features[0]?.featureCategory?.iconSvgCode
          )

          return {
            key,
            name: categoryName,
            icon: categoryIcon,
            features,
          }
        })
      }
    }

    // Transformer functions approach
    if (data && dataTransformer) {
      if (displayMode === 'individual') {
        return data.map((item: any, index: number) => {
          const id = dataTransformer.getFeatureId
            ? dataTransformer.getFeatureId(item)
            : item._key || item.id || item._id || `item-${index}`
          const title = dataTransformer.getFeatureTitle
            ? dataTransformer.getFeatureTitle(item)
            : item.heading || item.title || item.name || ''
          
          return {
            key: id,
            name: title,
            icon: item.dynamicSvg || item.icon || item.featureCategory?.iconSvgCode,
            features: [item],
          }
        })
      } else {
        const grouped: { [key: string]: Feature[] } = {}
        
        data.forEach((item: any) => {
          const categoryKey = dataTransformer.getCategoryKey
            ? dataTransformer.getCategoryKey(item)
            : item?.category || item?.featureCategory?.name || 'Uncategorized'
          
          if (!grouped[categoryKey]) {
            grouped[categoryKey] = []
          }
          grouped[categoryKey].push(item)
        })

        return Object.entries(grouped).map(([key, features]) => ({
          key,
          name: dataTransformer.getCategoryName
            ? dataTransformer.getCategoryName(key, features[0])
            : key.replaceAll('-', ' '),
          icon: dataTransformer.getCategoryIcon
            ? dataTransformer.getCategoryIcon(features)
            : features[0]?.icon || features[0]?.dynamicSvg || features[0]?.featureCategory?.iconSvgCode,
          features,
        }))
      }
    }

    // Pre-grouped data (backward compatible)
    if (groupedData && getCategoryDisplayName) {
      return Object.entries(groupedData).map(([key, features]) => ({
        key,
        name: getCategoryDisplayName(key),
        icon: features[0]?.icon || features[0]?.dynamicSvg || features[0]?.featureCategory?.iconSvgCode,
        features,
      }))
    }

    return []
  }

  const cards = transformDataToCards()

  const getFeatureId = (feature: Feature, mapping?: FieldMapping, transformer?: DataTransformer): string => {
    if (mapping?.id) {
      const id = getFieldValue(feature, mapping.id)
      if (id) return String(id)
    }
    if (transformer?.getFeatureId) {
      return transformer.getFeatureId(feature)
    }
    return feature.id || feature._id || feature._key || Math.random().toString()
  }

  const getFeatureTitle = (feature: Feature, mapping?: FieldMapping, transformer?: DataTransformer): string => {
    if (mapping?.title) {
      const title = getFieldValue(feature, mapping.title)
      if (title) return String(title)
    }
    if (transformer?.getFeatureTitle) {
      return transformer.getFeatureTitle(feature)
    }
    return feature.title || feature.name || feature.heading || ''
  }

  // Get field mappings for FeatureCardSection
  const getFeatureIdField = (): string | ((feature: Feature) => string) => {
    if (fieldMapping?.id) return fieldMapping.id
    if (dataTransformer?.getFeatureId) {
      return (feature: Feature) => dataTransformer.getFeatureId!(feature)
    }
    return '_key'
  }

  const getFeatureTitleField = (): string | ((feature: Feature) => string) => {
    if (fieldMapping?.title) return fieldMapping.title
    if (dataTransformer?.getFeatureTitle) {
      return (feature: Feature) => dataTransformer.getFeatureTitle!(feature)
    }
    return 'title'
  }

  return (
    <div className={`grid md:grid-cols-3 grid-cols-1 gap-6 justify-center md:py-32 py-6 ${className}`}>
      {cards.map((card: CategoryCard) => (
        <FeatureCardSection
          key={card.key}
          cardTitle={card.name}
          cardIcon={card.icon}
          features={card.features}
          featureIdField={getFeatureIdField()}
          featureTitleField={getFeatureTitleField()}
        />
      ))}
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

