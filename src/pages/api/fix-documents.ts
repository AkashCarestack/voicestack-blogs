import { NextApiRequest, NextApiResponse } from 'next'
import { getClient, getWriteClient } from '~/lib/sanity.client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const client = getClient()
    const writeClient = getWriteClient()
    
    // Get all whoWeServe documents with null values
    const documents = await client.fetch(`
      *[_type == "whoWeServe" && (title == null || slug == null || isPublished == null)] {
        _id,
        _type,
        title,
        slug,
        isPublished,
        language
      }
    `)

    console.log('Found documents with null values:', documents)

    const results = []

    for (const doc of documents) {
      try {
        // Create a patch to fix the document
        const patch = {
          _id: doc._id,
          _type: doc._type,
          title: doc.title || 'Untitled Document',
          slug: doc.slug || { _type: 'slug', current: 'untitled' },
          isPublished: doc.isPublished !== null ? doc.isPublished : true,
          language: doc.language || 'en'
        }

        // Use createOrReplace to fix the document
        const result = await writeClient.createOrReplace(patch)
        
        results.push({
          _id: doc._id,
          success: true,
          result
        })
        
        console.log(`Fixed document ${doc._id}`)
      } catch (error) {
        console.error(`Failed to fix document ${doc._id}:`, error)
        results.push({
          _id: doc._id,
          success: false,
          error: error.message
        })
      }
    }

    return res.json({
      success: true,
      message: `Processed ${documents.length} documents`,
      results
    })

  } catch (error) {
    console.error('Error fixing documents:', error)
    return res.status(500).json({ 
      message: 'Error fixing documents',
      error: error.message 
    })
  }
}
