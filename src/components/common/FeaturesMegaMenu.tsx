import React from 'react'
import { useRouter } from 'next/router'
import Anchor from './anchor'

export interface FeatureMenuItem {
  _id?: string
  basicInfo?: {
    title?: string
    slug?: { current?: string } | string
  }
}

const HUB_LINKS = [
  { label: 'Compare', path: 'comparison' },
  { label: 'Reviews', path: 'reviews' },
  { label: 'Integrations', path: 'integrations' },
]

function getFeatureSlug(feature: FeatureMenuItem): string {
  const slug = feature?.basicInfo?.slug
  if (!slug) return ''
  if (typeof slug === 'string') return slug
  return slug.current || ''
}

function getFeaturesBasePath(locale?: string | null): string {
  return locale === 'en-AU' || locale === 'en-GB'
    ? '/dental-phones'
    : '/phone-system'
}

function getFeatureHref(slug: string, locale?: string | null): string {
  if (!slug) return '#'
  return `${getFeaturesBasePath(locale)}/features/${slug}`
}

function getHubHref(path: string, locale?: string | null): string {
  return `${getFeaturesBasePath(locale)}/${path}`
}

function splitIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const perColumn = Math.ceil(items.length / columnCount)
  const columns: T[][] = []
  for (let i = 0; i < columnCount; i++) {
    const slice = items.slice(i * perColumn, (i + 1) * perColumn)
    if (slice.length > 0) columns.push(slice)
  }
  return columns
}

export function isFeaturesMegaMenuLink(link: {
  label?: string
  href?: string
  slug?: string
  isMegaMenu?: boolean
}): boolean {
  if (link?.isMegaMenu) return true
  if (link?.slug === 'features') return true
  const label = (link?.label || '').toLowerCase()
  const href = link?.href || ''
  return label === 'features' || /\/features\/?$/.test(href)
}

interface FeaturesMegaMenuProps {
  features: FeatureMenuItem[]
  overviewHref?: string
  onNavigate?: () => void
  variant?: 'desktop' | 'mobile'
}

export default function FeaturesMegaMenu({
  features,
  overviewHref,
  onNavigate,
  variant = 'desktop',
}: FeaturesMegaMenuProps) {
  const router = useRouter()
  const locale = router.locale
  const allFeaturesHref =
    overviewHref || `${getFeaturesBasePath(locale)}/features`

  const featureColumns = splitIntoColumns(features, 2)

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-4 py-2">
        {overviewHref && (
          <Anchor
            href={overviewHref}
            className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            onClick={onNavigate}
          >
            Overview
          </Anchor>
        )}
        {features.map((feature) => {
          const slug = getFeatureSlug(feature)
          const title = feature?.basicInfo?.title || ''
          return (
            <Anchor
              key={feature._id || slug}
              href={getFeatureHref(slug, locale)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onNavigate}
            >
              {title}
            </Anchor>
          )
        })}
        <div className="border-t border-gray-200 pt-2 px-4 flex flex-col gap-2">
          {HUB_LINKS.map((hub) => (
            <Anchor
              key={hub.path}
              href={getHubHref(hub.path, locale)}
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={onNavigate}
            >
              {hub.label}
            </Anchor>
          ))}
          <Anchor
            href={allFeaturesHref}
            className="text-sm font-medium text-vs-blue hover:underline"
            onClick={onNavigate}
          >
            View all features →
          </Anchor>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:absolute static top-full left-0 mt-2 w-full lg:w-[720px] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featureColumns.map((column, colIndex) => (
          <div key={`features-col-${colIndex}`} className="space-y-2">
            {colIndex === 0 && (
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Features
              </p>
            )}
            <ul className="space-y-1 list-none m-0 p-0">
              {column.map((feature) => {
                const slug = getFeatureSlug(feature)
                const title = feature?.basicInfo?.title || ''
                return (
                  <li key={feature._id || slug}>
                    <Anchor
                      href={getFeatureHref(slug, locale)}
                      className="block py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:underline"
                      onClick={onNavigate}
                    >
                      {title}
                    </Anchor>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Explore
          </p>
          <ul className="space-y-1 list-none m-0 p-0">
            {HUB_LINKS.map((hub) => (
              <li key={hub.path}>
                <Anchor
                  href={getHubHref(hub.path, locale)}
                  className="block py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:underline"
                  onClick={onNavigate}
                >
                  {hub.label}
                </Anchor>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Anchor
          href={allFeaturesHref}
          className="text-sm font-medium text-vs-blue hover:underline"
          onClick={onNavigate}
        >
          View all features →
        </Anchor>
      </div>
    </div>
  )
}
