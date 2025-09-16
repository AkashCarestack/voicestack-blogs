import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = getClient()
    
    console.log('Testing Sanity client...')
    
    // Test 1: Check all document types
    const allDocumentsQuery = `*[_type in ["whoWeServe", "whoWeServe_enGB", "whoWeServe_enAU"]] | order(_type asc) {
      _type,
      _id,
      title,
      slug,
      language,
      isPublished
    }`
    
    const allDocuments = await client.fetch(allDocumentsQuery)
    
    // Test 2: Check specific whoWeServe documents
    const whoWeServeQuery = `*[_type == "whoWeServe"] {
      _id,
      title,
      slug,
      language,
      isPublished
    }`
    
    const whoWeServeDocs = await client.fetch(whoWeServeQuery)
    
    // Test 3: Check all documents with language field
    const languageQuery = `*[defined(language)] | order(_type asc) {
      _type,
      _id,
      title,
      language
    }`
    
    const languageDocs = await client.fetch(languageQuery)
    
    // Test 4: Check all document types
    const typesQuery = `*[_type in ["whoWeServe", "whoWeServe_enGB", "whoWeServe_enAU"]] | order(_type asc) {
      _type,
      _id,
      title,
      slug,
      language,
      isPublished
    }`
    
    const typeDocs = await client.fetch(typesQuery)
    
    console.log('All documents:', allDocuments)
    console.log('Who We Serve docs:', whoWeServeDocs)
    console.log('Language docs:', languageDocs)
    console.log('Type docs:', typeDocs)
    
    res.status(200).json({
      success: true,
      message: 'Sanity client is working',
      allDocuments,
      whoWeServeDocs,
      languageDocs,
      typeDocs,
      queries: {
        allDocumentsQuery,
        whoWeServeQuery,
        languageQuery,
        typesQuery
      }
    })
  } catch (error) {
    console.error('Sanity client error:', error)
    res.status(500).json({
      success: false,
      message: 'Sanity client error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
