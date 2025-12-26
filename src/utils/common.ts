import React from 'react'
import siteConfig from 'config/siteConfig'

export const fetchAuthor = (post) => {
  let authorData: any = []
  post &&
    post.authorInfo &&
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
  otherReviews.forEach((review) => {
    if (!seen.has(review[uniqueKey])) {
      seen.add(review[uniqueKey])
      result.push(review)
    }
  })

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
    primaryArray.forEach((item) => {
      if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
        seen.add(item[uniqueKey])
        result.push(item)
      }
    })
  }

  secondaryArray.forEach((item) => {
    if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
      seen.add(item[uniqueKey])
      result.push(item)
    }
  })

  return result
}

export const removeUnwantedCharacters = (path: string) => {
  if (!path) {
    throw new Error('Provide a valid path')
  }
  const excludeCharacters = ['?', '#']
  const cleanPath = excludeCharacters.reduce((acc, character) => {
    return acc.split(character)[0]
  }, path)
  return cleanPath
}

export const getUniqueData = (data) => {
  if (!data) return []
  return data.reduce((acc, current) => {
    if (!acc.find((item) => item._id === current._id)) {
      acc.push(current)
    }
    return acc
  }, [])
}

export function capitalizeFirst(str) {
  const minorWords = ["and", "or", "but", "of", "to", "in", "on", "for", "at", "by", "with", "a", "an", "the","is","if"];
  
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (
        index === 0 || 
        index === str.split(" ").length - 1 || 
        !minorWords.includes(word)
      ) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word; 
    })
    .join(" ");
}

export function slugToCapitalized(slug) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const normalizePath = (path) => path && path.replace(/\/+/g, '/').replace(/^\//, '/');


export function generateHref(locale: any, linkHref: string): string {
  const isValidHref = locale && locale !== 'en' && siteConfig.locales.includes(locale);

  // const cleanPath = linkHref === '/' ? '/' : normalizePath(linkHref).replace(/^\/+/, '');
  const cleanPath = normalizePath(linkHref).replace(/^\/+/, '');


  // if (!cleanPath || cleanPath === '') {
  //   return '/';
  // }
  

  if (locale === 'en' || !isValidHref) {
    return `/${cleanPath}`;
  }
  const path = cleanPath ? `/${locale}/${cleanPath}` : `/${locale}/`

  return path;
}
export const removeNumberPrefix = (id: any) => id.replace(/^\d+\.\s*/, '');



export const cookieSelector = (consentString, field) => {
  const regex = new RegExp(`${field}:(\\w+)`);
  const match = consentString && consentString.match(regex);
  return match && match[1] ? match[1] : "false";
};

// Convert text to Title Case for HTML, CSS will display as uppercase
// Preserves spaces from Sanity between words
// If text is already in proper case, returns it as-is
export const toCamelCase = (text: string | undefined): string => {
  if (!text) return ''
  
  // Check if text is already in proper case:
  // - Not all uppercase
  // - Starts with lowercase letter
  // - Has mixed case (contains both uppercase and lowercase)
  const isAllUppercase = text === text.toUpperCase()
  const isAllLowercase = text === text.toLowerCase()
  const startsWithLowercase = text.charAt(0) === text.charAt(0).toLowerCase()
  const hasMixedCase = !isAllUppercase && !isAllLowercase
  
  const isAlreadyCamelCase = 
    !isAllUppercase && 
    startsWithLowercase && 
    (hasMixedCase || text.split(' ').some(word => word.length > 0 && word.charAt(0) === word.charAt(0).toUpperCase()))
  
  // If already in proper case, return as-is
  if (isAlreadyCamelCase) {
    return text
  }
  
  // Otherwise, convert to Title Case (capitalize first letter of each word)
  // Preserve acronyms like AI, API, UI, etc. in uppercase
  const commonAcronyms = ['AI', 'API', 'UI', 'UX', 'SEO', 'CMS', 'CRM', 'SaaS', 'PaaS', 'IaaS', 'HTTP', 'HTTPS', 'URL', 'PDF', 'FAQ']
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => {
      const upperWord = word.toUpperCase()
      // Check if word is a common acronym
      if (commonAcronyms.includes(upperWord)) {
        return upperWord
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}


/**Common Component for Custom block content hero section Use from Here only**/
export const HeroHeadingComponents: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'span',
        {
          className: 'text-gray-950  md:max-w-[607px] w-full font-manrope xl:text-7xl md:text-5xl text-center md:text-left text-3xl font-extrabold !leading-[111.11%] tracking-normal',
        },
        children
      ),
  },
}
export const HeroFeatureHeadingComponents: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'span',
        {
          className: 'text-gray-950 text-center md:text-left font-manrope xl:text-7xl md:text-5xl text-3xl font-bold leading-[111.111%] tracking-[-0.8px]',
        },
        children
      ),
  },
}
export const HeroFeatureComponents: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'span',
        {
          className: 'text-gray-950 text-center md:text-left font-manrope md:text-6xl text-3xl font-bold leading-[111.111%] tracking-normal',
        },
        children
      ),
  },
}

export const descriptionComponents: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'span',
        {
          className: 'text-gray-950 font-normal text-center md:text-left md:max-w-[607px] w-full font-geist md:text-lg text-base leading-[155.55%]',
        },
        children
      ),
  },
}