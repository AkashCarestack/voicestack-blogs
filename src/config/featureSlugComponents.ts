import React from 'react'
import FeatureBenefitSection from '~/components/features/FeatureBenefitSection'
import FeatureCategorySection from '~/components/features/FeatureCategorySection'

export interface FeatureSlugComponent {
  key: string // The slug from CMS
  name: string // Component name for reference
  component: React.ComponentType<any> // The React component
}

export const FEATURE_SLUG_COMPONENTS: FeatureSlugComponent[] = [
  {
    key: 'feature-benefit',
    name: 'FeatureBenefitSection',
    component: FeatureBenefitSection,
  },
  {
    key: 'feature-category',
    name: 'FeatureCategorySection',
    component: FeatureCategorySection,
  },
]


export const getComponentBySlug = (slug: string): React.ComponentType<any> | null => {
  const config = FEATURE_SLUG_COMPONENTS.find((item) => item.key === slug)
  return config?.component || null
}

export const getConfiguredSlugs = (): string[] => {
  return FEATURE_SLUG_COMPONENTS.map((item) => item.key)
}
