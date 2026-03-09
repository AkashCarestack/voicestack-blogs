const { createClient } = require('next-sanity')
const { readFileSync } = require('fs')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_API_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-21',
  useCdn: false, // Disable CDN for write operations
  token: process.env.SANIT_API_EDITOR_TOKEN || process.env.SANITY_API_WRITE_TOKEN
})

/**
 * Upload page data to Sanity
 * @param {string} jsonFilePath - Path to JSON file containing page data
 */
const uploadPages = async (jsonFilePath) => {
  try {
    const filePath = path.resolve(process.cwd(), 'src/migrations', jsonFilePath)
    const data = JSON.parse(readFileSync(filePath, 'utf8'))
    
    console.log(`\n📄 Uploading ${data.length} page(s)...`)
    
    const results = []
    for (const item of data) {
      try {
        // Ensure _type is set
        if (!item._type) {
          item._type = 'page'
        }
        
        // Ensure slug is properly formatted
        if (item.slug && typeof item.slug === 'string') {
          item.slug = {
            _type: 'slug',
            current: item.slug
          }
        }
        
        const res = await client.createOrReplace(item)
        results.push({
          _id: item._id,
          title: item.title,
          success: true,
          result: res
        })
        console.log(`✅ Uploaded page: ${item.title || item._id}`)
      } catch (error) {
        console.error(`❌ Failed to upload page ${item._id}:`, error.message)
        results.push({
          _id: item._id,
          success: false,
          error: error.message
        })
      }
    }
    
    return results
  } catch (error) {
    console.error('Error uploading pages:', error)
    throw error
  }
}

/**
 * Upload FAQ data to Sanity
 * @param {string} jsonFilePath - Path to JSON file containing FAQ data
 */
const uploadFaqs = async (jsonFilePath) => {
  try {
    const filePath = path.resolve(process.cwd(), 'src/migrations', jsonFilePath)
    const data = JSON.parse(readFileSync(filePath, 'utf8'))
    
    console.log(`\n❓ Uploading ${data.length} FAQ(s)...`)
    
    const results = []
    for (const item of data) {
      try {
        // Ensure _type is set
        if (!item._type) {
          item._type = 'faq'
        }
        
        const res = await client.createOrReplace(item)
        results.push({
          _id: item._id,
          question: item.question,
          success: true,
          result: res
        })
        console.log(`✅ Uploaded FAQ: ${item.question || item._id}`)
      } catch (error) {
        console.error(`❌ Failed to upload FAQ ${item._id}:`, error.message)
        results.push({
          _id: item._id,
          success: false,
          error: error.message
        })
      }
    }
    
    return results
  } catch (error) {
    console.error('Error uploading FAQs:', error)
    throw error
  }
}

/**
 * Upload FAQ Revamp (Page FAQs) data to Sanity
 * @param {string} jsonFilePath - Path to JSON file containing FAQ Revamp data
 */
const uploadFaqRevamps = async (jsonFilePath) => {
  try {
    const filePath = path.resolve(process.cwd(), 'src/migrations', jsonFilePath)
    const data = JSON.parse(readFileSync(filePath, 'utf8'))
    
    console.log(`\n📋 Uploading ${data.length} FAQ Revamp(s)...`)
    
    const results = []
    for (const item of data) {
      try {
        // Ensure _type is set
        if (!item._type) {
          item._type = 'faqRevamp'
        }
        
        // Ensure slug is properly formatted
        if (item.slug && typeof item.slug === 'string') {
          item.slug = {
            _type: 'slug',
            current: item.slug
          }
        }
        
        const res = await client.createOrReplace(item)
        results.push({
          _id: item._id,
          sectionName: item.sectionName,
          success: true,
          result: res
        })
        console.log(`✅ Uploaded FAQ Revamp: ${item.sectionName || item._id}`)
      } catch (error) {
        console.error(`❌ Failed to upload FAQ Revamp ${item._id}:`, error.message)
        results.push({
          _id: item._id,
          success: false,
          error: error.message
        })
      }
    }
    
    return results
  } catch (error) {
    console.error('Error uploading FAQ Revamps:', error)
    throw error
  }
}

/**
 * Main function to upload all data
 */
const uploadAll = async () => {
  try {
    console.log('🚀 Starting data upload...\n')
    
    const allResults = {
      pages: [],
      faqs: [],
      faqRevamps: []
    }
    
    // Upload pages if file exists
    try {
      allResults.pages = await uploadPages('pages.json')
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error with pages.json:', error.message)
      } else {
        console.log('ℹ️  pages.json not found, skipping...')
      }
    }
    
    // Upload FAQs if file exists
    try {
      allResults.faqs = await uploadFaqs('faqs.json')
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error with faqs.json:', error.message)
      } else {
        console.log('ℹ️  faqs.json not found, skipping...')
      }
    }
    
    // Upload FAQ Revamps if file exists
    try {
      allResults.faqRevamps = await uploadFaqRevamps('faqRevamps.json')
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error with faqRevamps.json:', error.message)
      } else {
        console.log('ℹ️  faqRevamps.json not found, skipping...')
      }
    }
    
    // Summary
    console.log('\n📊 Upload Summary:')
    console.log(`   Pages: ${allResults.pages.filter(r => r.success).length}/${allResults.pages.length} successful`)
    console.log(`   FAQs: ${allResults.faqs.filter(r => r.success).length}/${allResults.faqs.length} successful`)
    console.log(`   FAQ Revamps: ${allResults.faqRevamps.filter(r => r.success).length}/${allResults.faqRevamps.length} successful`)
    
    console.log('\n✅ Upload complete!')
    
    return allResults
  } catch (error) {
    console.error('❌ Upload failed:', error)
    throw error
  }
}

// Run if executed directly - upload Page FAQs (faqRevamp) only
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Starting Page FAQ upload...\n')
      const results = await uploadFaqRevamps('faqRevamps.json')
      console.log('\n📊 Upload Summary:')
      console.log(`   Page FAQs: ${results.filter(r => r.success).length}/${results.length} successful`)
      console.log('\n✅ Page FAQ upload complete!')
    } catch (error) {
      console.error('❌ Page FAQ upload failed:', error)
      process.exit(1)
    }
  })()
}

module.exports = { uploadPages, uploadFaqs, uploadFaqRevamps, uploadAll }

