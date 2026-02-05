import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'

// Exclude list for pages that shouldn't appear in search results
const EXCLUDED_SLUGS = [
  'test-shakir',
  'ref',
  'test2',
  'test',
  'landing',
]

// Helper function to extract plain text from blockContent/portable text
function extractTextFromBlocks(blocks: any[]): string {
  if (!Array.isArray(blocks)) return ''
  
  return blocks
    .map((block: any) => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text || '')
          .join(' ')
      }
      return ''
    })
    .filter(Boolean)
    .join(' ')
    .trim()
}

// Helper function to filter out internal names and slugs
function isInternalName(text: string): boolean {
  if (!text) return true
  const lowerText = text?.toString().toLowerCase().trim()
  
  const internalPatterns = [
    /^tab\d+$/i,
    /\bhero\b/i,
    /\btestimonial\b/i,
    /^stack card/i,
    /stack card tab/i,
    /\bcomponent\b/i,
    /^section \d+$/i,
    /why voicestack hero/i,
    /^why\s+voicestack\s+hero$/i,
  ]
  
  for (const pattern of internalPatterns) {
    if (pattern.test(lowerText)) {
      return true
    }
  }
  
  if (/^[a-z0-9-]+$/.test(lowerText) && lowerText.includes('-') && !lowerText.includes(' ')) {
    return true
  }
  
  const internalKeywords = ['hero', 'testimonial', 'component', 'tab']
  const hasInternalKeyword = internalKeywords.some(keyword => 
    lowerText.includes(keyword) && lowerText.length < 50
  )
  
  if (hasInternalKeyword && lowerText.split(/\s+/).length <= 4) {
    const descriptiveWords = ['grow', 'practice', 'power', 'ai', 'features', 'business', 'results', 'real']
    const hasDescriptiveContent = descriptiveWords.some(word => lowerText.includes(word))
    if (!hasDescriptiveContent) {
      return true
    }
  }
  
  return false
}

// Helper function to get content preview from various content fields
function getContentPreview(item: any): string {
  const parts: string[] = []
  
  if (item.description) {
    if (typeof item.description === 'string' && !isInternalName(item.description)) {
      parts.push(item.description)
    } else if (Array.isArray(item.description)) {
      const text = extractTextFromBlocks(item.description)
      if (text && !isInternalName(text)) parts.push(text)
    }
  }
  
  if (item.content?.sections && Array.isArray(item.content.sections)) {
    item.content.sections.forEach((section: any) => {
      if (section.title) {
        const titleLower = section.title.toLowerCase()
        const isLikelyInternal = 
          titleLower.includes('hero') && titleLower.length < 30 ||
          titleLower.includes('testimonial') && titleLower.length < 30 ||
          titleLower.includes('component') && titleLower.length < 30 ||
          /^(why|stack|tab)\s/.test(titleLower)
        
        if (!isLikelyInternal && !isInternalName(section.title)) {
          parts.push(section.title)
        }
      }
      
      if (section.component?.tabsListingComponent) {
        const tabsComp = section.component.tabsListingComponent
        if (tabsComp.headline && !isInternalName(tabsComp.headline)) {
          parts.push(tabsComp.headline)
        }
        if (tabsComp.subheadline && !isInternalName(tabsComp.subheadline)) {
          parts.push(tabsComp.subheadline)
        }
        if (tabsComp.subDescription && !isInternalName(tabsComp.subDescription)) {
          parts.push(tabsComp.subDescription)
        }
        if (tabsComp.content) {
          const text = extractTextFromBlocks(tabsComp.content)
          if (text && !isInternalName(text)) parts.push(text)
        }
        if (tabsComp.tabs && Array.isArray(tabsComp.tabs)) {
          tabsComp.tabs.forEach((tab: any) => {
            if (tab.tabHeading && !isInternalName(tab.tabHeading)) {
              parts.push(tab.tabHeading)
            }
            if (tab.tabSubHeading && !isInternalName(tab.tabSubHeading)) {
              parts.push(tab.tabSubHeading)
            }
            if (tab.description && !isInternalName(tab.description)) {
              parts.push(tab.description)
            }
          })
        }
      }
      
      if (section.component?.customComponent) {
        const customComp = section.component.customComponent
        if (customComp.title && !isInternalName(customComp.title)) {
          parts.push(customComp.title)
        }
        if (customComp.subtitle && !isInternalName(customComp.subtitle)) {
          parts.push(customComp.subtitle)
        }
        if (customComp.content) {
          const text = extractTextFromBlocks(customComp.content)
          if (text && !isInternalName(text)) parts.push(text)
        }
      }
    })
  }
  
  if (parts.length === 0 && item.content && Array.isArray(item.content)) {
    const text = extractTextFromBlocks(item.content)
    if (text && !isInternalName(text)) parts.push(text)
  }
  
  if (parts.length === 0) {
    if (item.overview) {
      if (typeof item.overview === 'string' && !isInternalName(item.overview)) {
        parts.push(item.overview)
      } else if (Array.isArray(item.overview)) {
        const text = extractTextFromBlocks(item.overview)
        if (text && !isInternalName(text)) parts.push(text)
      }
    }
    
    if (item.shortDescription && !isInternalName(item.shortDescription)) {
      parts.push(item.shortDescription)
    }
  }
  
  const uniqueParts = Array.from(new Set(parts.filter(Boolean)))
  let preview = uniqueParts.join(' ').trim()
  
  const internalPhrases = [
    'why voicestack hero',
    'stack card tab testimonial',
    'stack card',
    'tab testimonial',
  ]
  
  for (const phrase of internalPhrases) {
    const regex = new RegExp(phrase.replace(/\s+/g, '\\s+'), 'gi')
    preview = preview.replace(regex, '').replace(/\s+/g, ' ').trim()
  }
  
  return preview
}

