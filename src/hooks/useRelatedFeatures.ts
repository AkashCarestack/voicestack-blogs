import { useMemo } from 'react'

export function useRelatedFeatures(features: any[] | undefined, slug: string) {
  return useMemo(() => {
    const featuresByCategory = (features || []).reduce(
      (acc, feature) => {
        if (feature.featureCategory?.name) {
          const category = feature.featureCategory
          if (!acc[category.name]) {
            acc[category.name] = { category, features: [] }
          }
          acc[category.name].features.push(feature.basicInfo)
        }
        return acc
      },
      {} as Record<string, { category: any; features: any[] }>,
    )

    const featureKey =
      Object.keys(featuresByCategory).find((key) =>
        featuresByCategory[key].features.some(
          (item) => item.slug?.current === slug,
        ),
      ) ?? null

    if (!featureKey || !featuresByCategory[featureKey]) return []
    return featuresByCategory[featureKey].features
  }, [features, slug])
}
