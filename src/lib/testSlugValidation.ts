// Test file for slug validation debugging
import { getClient } from './sanity.client'

export async function testSlugValidation() {
  const client = getClient()
  
  try {
    // Test basic connectivity
    const result = await client.fetch('*[_type == "page"][0...5]')
    console.log('✅ Basic connectivity test passed:', result)
    
    // Test language field
    const pagesWithLanguage = await client.fetch('*[_type == "page" && defined(language)] | order(_createdAt desc)[0...5]')
    console.log('✅ Pages with language field:', pagesWithLanguage)
    
    // Test slug field
    const pagesWithSlug = await client.fetch('*[_type == "page" && defined(slug.current)] | order(_createdAt desc)[0...5]')
    console.log('✅ Pages with slug field:', pagesWithSlug)
    
    return {
      success: true,
      basicConnectivity: result,
      pagesWithLanguage,
      pagesWithSlug
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function checkSlugExists(slug: string, language: string) {
  const client = getClient()
  
  try {
    const query = `*[_type == "page" && slug.current == $slug && language == $language]`
    const result = await client.fetch(query, { slug, language })
    
    console.log(`🔍 Checking slug "${slug}" in language "${language}":`, result)
    
    return {
      exists: result && result.length > 0,
      count: result ? result.length : 0,
      documents: result
    }
  } catch (error) {
    console.error('❌ Error checking slug:', error)
    return {
      exists: false,
      error: error.message
    }
  }
}
