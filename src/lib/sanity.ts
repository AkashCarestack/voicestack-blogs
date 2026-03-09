import { createClient } from '@sanity/client'
import { SlugValidationContext } from 'sanity'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2022-11-28', // use a specific date or `v1`
  useCdn: true, // `false` if you want to ensure fresh data
})


export async function isUniqueAcrossAllDocuments(slug, context) {
  const {document, getClient} = context
  const client = getClient({apiVersion: '2022-11-28'})
  const id = document._id.replace(/^drafts\./, '')
  const region = document.language
  const conType = document.contentType ? document.contentType : document._type || 'article'
  const docType = document._type || 'post'
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug: slug?.current || slug,
    type: docType,
    contentType: conType,
    language: region
  }

 const query = `!defined(*[
    !(_id in [$draft, $published]) && 
    _type == $type && 
    contentType == $contentType &&  language == $language &&
    slug.current == $slug
  ][0]._id)`

  try {
    const result = await client.fetch(query, params)
    return result
  } catch (error) {
    return false
  }
}


export async function isUniqueOtherThanLanguage(slug: string | {current?: string} | null, context: SlugValidationContext) {
  const {document, getClient} = context
  if (!document?.language) {
    return true
  }
  // Handle slug as object or string (slug.current || slug)
  const slugValue = (typeof slug === 'object' && slug !== null && slug.current) ? slug.current : (typeof slug === 'string' ? slug : '')
  if (!slugValue) {
    return true // If no slug value, consider it valid
  }
  
  const client = getClient({apiVersion: '2023-04-24'})
  const id = document._id.replace(/^drafts\./, '')
  const docType = document._type
  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: document.language,
    slug: slugValue,
    type: docType,
  }
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    _type == $type &&
    basicInfo.slug.current == $slug &&
    language == $language
  ][0]._id)`
  
  try {
    const result = await client.fetch(query, params)
    return result
  } catch (error) {
    console.error('Error checking slug uniqueness:', error)
    return false
  }
}

// Allows the same slug across all locales (non-unique)
export async function allowDuplicateSlugs(slug: string, context: SlugValidationContext): Promise<boolean> {
  return true
}