// Helper function to map document types and slugs to URLs
function getPathForPage(page: { _type: string; slug: string }): string {
  const slug = page.slug || ''
  
  if (slug === 'landing') {
    if (page._type === 'whoWeServe' || page._type === 'whoWeServePage' || page._type === 'whyVoicestack') {
      return '/who-we-serve'
    } else if (page._type === 'dentalPhones' || page._type === 'dentalSoftware') {
      return '/dental-phones'
    }
    return '/'
  }
  
  if (page._type === 'whoWeServe' || page._type === 'whoWeServePage') {
    return `/who-we-serve/${slug}`
  } else if (page._type === 'dentalPhones' || page._type === 'dentalPhonesPage') {
    return `/dental-phones/${slug}`
  } else if (page._type === 'whyVoicestack') {
    return `/who-we-serve/${slug}`
  } else if (page._type === 'feature') {
    return `/dental-phones/features/${slug}`
  } else if (page._type === 'page') {
    return `/${slug}`
  }
  
  return slug ? `/${slug}` : '/'
}

// Helper function to check if a page should be excluded
function shouldExcludePage(slug: string, path: string): boolean {
  if (EXCLUDED_SLUGS.includes(slug)) {
    return true
  }
  
  for (const excluded of EXCLUDED_SLUGS) {
    if (path.includes(`/${excluded}`) || path.includes(`/${excluded}/`)) {
      return true
    }
  }
  
  if (slug.startsWith('test') || path.includes('/test')) {
    return true
  }
  
  return false
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { s, locale = 'en' } = req.query

  if (!s || typeof s !== 'string') {
    return res.status(400).json({ message: 'Search query is required' })
  }

  try {
    const client = getClient()
    
    // Query for documents with basicInfo.slug
    const query1 = `
      *[
        _type in ["whoWeServe", "whoWeServePage", "dentalPhones", "whyVoicestack", "company", "companyPage"]
        && (
          basicInfo.title match $m ||
          basicInfo.description match $m ||
          basicInfo.slug.current match $m ||
          title match $m ||
          description match $m ||
          defined(content) && content[].children[].text match $m ||
          defined(content.sections) && content.sections[].title match $m ||
          defined(content.sections) && content.sections[].component.tabsListingComponent.headline match $m ||
          defined(content.sections) && content.sections[].component.tabsListingComponent.subheadline match $m ||
          defined(content.sections) && content.sections[].component.tabsListingComponent.tabs[].tabHeading match $m ||
          defined(content.sections) && content.sections[].component.tabsListingComponent.tabs[].tabSubHeading match $m ||
          defined(content.sections) && content.sections[].component.tabsListingComponent.content[].children[].text match $m ||
          defined(content.sections) && content.sections[].component.customComponent.title match $m ||
          defined(content.sections) && content.sections[].component.customComponent.subtitle match $m ||
          defined(content.sections) && content.sections[].component.customComponent.content[].children[].text match $m
        )
        && defined(basicInfo.slug.current)
        && !(_id in path("drafts.**"))
      ]{
        _id,
        _type,
        "title": coalesce(basicInfo.title, title),
        "slug": basicInfo.slug.current,
        "description": coalesce(basicInfo.description, description),
        content,
        language
      }
    `

    // Query for documents with slug at root level
    const query2 = `
      *[
        _type in ["page", "feature"]
        && (
          title match $m ||
          description match $m ||
          featureHeading match $m ||
          slug.current match $m ||
          defined(content) && content[].children[].text match $m ||
          defined(overview) && overview[].children[].text match $m ||
          shortDescription match $m
        )
        && defined(slug.current)
        && !(_id in path("drafts.**"))
      ]{
        _id,
        _type,
        "title": coalesce(title, featureHeading),
        "slug": slug.current,
        "description": coalesce(description, ""),
        content,
        overview,
        shortDescription,
        language
      }
    `

    const [data1, data2] = await Promise.all([
      client.fetch(query1, { m: `${s}*` }),
      client.fetch(query2, { m: `${s}*` })
    ])

    // Combine and filter
    const allResults = [...data1, ...data2]
      .filter((item: any) => {
        // Filter by locale
        if (item.language && item.language !== locale && item.language !== 'en') {
          return false
        }
        
        // Filter excluded pages
        const path = getPathForPage({ _type: item._type, slug: item.slug })
        if (shouldExcludePage(item.slug, path)) {
          return false
        }
        
        return true
      })
      .map((item: any) => {
        return {
          ...item,
          preview: getContentPreview(item)
        }
      })

    return res.status(200).json({ results: allResults })
  } catch (error) {
    console.error('Search error:', error)
    return res.status(500).json({ message: 'Search failed', error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
