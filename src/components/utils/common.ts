import enGb from '../../../public/assets/countryFlags/EN-GB.png'
import en from '../../../public/assets/countryFlags/EN-usa.png'
import enAu from '../../../public/assets/countryFlags/EN-AU.png'

export const fetchAuthor = (post) => {
  let authorData: any = []
  post &&
    post.authorInfo &&
    post.authorInfo.content &&
    post.authorInfo.content.body &&
    Array.isArray(post.authorInfo.content.body) &&
    post.authorInfo.content.body
      .filter((block: any) => block.component === 'authorBioSection')
      .map((author: any) => (authorData = author.author))
  return authorData
}

export function rgbToHsl(r, g, b) {
  ;(r /= 255), (g /= 255), (b /= 255)

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  var h,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  // return [ h, 40, 40 ];

  return `hsl(${h * 360},50%,40%)`
  // return `hsl(${h*100},40%,40%)`
}

export const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1) + 's'
}

export const getUniqueReorderedCarouselItems = (
  homeSettings,
  ebooks,
  webinars,
) => {
  if (!homeSettings?.featuredCarouselItems || !ebooks || !webinars) return []
  const carouselItems = [
    ...homeSettings?.featuredCarouselItems,
    ...ebooks,
    ...webinars,
  ]

  const uniqueCarouselItems = carouselItems.reduce((acc, item) => {
    if (
      !acc.some(
        (existingItem) => existingItem.slug.current === item.slug.current,
      )
    ) {
      acc.push(item)
    }
    return acc
  }, [])

  return [
    ...(homeSettings?.featuredCarouselItems || []),
    ...uniqueCarouselItems.filter(
      (item) =>
        !(homeSettings?.featuredCarouselItems || []).some(
          (homeItem) => homeItem.slug.current === item.slug.current,
        ),
    ),
  ]
}

export const mergeReviews = (
  homeSettingsReviews = [],
  otherReviews = [],
  uniqueKey = '_id',
) => {
  const seen = new Set()
  const result = []
  if (homeSettingsReviews && homeSettingsReviews.length > 0) {
    result.push(...homeSettingsReviews)
    homeSettingsReviews.forEach((review) => seen.add(review[uniqueKey]))
  }
  if (otherReviews && Array.isArray(otherReviews)) {
    otherReviews.forEach((review) => {
      if (!seen.has(review[uniqueKey])) {
        seen.add(review[uniqueKey])
        result.push(review)
      }
    })
  }

  return result
}

export const mergeAndRemoveDuplicates = (
  primaryArray,
  secondaryArray = [],
  uniqueKey = '_id',
) => {
  if (!primaryArray || !secondaryArray) return []

  const seen = new Set()
  const result = []

  if (!Array.isArray(primaryArray)) {
    if (primaryArray[uniqueKey] && !seen.has(primaryArray[uniqueKey])) {
      seen.add(primaryArray[uniqueKey])
      result.push(primaryArray)
    }
  } else {
    if (primaryArray && Array.isArray(primaryArray)) {
      primaryArray.forEach((item) => {
        if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
          seen.add(item[uniqueKey])
          result.push(item)
        }
      })
    }
  }

  if (secondaryArray && Array.isArray(secondaryArray)) {
    secondaryArray.forEach((item) => {
      if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
        seen.add(item[uniqueKey])
        result.push(item)
      }
    })
  }

  return result
}

export const formatOrganizationSchema = (props: any) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${props?.name}`,
    url: `${props?.url}`,
    logo: `${props?.logoUrl}`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '',
        contactType: 'Customer Service',
        areaServed: `${props?.areaServed}`,
        availableLanguage: ['English'],
      },
    ],
    sameAs: `${props?.socialLinks}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'Orlando',
      addressRegion: 'FL',
      postalCode: '32801',
      addressCountry: 'US',
    },
    founder: {
      '@type': 'Person',
      name: `${props?.founder}`,
    },
    foundingDate: `${props?.foundingDate}`,
    numberOfEmployees: 50,
    description: `${props?.description}`,
    keywords: `${props?.keyWords}`,
  }
  return schema
}

export default function showCountryFlag(region: string) {
  if (region === 'en') {
    return en.src
  } else if (region === 'en-GB') {
    return enGb.src
  } else if (region === 'en-AU') {
    return enAu.src
  }
}
