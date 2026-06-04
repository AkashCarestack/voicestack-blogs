import React from 'react'
import siteConfig from 'config/siteConfig'
import WordRotate from '~/components/ui/word-rotate'
import FireIcon from '~/v2/icons/FireIcon'
import WarningIcon from '~/v2/icons/WarningIcon'
import { portableTextCustomTypes } from '~/utils/portableTextCustomTypes'

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
        'h2',
        {
          className: 'text-gray-950  md:max-w-[607px] w-full font-manrope xl:text-6xl md:text-5xl text-center md:text-left text-3xl font-bold !leading-[116.667%] md:tracking-[-1.8px] tracking-normal',
        },
        children
      ),
  },
  types: {
    rotatingWord: ({ value }: { value: any }) => {
      // Hardcoded words - internally configured
      const words = ['Enterprise', 'Dental', 'Optometry', 'Physical Therapy', 'Veterinary'];
      return React.createElement(WordRotate, {
        words: words,
        asSpan: true,
      });
    },
  },
}
export const ComparisonHeroH2: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'h2',
        {
          className: 'md:text-left text-center text-white font-manrope xl:text-[56px] md:text-4xl text-3xl !leading-[107.14%] font-bold tracking-normal md:max-w-[581px] w-full font-bold ',
        },
        children
      ),
  },
  types: {
    rotatingWord: ({ value }: { value: any }) => {
      // Hardcoded words - internally configured
      const words = ['Enterprise', 'Dental', 'Optometry', 'Physical Therapy', 'Veterinary'];
      return React.createElement(WordRotate, {
        words: words,
        asSpan: true,
      });
    },
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
        'h2',
        {
          className: 'text-gray-950 text-center md:text-left font-manrope xl:text-[56px] md:text-5xl text-3xl font-bold leading-[111.111%] max-w-[711px]',
        },
        children
      ),
      h2: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'h2',
        {
          className: 'text-gray-950 text-center md:text-left font-manrope xl:text-[56px] md:text-5xl text-3xl font-bold leading-[111.111%] max-w-[711px] ',
        },
        children
      ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'ul',
        {
          className: 'text-base text-gray-950 leading-[24px] self-stretch list-inside font-normal text-left',
        },
        children
      ),
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'li',
        {
          className: 'flex justify-start gap-3  py-[10px] md:py-[14px] text-base text-gray-950 leading-[150%] border-b ',
          style: { borderColor: '#0307121A' },
        },
        React.createElement('span', null, children)
      ),
  },  
}

export const descriptionComponents: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'p',
        {
          className: 'text-gray-950 font-normal text-center md:text-left md:max-w-[711px] w-full font-geist md:text-lg text-base leading-[155.55%] [&_strong]:!font-semibold',
        },
        
        children
      ),

  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) =>
      React.createElement(
        'a',
        {
          href: value?.href,
          className: 'text-vs-blue ',
          target: value?.href?.startsWith('http') ? '_blank' : undefined,
          rel: value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined,
        },
        children
      ),
    highlight: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'span',
        {
          className: 'font-medium text-gray-950 inline-flex items-center gap-2 py-2 pl-2 pr-4 rounded-[4px] bg-yellow-100',
        },
        React.createElement(FireIcon, { className: 'w-[16px] h-[16px] text-vs-purple' }),
        children
      ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'ul',
        {
          className: 'text-base text-gray-950 leading-[24px] self-stretch  list-inside font-normal text-left',
        },
        children
      ),
     number: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'ul',
        {
          className: 'list-inside font-normal text-left',
        },
        children
      ),
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'li',
        {
          className: 'flex justify-start gap-3 py-[10px] md:py-[14px] text-base text-gray-950 leading-[150%] border-b',
          style: { borderColor: '#0307121A' },
        },
        React.createElement(
          'span',
          {
            className: ' flex-shrink-0 mt-[3px]',
          },
          React.createElement(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '16',
              height: '16',
              viewBox: '0 0 16 16',
              fill: 'none',
            },
            React.createElement('path', {
              fillRule: 'evenodd',
              clipRule: 'evenodd',
              d: 'M13.3633 3.32248C13.4261 3.37018 13.4789 3.4298 13.5187 3.49794C13.5584 3.56607 13.5844 3.64138 13.595 3.71955C13.6056 3.79772 13.6007 3.87722 13.5806 3.9535C13.5605 4.02977 13.5255 4.10133 13.4777 4.16408L7.07767 12.5641C7.02576 12.6321 6.95989 12.6883 6.88449 12.7288C6.80908 12.7692 6.72589 12.7931 6.6405 12.7988C6.5551 12.8045 6.46948 12.7918 6.38937 12.7617C6.30927 12.7316 6.23654 12.6846 6.17607 12.6241L2.57607 9.02408C2.47009 8.91034 2.41239 8.7599 2.41513 8.60446C2.41788 8.44902 2.48084 8.30071 2.59078 8.19078C2.70071 8.08085 2.84901 8.01788 3.00445 8.01513C3.1599 8.01239 3.31033 8.07009 3.42407 8.17608L6.53927 11.2905L12.5233 3.43688C12.6196 3.31044 12.7621 3.22738 12.9196 3.20593C13.0771 3.18448 13.2367 3.2264 13.3633 3.32248Z',
              fill: '#030712',
            })
          )
        ),
        React.createElement('span', null, children)
      ),
    number: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'li',
        {
          className: 'flex justify-start gap-3  py-[10px] md:py-[14px] text-base md:text-lg text-gray-950 leading-[150%] border-b',
          style: { borderColor: '#0307121A' },
        },
        React.createElement(
          WarningIcon,
          {
            className: 'md:h-[20px] md:w-[20px] h-[16px] w-[16px] mt-1 flex-shrink-0',
          }
        ),
        React.createElement('span', null, children)
      ),
  },
  types: portableTextCustomTypes,
}
export const ComparisonHeroDescriptionComponents: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'p',
        {
          className: 'text-white md:text-left text-center font-geist md:text-lg text-base leading-[155.5%] font-normal',
        },
        
        children
      ),

  },

}

export const ComparisonHeroH1: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'span',
        {
          className:'max-w-[606px] text-[#030712] font-[Manrope] text-center md:text-left md:text-6xl text-4xl font-bold leading-[115%] tracking-[-0.8px]',
        },
        children
      ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'ul',
        {
          className: 'text-base text-gray-950 leading-[24px] self-stretch list-inside font-normal text-left',
        },
        children
      ),
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        'li',
        {
          className: 'flex justify-start gap-3  py-[10px] md:py-[14px] text-base text-gray-950 leading-[150%] border-b',
          style: { borderColor: '#0307121A' },
        },
        React.createElement('span', null, children)
      ),
  },  
}

